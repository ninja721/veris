"""Original ClaimCheck prompts - exact copies"""

# Planning prompt
PLAN_PROMPT = """Instructions
The available knowledge is insufficient to assess the Claim.
Therefore, propose a set of actions to retrieve new and helpful evidence. Adhere to the following rules:
The actions available are listed under Valid Actions, including a short description for each action. No other actions are possible at this moment.
For each action, use the formatting as specified in Valid Actions.
Include all actions in a single Markdown code block at the end of your answer.
Propose as few actions as possible but as much as needed. Do not propose similar or previously used actions.
Consider Both Modalities Equally: Avoid focusing too much on one modality at the expense of the other, but always check whether the text claim is true or false.
Compare Image and Caption: Verify the context of the image and caption.

IMPORTANT SEARCH STRATEGY:
- Extract the exact event/entity name from the claim
- Search for official sources (add "official", "devfolio", "website", "announcement")
- Search for the event schedule/dates (add "schedule", "dates", "2025")
- Search for news about the event
- Use multiple specific queries to find authoritative sources

Valid Actions:
{valid_actions}

Examples:
{examples}

Record:
{record}

Claim: {claim}
Your Actions:
"""

# Evidence summarization prompt
SUMMARIZE_PROMPT = """
Instructions
In order to find evidence that helps your fact-check, you just ran a web search, which yielded a Search Result.
Your task right now is to summarize the Search Result concisely in at most 5 sentences, only including information that is relevant to the Claim you are checking.
What to include:
Information that might be useful for fact-checking the claim (see Record).
If available: the release date as well as the author or the publisher (e.g., the media company) of the search result.
Do NOT include:
Advertisements.
Any other information unrelated to the Record or the Claim.
Additional Rules:
Do not add any additional information besides the information in the Search Result. Also, do not add any information that is not related to the claim, even if it is mentioned in the Search Result.
If the Search Result doesn't contain any relevant information for the fact-checking work, print only one word in capital letters, do not include anything else: NONE.
Keep your writing style consistent with the provided Examples.
Try to filter out relevant information even if the Search Result is in a different language.

Claim: {claim}

Evidence:
{url}
{search_result}

Record:
{record}


Your Summary:
"""

# Evidence synthesis prompt
DEVELOP_PROMPT = """
Instructions
You just retrieved new Evidence. Now, analyze the Claim's veracity using the evidence. Always adhere to the following rules:
Focus on developing new insights. Do not repeat larger parts from the Record. Do not restate the Claim.
Write down your thoughts step-by-step. Whenever necessary, you may elaborate in more detail.
Depending on the topic's complexity, invest one to three paragraphs. The fewer, the better.
If you find that there is insufficient information to verify the Claim, explicitly state what information is missing.
If you cite web sources, always refer to them by including their URL as a Markdown hyperlink.
Use information only from the recorded evidence:
Avoid inserting information that is not implied by the evidence. You may use commonsense knowledge, though.

If it is extremely necessary to retrieve more evidence, you can propose actions to the user. If not necessary, do not add anything else other than the reasoning. 
Adhere to the following rules:
The actions available are listed under Valid Actions, including a short description for each action. No other actions are possible at this moment.
For each action, use the formatting as specified in Valid Actions.
Propose as few actions as possible but as much as needed. Do not propose similar or previously used actions.
Include all actions in a single Markdown code block at the end of your answer.

Valid Actions:
geolocate: Determine the country where an image was taken by providing an image ID.
reverse search: Perform a reverse image search on the web for similar images.
web search: Run an open web search for related webpages.
image search: Retrieve related images for a given query.
NONE: Do not propose any actions.

Examples:
geolocate(<image:k>)
reverse_search(<image:k>)
web_search("New Zealand Food Bill 2020")
image_search("China officials white suits carry people")
NONE

Record:
{record}
Your Analysis:
"""

# Judgment prompt
JUDGE_PROMPT = """
Instructions
Determine the Claim's veracity by following these steps:
1. Briefly summarize the key insights from the fact-check (see Record) in at most one paragraph.
2. Write one paragraph about which one of the Decision Options applies best. Include the most appropriate decision option at the end and enclose it in backticks
like `this`.

Decision Options:
{options}

Rules:
{rules}

Record:
{record}
Your Judgement:
"""
