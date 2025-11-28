"""
ClaimCheck - State-of-the-art fact-checking tool
Ported from original ClaimCheck to use OpenAI/Gemini APIs
"""

from .factchecker import verify_claim_advanced, claimcheck_tool

__all__ = ['verify_claim_advanced', 'claimcheck_tool']
