"""ClaimCheck modules - planning, summarization, synthesis, evaluation"""
from .llm import prompt_llm
from .prompts import PLAN_PROMPT, SUMMARIZE_PROMPT, DEVELOP_PROMPT, JUDGE_PROMPT


def plan_searches(claim: str, record: str = "") -> str:
    """Original ClaimCheck planning module"""
    action_definitions = {
        "web_search": {
            "desc": "Run an open web search for related webpages.",
            "example": 'web_search("New Zealand Food Bill 2020")'
        }
    }
    
    valid_actions = "\n".join([f"{a}: {action_definitions[a]['desc']}" for a in action_definitions])
    examples = "\n".join([f"{action_definitions[a]['example']}" for a in action_definitions])
    
    prompt = PLAN_PROMPT.format(
        valid_actions=valid_actions,
        examples=examples,
        record=record,
        claim=claim
    )
    
    return prompt_llm(prompt, think=True)


def summarize_evidence(claim: str, search_result: str, url: str, record: str) -> str:
    """Original ClaimCheck evidence summarization"""
    # Limit search result to avoid token limits
    limited_result = search_result[:5000] if search_result else ""
    
    prompt = SUMMARIZE_PROMPT.format(
        claim=claim,
        search_result=limited_result,
        url=url,
        record=record
    )
    return prompt_llm(prompt, think=True)


def develop_reasoning(record: str) -> str:
    """Original ClaimCheck evidence synthesis"""
    prompt = DEVELOP_PROMPT.format(record=record)
    return prompt_llm(prompt, think=True)


def judge_verdict(record: str, decision_options: str, rules: str) -> str:
    """Original ClaimCheck verdict judgment"""
    prompt = JUDGE_PROMPT.format(
        record=record,
        options=decision_options,
        rules=rules
    )
    return prompt_llm(prompt, think=True)
