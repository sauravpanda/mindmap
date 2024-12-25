import requests
from bs4 import BeautifulSoup
from litellm import completion
import json
from urllib.parse import urlparse
import os
from markitdown import MarkItDown


def extract_content_from_url(url):
    """Extract main text content from a given URL using MarkItDown"""
    try:
        response = requests.get(url)
        md = MarkItDown()
        result = md.convert_string(response.text, content_type='html')
        return result.text_content[:4000]  # Limit content length for API
    except Exception as e:
        return f"Error extracting content: {str(e)}"


def generate_mindmap(content):
    """Generate mindmap structure using LiteLLM"""
    prompt = """
    Create a hierarchical mindmap structure for the following content. 
    Format the output as a JSON object with nested nodes where each node has:
    - "topic": the main topic
    - "subtopics": an array of child nodes
    
    Keep it concise and well-structured. Content:
    
    {content}
    """
    
    try:
        response = completion(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "user",
                "content": prompt.format(content=content)
            }],
            temperature=0.7,
            max_tokens=1000
        )
        
        # Extract and parse the JSON response
        mindmap_data = json.loads(response.choices[0].message.content)
        return mindmap_data
    except Exception as e:
        return {"error": f"Failed to generate mindmap: {str(e)}"}

def main(input_source):
    """Main function to process input and generate mindmap"""
    # Check if input is a URL
    try:
        parsed = urlparse(input_source)
        if parsed.scheme and parsed.netloc:
            content = extract_content_from_url(input_source)
        else:
            content = input_source
            
        # Generate mindmap
        mindmap = generate_mindmap(content)
        
        # Pretty print the result
        print(json.dumps(mindmap, indent=2))
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) != 2:
        print("Usage: python main.py <content_or_url>")
        sys.exit(1)
        
    main(sys.argv[1])
