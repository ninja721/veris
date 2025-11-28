"""Web search and scraping tools"""
import json
import logging
import requests
import concurrent.futures
from typing import Optional, List, Tuple
from datetime import datetime
from bs4 import BeautifulSoup
from .config import SERPER_API_KEY

logger = logging.getLogger(__name__)


def web_search(query: str, date: str, top_k: int = 3) -> Tuple[List[str], List[str]]:
    """
    Original ClaimCheck web search using Serper API
    Returns: (urls, snippets)
    """
    if not SERPER_API_KEY:
        logger.warning("SERPER_API_KEY not set")
        return [], []
    
    try:
        # Format date for Serper API
        end_date = datetime.strptime(date, "%d-%m-%Y").strftime('%d/%m/%Y')
        
        url = "https://google.serper.dev/search"
        payload = json.dumps({
            "q": query,
            "num": top_k,
            "tbs": f"cdr:1,cd_min:1/1/1900,cd_max:{end_date}"
        })
        headers = {
            'X-API-KEY': SERPER_API_KEY,
            'Content-Type': 'application/json'
        }
        
        response = requests.post(url, headers=headers, data=payload, timeout=10)
        
        if response.status_code == 200:
            results = response.json()
            urls = []
            snippets = []
            
            for item in results.get("organic", []):
                if len(urls) >= top_k:
                    break
                link = item.get("link", "")
                if link and not link.endswith("pdf"):
                    urls.append(link)
                    snippets.append(item.get("snippet", ""))
            
            return urls, snippets
        else:
            logger.error(f"Serper API error: {response.status_code}")
            return [], []
    
    except Exception as e:
        logger.error(f"Web search failed: {e}")
        return [], []


def scrape_url_content(url: str) -> Optional[str]:
    """
    Original ClaimCheck web scraper
    Returns scraped content or None
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }
    
    def _scrape():
        try:
            page = requests.get(url, headers=headers, timeout=15)
            if page.status_code in [403, 404]:
                return None
            page.raise_for_status()
            
            soup = BeautifulSoup(page.content, 'html.parser')
            if soup.article:
                soup = soup.article
            
            text = soup.get_text(separator=' ', strip=True)
            text = ' '.join(text.split())  # Clean whitespace
            return text
        except Exception:
            return None
    
    # Execute with timeout (original uses 15s)
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(_scrape)
        try:
            result = future.result(timeout=15)
            return result if result else None
        except concurrent.futures.TimeoutError:
            return "Unable to Scrape"
