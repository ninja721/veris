"""LLM wrapper - supports OpenAI and Gemini"""
import logging
from .config import (
    USE_OPENAI, OPENAI_API_KEY, OPENAI_MODEL,
    GEMINI_API_KEY, GEMINI_MODEL
)

logger = logging.getLogger(__name__)

# Initialize APIs
if USE_OPENAI and OPENAI_API_KEY:
    import openai
    openai.api_key = OPENAI_API_KEY

if GEMINI_API_KEY:
    import google.generativeai as genai
    genai.configure(api_key=GEMINI_API_KEY)


def prompt_llm(prompt: str, think: bool = True) -> str:
    """
    LLM wrapper matching original Ollama behavior
    Supports both OpenAI and Gemini
    """
    
    # Try OpenAI first if configured
    if USE_OPENAI and OPENAI_API_KEY:
        try:
            client = openai.OpenAI(api_key=OPENAI_API_KEY)
            response = client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=2048
            )
            output = response.choices[0].message.content.strip()
            
            # Handle thinking tags (from original Ollama)
            if '<think>' in output[:50]:
                output = output.split('</think>')[-1].strip()
            
            return output
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return ""
    
    # Fallback to Gemini
    if not GEMINI_API_KEY:
        logger.error("No API key available")
        return ""
    
    try:
        import google.generativeai as genai
        
        # Match Ollama's generation config
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 40,
            "max_output_tokens": 2048,
        }
        
        model = genai.GenerativeModel(
            GEMINI_MODEL,
            generation_config=generation_config
        )
        
        if not think:
            prompt = "Respond directly without showing reasoning.\n\n" + prompt
        
        response = model.generate_content(prompt)
        output = response.text.strip()
        
        # Handle thinking tags
        if '<think>' in output[:50]:
            output = output.split('</think>')[-1].strip()
        
        return output
    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        return ""
