import axios from 'axios';
import type { RawContentItem } from '../types';
import { logger, withErrorHandling } from '../utils/logger';

/**
 * ADK Agent Client
 * Sends content to deployed Veris ADK agent for processing
 */
export class ADKAgentClient {
  private agentUrl: string;
  private userId: string;
  private sessionId: string | null = null;

  constructor(agentUrl: string = process.env.ADK_AGENT_URL || '') {
    this.agentUrl = agentUrl;
    this.userId = 'crawler_service';
  }

  /**
   * Create a session with the ADK agent
   */
  private async createSession(): Promise<string> {
    const response = await axios.post(
      `${this.agentUrl}/apps/veris_agent/users/${this.userId}/sessions`,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000, // 2 minutes for session creation
      }
    );
    return response.data.id;
  }

  /**
   * Ensure we have a valid session
   */
  private async ensureSession(): Promise<string> {
    if (!this.sessionId) {
      this.sessionId = await this.createSession();
      logger.info('Created ADK session', { sessionId: this.sessionId });
    }
    return this.sessionId;
  }

  /**
   * Send article to ADK agent for claim extraction, verification, and storage
   */
  async processArticle(rawContent: RawContentItem): Promise<boolean> {
    if (!this.agentUrl) {
      logger.error('ADK_AGENT_URL not configured');
      return false;
    }

    logger.info('Sending to ADK agent', { 
      source: rawContent.source, 
      url: rawContent.url 
    });

    const result = await withErrorHandling(
      () => this.sendToAgent(rawContent),
      `ADK agent: ${rawContent.url}`
    );

    return result || false;
  }

  private async sendToAgent(rawContent: RawContentItem): Promise<boolean> {
    const sessionId = await this.ensureSession();
    const message = this.formatMessage(rawContent);

    try {
      // Send request - agent processes in background
      const response = await axios.post(
        `${this.agentUrl}/run_sse`,
        {
          app_name: 'veris_agent',
          user_id: this.userId,
          session_id: sessionId,
          newMessage: {
            role: 'user',
            parts: [{ text: message }],
          },
        },
        {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
          },
          timeout: 120000, // 2 minutes - agent may take time for complex claims
          validateStatus: (status) => status < 500,
        }
      );

      // Check if request was accepted
      if (response.status === 200 || response.status === 202) {
        logger.info('✅ Agent processing content', { 
          url: rawContent.url,
          status: response.status,
        });
        this.sessionId = null;
        return true;
      }

      // Handle session errors
      if (response.status === 404 || response.status === 401) {
        logger.warn('⚠️ Session invalid, retrying', {
          url: rawContent.url,
        });
        this.sessionId = null;
        throw new Error('Session invalid');
      }

      // Handle rate limits
      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }

      logger.warn('⚠️ Agent rejected request', {
        url: rawContent.url,
        status: response.status,
      });
      return false;

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404 || error.response?.status === 401) {
          this.sessionId = null;
          throw new Error('Session invalid');
        }

        if (error.response?.status === 429 || error.message.includes('quota')) {
          throw new Error('Quota limit hit');
        }

        // Timeout after 2 minutes means agent is still processing
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          logger.info('⏱️ Processing in background (may take time for complex claims)', {
            url: rawContent.url,
          });
          this.sessionId = null;
          return true; // Consider it successful - agent is working
        }
        
        logger.error('❌ Agent error', {
          url: rawContent.url,
          error: error.message,
        });
      }
      throw error;
    }
  }

  /**
   * Format article content as message for ADK agent
   */
  private formatMessage(rawContent: RawContentItem): string {
    const title = rawContent.metadata.title || 'Untitled';
    const author = rawContent.metadata.author || 'Unknown';
    const publishedAt = rawContent.metadata.publishedAt 
      ? new Date(rawContent.metadata.publishedAt).toLocaleDateString()
      : 'Unknown date';
    
    const content = rawContent.rawText || '';
    
    return `Article from ${rawContent.source}

Title: ${title}
Author: ${author}
Published: ${publishedAt}
URL: ${rawContent.url}

Content:
${content}

Please extract and verify all claims from this article.`;
  }

  /**
   * Process multiple articles with retry logic
   */
  async processArticleBatch(rawContents: RawContentItem[]): Promise<number> {
    let successCount = 0;
    let retryDelay = 5000;
    const maxRetryDelay = 60000; // Max 1 minute between retries

    for (let i = 0; i < rawContents.length; i++) {
      const content = rawContents[i];
      
      logger.info(`Processing ${i + 1}/${rawContents.length}`, {
        source: content.source,
      });

      let success = false;
      let attempts = 0;
      const maxAttempts = 3;

      while (!success && attempts < maxAttempts) {
        attempts++;
        
        try {
          success = await this.processArticle(content);
          
          if (success) {
            successCount++;
            retryDelay = 5000;
            logger.info(`✅ Sent to agent (${successCount}/${rawContents.length})`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            break;
          }
        } catch (error: any) {
          const isQuotaError = error?.message?.includes('quota') || 
                              error?.message?.includes('429');
          
          if (isQuotaError) {
            logger.warn(`⚠️ Rate limit, waiting ${retryDelay / 1000}s`, {
              attempt: attempts,
            });
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            retryDelay = Math.min(retryDelay * 2, maxRetryDelay);
          } else {
            logger.error(`❌ Failed, skipping`, {
              url: content.url,
              error: error?.message,
            });
            break;
          }
        }
      }
    }

    logger.info('Batch complete', { 
      total: rawContents.length,
      successful: successCount,
    });

    return successCount;
  }
}
