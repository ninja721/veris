import logging
import os
import sys
from google.adk.agents import LlmAgent
from . import prompt
from dotenv import load_dotenv

# Add tools directory to path for claimcheck import
tools_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'tools')
if tools_path not in sys.path:
    sys.path.insert(0, tools_path)

from claimcheck import claimcheck_tool

load_dotenv()
logger = logging.getLogger(__name__)

GEMINI_MODEL = os.getenv("GEMINI_MODEL_LATEST", "gemini-3-pro-preview")
DESCRIPTION = "Verify claims using state-of-the-art ClaimCheck methodology with iterative evidence gathering. Returns verdict, confidence, evidence summary, and source URLs."

verify_claim_agent = None
try:
    verify_claim_agent = LlmAgent(
        model=GEMINI_MODEL,
        name="verify_claim_agent",
        description=DESCRIPTION,
        instruction=prompt.VERIFY_CLAIM_PROMPT,
        output_key="verification_result",
        tools=[claimcheck_tool]  # Only ClaimCheck - state-of-the-art
    )
    logger.info(f"✅ Agent '{verify_claim_agent.name}' created with ClaimCheck tool using model '{GEMINI_MODEL}'.")
except Exception as e:
    logger.error(f"❌ Could not create verify claim agent. Error: {e}")