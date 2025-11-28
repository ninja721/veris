"""Configuration for ClaimCheck"""
import os
import logging

logger = logging.getLogger(__name__)

# API Keys
SERPER_API_KEY = os.getenv("SERPER_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Model selection
USE_OPENAI = os.getenv("USE_OPENAI", "true").lower() == "true"  # Default to OpenAI
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")  # Use full gpt-4o for better results
GEMINI_MODEL = os.getenv("GEMINI_MODEL_CLAIMCHECK", "gemini-2.5-pro")

# Verify API keys
if USE_OPENAI:
    if OPENAI_API_KEY:
        logger.info(f"Using OpenAI API ({OPENAI_MODEL})")
    else:
        logger.warning("USE_OPENAI=true but OPENAI_API_KEY not set, will try Gemini")
        USE_OPENAI = False

if not USE_OPENAI:
    if GEMINI_API_KEY:
        logger.info(f"Using Gemini API ({GEMINI_MODEL})")
    else:
        logger.error("No API keys configured! Set OPENAI_API_KEY or GEMINI_API_KEY")

if not SERPER_API_KEY:
    logger.warning("SERPER_API_KEY not set - web search will not work")

# Original ClaimCheck Rules
RULES_PROMPT = """
Supported
- The claim is directly and clearly backed by strong, credible evidence. Minor uncertainty or lack of detail does not disqualify a claim from being Supported if the main point is well-evidenced.
- Use Supported if the overall weight of evidence points to the claim being true, even if there are minor caveats or not every detail is confirmed.

Refuted
- The claim is contradicted by strong, credible evidence, or is shown to be fabricated, deceptive, or false in its main point.
- Use Refuted if the central elements of the claim are disproven, even if some minor details are unclear.
- Lack of any credible sources supporting the claim does not mean "Not Enough Evidence" - it means the claim is Refuted.

Conflicting Evidence/Cherrypicking
- Only use this if there are reputable sources that directly and irreconcilably contradict each other about the main point of the claim, and no clear resolution is possible after careful analysis.
- Do NOT use this for minor disagreements, incomplete evidence, or if most evidence points one way but a few sources disagree.

Not Enough Evidence
- Only use this if there is genuinely no relevant evidence available after a thorough search, or if the claim is too vague or ambiguous to evaluate.
- Do NOT use this if there is some evidence, even if it is weak, or if the claim is mostly clear but not every detail is confirmed.
- This is a last-resort option only.
"""
