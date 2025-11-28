"""
ClaimCheck FactChecker - Original implementation logic
Ported to use OpenAI/Gemini instead of Ollama
"""
import re
import logging
import concurrent.futures
from typing import Dict, Optional
from datetime import datetime
from google.adk.tools import FunctionTool

from .config import RULES_PROMPT
from .modules import plan_searches, summarize_evidence, develop_reasoning, judge_verdict
from .web_tools import web_search, scrape_url_content

logger = logging.getLogger(__name__)


class ClaimCheckVerifier:
    """Original ClaimCheck FactChecker logic"""
    
    def __init__(self, claim: str, date: str, max_actions: int = 2):
        self.claim = claim
        self.date = date
        self.max_actions = max_actions
        self.identifier = datetime.now().strftime("%m%d%Y%H%M%S")
        
        # In-memory report (no file saving)
        self.report = {
            "claim": self.claim,
            "date": self.date,
            "identifier": self.identifier,
            "actions": {},
            "reasoning": [],
            "judged_verdict": None,
            "verdict": None
        }
        
        self.record_text = f"# Claim: {claim}\n\n"
    
    def get_report(self) -> str:
        """Get current report as markdown text"""
        return self.record_text
    
    def append_to_report(self, text: str):
        """Append to report"""
        self.record_text += text + "\n\n"
    
    def process_action_line(self, line: str):
        """
        Process a single search action
        EXACT original ClaimCheck logic
        """
        try:
            m = re.match(r'(\w+)_search\("([^"]+)"\)', line)
            if not m:
                return
            
            action, query = m.groups()
            identifier = f'{action}: {query}'
            
            # Skip duplicates (original behavior)
            if identifier in self.report["actions"]:
                logger.info(f"Skipping duplicate action: {identifier}")
                return
            
            if action == 'web':
                action_entry = {
                    "action": "web_search",
                    "query": query,
                    "results": {}
                }
                self.report["actions"][identifier] = action_entry
                
                # Search (original: top_k=3)
                urls, snippets = web_search(query, self.date, top_k=3)
                
                logger.info(f"Found {len(urls)} URLs for query: {query}")
                
                # Initialize results with snippets
                for url, snippet in zip(urls, snippets):
                    self.report["actions"][identifier]["results"][url] = {
                        "snippet": snippet,
                        "url": url,
                        "summary": None
                    }
                
                # Process each result (original uses ThreadPoolExecutor)
                def process_result(url):
                    scraped_content = scrape_url_content(url)
                    if not scraped_content or scraped_content == "Unable to Scrape":
                        logger.info(f"Failed to scrape: {url}")
                        return
                    
                    summary = summarize_evidence(
                        self.claim,
                        scraped_content,
                        url,
                        record=self.get_report()
                    )
                    
                    # Original: skip if "NONE"
                    if "NONE" in summary:
                        logger.info(f"Skipping irrelevant evidence: {url}")
                        return
                    
                    logger.info(f"Evidence from {url}: {summary[:100]}...")
                    
                    # Update report
                    self.report["actions"][identifier]["results"][url]["summary"] = summary
                    self.append_to_report(f"### Evidence\n\nweb_search('{query}') summary: {summary}")
                
                # Parallel processing (original behavior)
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    list(executor.map(process_result, urls))
        
        except Exception as e:
            logger.error(f"Error processing action line '{line}': {e}")
    
    def run(self) -> Dict:
        """
        Execute full ClaimCheck pipeline
        EXACT original logic with up to 3 iterations
        """
        try:
            # === STEP 1: PLANNING ===
            actions = plan_searches(self.claim, record=self.get_report())
            self.append_to_report(f"## Iteration 1: Actions\n\n{actions}")
            logger.info(f"Proposed actions:\n{actions}")
            
            # Extract action lines (original regex)
            action_lines = [x.strip() for x in actions.split('\n')]
            action_lines = [
                line for line in action_lines 
                if re.match(r'(\w+)_search\("([^"]+)"\)', line, re.IGNORECASE)
            ]
            
            logger.info(f"Extracted {len(action_lines)} action lines")
            
            # Limit to max_actions (original behavior)
            if action_lines and len(action_lines) > self.max_actions:
                logger.info(f"Limiting to {self.max_actions} actions")
                action_lines = action_lines[:self.max_actions]
            
            # === STEP 2: INITIAL EVIDENCE GATHERING ===
            with concurrent.futures.ThreadPoolExecutor() as executor:
                list(executor.map(self.process_action_line, action_lines))
            
            # === STEP 3: ITERATIVE REFINEMENT (up to 2 more iterations) ===
            iterations = 0
            seen_action_lines = set(action_lines)
            
            while iterations <= 2:  # Original: iterations <= 2
                # Synthesize reasoning
                reasoning = develop_reasoning(record=self.get_report())
                logger.info(f"Iteration {iterations + 1} reasoning generated")
                
                self.append_to_report(f"### Reasoning\n\n{reasoning}")
                self.report["reasoning"].append(reasoning)
                
                # Check if more evidence needed (original regex)
                reasoning_action_lines = [x.strip() for x in reasoning.split('\n')]
                reasoning_action_lines = [
                    line for line in reasoning_action_lines 
                    if re.match(r'(web_search\("([^"]+)"\)|NONE)', line, re.IGNORECASE)
                ]
                
                logger.info(f"Extracted {len(reasoning_action_lines)} reasoning actions")
                
                # Stop if NONE or no actions (original behavior)
                if not reasoning_action_lines or (
                    len(reasoning_action_lines) == 1 and 
                    reasoning_action_lines[0].strip().lower() == 'none'
                ):
                    logger.info("No more evidence needed")
                    break
                
                # Stop if duplicate actions (original behavior)
                if any(line in seen_action_lines for line in reasoning_action_lines):
                    logger.info("Duplicate actions detected, stopping")
                    break
                
                seen_action_lines.update(reasoning_action_lines)
                
                # Gather more evidence
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    list(executor.map(self.process_action_line, reasoning_action_lines))
                
                iterations += 1
            
            # === STEP 4: FINAL VERDICT ===
            allowed_verdicts = {
                "Supported", "Refuted", 
                "Conflicting Evidence/Cherrypicking", 
                "Not Enough Evidence"
            }
            
            max_judge_tries = 3  # Original: 3 tries
            judge_tries = 0
            pred_verdict = ''
            
            while judge_tries < max_judge_tries:
                verdict = judge_verdict(
                    record=self.get_report(),
                    decision_options="Supported|Refuted|Conflicting Evidence/Cherrypicking|Not Enough Evidence",
                    rules=RULES_PROMPT
                )
                
                logger.info(f"Judge attempt {judge_tries + 1}")
                
                # Extract verdict from backticks (original method)
                extracted_verdict = re.search(r'`(.*?)`', verdict, re.DOTALL)
                pred_verdict = extracted_verdict.group(1).strip() if extracted_verdict else ''
                
                if pred_verdict in allowed_verdicts:
                    break
                
                judge_tries += 1
            
            # Fallback extraction (original logic)
            if pred_verdict not in allowed_verdicts:
                logger.warning("Verdict extraction failed, using fallback")
                option_counts = {}
                for option in allowed_verdicts:
                    count = verdict.lower().count(option.lower())
                    if count > 0:
                        option_counts[option] = count
                
                if option_counts:
                    pred_verdict = max(option_counts, key=option_counts.get)
                    logger.info(f"Fallback verdict: {pred_verdict}")
                else:
                    pred_verdict = "Not Enough Evidence"
            
            self.append_to_report(f"### Verdict\n\n{verdict}")
            self.report["judged_verdict"] = verdict
            self.report["verdict"] = pred_verdict
            
            # === MAP TO AGENT FORMAT ===
            status_mapping = {
                "Supported": "verified",
                "Refuted": "false",
                "Conflicting Evidence/Cherrypicking": "disputed",
                "Not Enough Evidence": "unverifiable"
            }
            
            confidence_mapping = {
                "Supported": 90,
                "Refuted": 90,
                "Conflicting Evidence/Cherrypicking": 50,
                "Not Enough Evidence": 20
            }
            
            # Extract evidence and sources
            all_evidence = []
            all_sources = []
            
            for action_data in self.report["actions"].values():
                for url, result in action_data.get("results", {}).items():
                    if result.get("summary"):
                        all_evidence.append(result["summary"])
                        all_sources.append(url)
            
            logger.info(f"Final result: {pred_verdict}, {len(all_sources)} sources")
            
            return {
                "claim": self.claim,
                "verification_status": status_mapping.get(pred_verdict, "unverifiable"),
                "confidence": confidence_mapping.get(pred_verdict, 20),
                "evidence": " ".join(all_evidence) if all_evidence else "No relevant evidence found",
                "sources": all_sources,
                "reasoning": " ".join(self.report["reasoning"]) if self.report["reasoning"] else verdict
            }
        
        except Exception as e:
            logger.error(f"ClaimCheck verification failed: {e}", exc_info=True)
            return {
                "claim": self.claim,
                "verification_status": "unverifiable",
                "confidence": 0,
                "evidence": f"Error during verification: {str(e)}",
                "sources": [],
                "reasoning": "Verification process encountered an error"
            }


def verify_claim_advanced(claim: str, date: Optional[str] = None) -> Dict:
    """
    State-of-the-art fact-checking using ClaimCheck methodology.
    
    Performs iterative evidence gathering (up to 3 rounds), web search with date filtering,
    full article scraping, multi-stage reasoning synthesis, and strict verdict judgment.
    
    Args:
        claim: The claim to verify (required)
        date: Date in DD-MM-YYYY format, defaults to today if not provided
    
    Returns:
        dict with keys:
            - verification_status: verified|false|disputed|unverifiable
            - confidence: 0-100
            - evidence: Summary of all evidence found
            - sources: List of source URLs
            - reasoning: Detailed reasoning for the verdict
    """
    if not date:
        date = datetime.now().strftime("%d-%m-%Y")
    
    verifier = ClaimCheckVerifier(claim=claim, date=date, max_actions=3)  # Allow more initial searches
    return verifier.run()


# Create ADK FunctionTool
claimcheck_tool = FunctionTool(verify_claim_advanced)
