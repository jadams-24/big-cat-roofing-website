#!/usr/bin/env python3
"""
Title-Content Alignment Analyzer for BC Roofing Website
Checks if page titles are properly reflected in the page content
"""

import os
import re
from bs4 import BeautifulSoup
from collections import defaultdict
import json
from pathlib import Path

# Common stop words to ignore
STOP_WORDS = {
    'the', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for', 'a', 'an',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
    'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could',
    'may', 'might', 'must', 'can', 'shall', 'with', 'by', 'from',
    'up', 'about', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'between', 'under', 'again', 'further', 'then',
    'once', '|', '-', '–', '—', 'your', 'our'
}

# Navigation and footer identifiers to exclude
EXCLUDE_SELECTORS = [
    'nav', 'header', 'footer', '.navbar', '.navigation', '.menu',
    '.footer', '.header', '#navigation', '#footer', '#header',
    '.breadcrumb', '.cookie', 'script', 'style', 'meta', 'noscript'
]

def normalize_word(word):
    """Normalize a word for comparison (lowercase, remove punctuation, handle plurals)"""
    # Remove punctuation and convert to lowercase
    word = re.sub(r'[^\w\s]', '', word.lower())
    
    # Basic singular/plural handling
    if word.endswith('ies'):
        return word[:-3] + 'y'
    elif word.endswith('es'):
        return word[:-2]
    elif word.endswith('s') and len(word) > 3:
        return word[:-1]
    
    return word

def extract_title_words(title):
    """Extract meaningful words from a title"""
    # Split by common separators
    title = re.sub(r'[|–—-]', ' ', title)
    words = title.split()
    
    # Filter out stop words and normalize
    meaningful_words = []
    for word in words:
        normalized = normalize_word(word)
        if normalized and normalized not in STOP_WORDS and len(normalized) > 2:
            meaningful_words.append(normalized)
    
    return meaningful_words

def extract_body_content(soup):
    """Extract main body content, excluding navigation and footer"""
    # Remove excluded elements
    for selector in EXCLUDE_SELECTORS:
        for element in soup.select(selector):
            element.decompose()
    
    # Get text from body
    body = soup.find('body')
    if not body:
        return ""
    
    # Get all text content
    text = body.get_text(separator=' ', strip=True)
    
    # Normalize the text
    text = re.sub(r'\s+', ' ', text)
    
    return text.lower()

def check_words_in_content(title_words, content):
    """Check which title words are missing from content"""
    missing_words = []
    found_words = []
    
    for word in title_words:
        # Check for the word and common variations
        variations = [
            word,
            word + 's',  # plural
            word + 'es', # plural
            word + 'ing', # gerund
            word + 'ed',  # past tense
        ]
        
        found = False
        for variation in variations:
            if variation in content:
                found = True
                break
        
        if found:
            found_words.append(word)
        else:
            missing_words.append(word)
    
    return found_words, missing_words

def suggest_content_improvements(page_file, missing_words, soup):
    """Suggest where to add missing title words"""
    suggestions = []
    
    # Check if there's an H1 tag
    h1 = soup.find('h1')
    if h1:
        h1_text = h1.get_text().lower()
        for word in missing_words:
            if word not in h1_text:
                suggestions.append(f"Consider adding '{word}' to the H1 heading")
    
    # Check first paragraph
    first_para = soup.find('p')
    if first_para:
        para_text = first_para.get_text().lower()
        for word in missing_words:
            if word not in para_text:
                suggestions.append(f"Add '{word}' to the opening paragraph for better SEO")
    
    # General suggestions based on word type
    for word in missing_words:
        if 'roofing' in word or 'roof' in word:
            suggestions.append(f"Emphasize '{word}' in service descriptions")
        elif 'michigan' in word or 'troy' in word:
            suggestions.append(f"Include '{word}' in location-specific content sections")
        elif 'service' in word or 'repair' in word:
            suggestions.append(f"Mention '{word}' in the services overview section")
        elif 'commercial' in word or 'residential' in word:
            suggestions.append(f"Highlight '{word}' in the appropriate customer segment section")
    
    return suggestions

def analyze_website(root_path):
    """Main analysis function"""
    results = {
        'total_pages': 0,
        'pages_with_issues': [],
        'summary': {},
        'recommendations': []
    }
    
    # Find all HTML files
    html_files = []
    for root, dirs, files in os.walk(root_path):
        # Skip node_modules and other build directories
        if 'node_modules' in root or '.git' in root:
            continue
        
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    results['total_pages'] = len(html_files)
    
    print(f"Found {len(html_files)} HTML files to analyze")
    print("-" * 80)
    
    for file_path in html_files:
        relative_path = os.path.relpath(file_path, root_path)
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                html_content = f.read()
            
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Extract title
            title_tag = soup.find('title')
            if not title_tag:
                print(f"⚠️  {relative_path}: No title tag found")
                continue
            
            title = title_tag.get_text().strip()
            title_words = extract_title_words(title)
            
            if not title_words:
                print(f"⚠️  {relative_path}: No meaningful words in title")
                continue
            
            # Extract body content
            body_content = extract_body_content(soup)
            
            # Check for missing words
            found_words, missing_words = check_words_in_content(title_words, body_content)
            
            if missing_words:
                page_info = {
                    'file': relative_path,
                    'title': title,
                    'title_words': title_words,
                    'missing_words': missing_words,
                    'found_words': found_words,
                    'suggestions': suggest_content_improvements(file_path, missing_words, soup)
                }
                results['pages_with_issues'].append(page_info)
                
                print(f"\n❌ {relative_path}")
                print(f"   Title: {title}")
                print(f"   Missing words: {', '.join(missing_words)}")
                if page_info['suggestions']:
                    print(f"   Suggestions:")
                    for suggestion in page_info['suggestions'][:3]:
                        print(f"     • {suggestion}")
            else:
                print(f"✅ {relative_path} - All title words found in content")
        
        except Exception as e:
            print(f"❌ Error processing {relative_path}: {str(e)}")
    
    # Generate summary
    results['summary'] = {
        'total_analyzed': results['total_pages'],
        'pages_with_issues': len(results['pages_with_issues']),
        'compliance_rate': f"{((results['total_pages'] - len(results['pages_with_issues'])) / results['total_pages'] * 100):.1f}%" if results['total_pages'] > 0 else "0%"
    }
    
    return results

def generate_report(results):
    """Generate a detailed report"""
    print("\n" + "=" * 80)
    print("TITLE-CONTENT ALIGNMENT REPORT")
    print("=" * 80)
    
    print(f"\n📊 SUMMARY")
    print(f"   Total pages analyzed: {results['summary']['total_analyzed']}")
    print(f"   Pages with missing title words: {results['summary']['pages_with_issues']}")
    print(f"   Compliance rate: {results['summary']['compliance_rate']}")
    
    if results['pages_with_issues']:
        print(f"\n⚠️  PAGES REQUIRING ATTENTION ({len(results['pages_with_issues'])} pages)")
        print("-" * 80)
        
        # Group by severity (number of missing words)
        by_severity = defaultdict(list)
        for page in results['pages_with_issues']:
            severity = len(page['missing_words'])
            by_severity[severity].append(page)
        
        # Sort by severity (most missing words first)
        for severity in sorted(by_severity.keys(), reverse=True):
            pages = by_severity[severity]
            print(f"\n🔴 HIGH PRIORITY - {severity} missing word(s):")
            
            for page in pages:
                print(f"\n   📄 {page['file']}")
                print(f"      Title: \"{page['title']}\"")
                print(f"      Missing: {', '.join(page['missing_words'])}")
                
                if page['suggestions']:
                    print(f"      Recommendations:")
                    for suggestion in page['suggestions'][:3]:
                        print(f"        → {suggestion}")
    
    # Global recommendations
    print(f"\n💡 GENERAL RECOMMENDATIONS")
    print("-" * 80)
    
    # Analyze patterns in missing words
    all_missing = []
    for page in results['pages_with_issues']:
        all_missing.extend(page['missing_words'])
    
    word_frequency = defaultdict(int)
    for word in all_missing:
        word_frequency[word] += 1
    
    if word_frequency:
        print(f"\n   Most commonly missing words across all pages:")
        for word, count in sorted(word_frequency.items(), key=lambda x: x[1], reverse=True)[:5]:
            print(f"     • '{word}' - missing on {count} page(s)")
            if count > 3:
                print(f"       ⚠️  Consider adding '{word}' to your global content strategy")
    
    print(f"\n   Best Practices:")
    print(f"     1. Include all title keywords in the first 100 words of content")
    print(f"     2. Use title keywords in H1 and H2 headings")
    print(f"     3. Naturally incorporate keywords in meta descriptions")
    print(f"     4. Ensure title keywords appear in image alt text where relevant")
    print(f"     5. Add keywords to the page URL structure when possible")
    
    # Save results to JSON
    with open('title_content_analysis.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📁 Detailed results saved to: title_content_analysis.json")
    print("=" * 80)

if __name__ == "__main__":
    # Set the root path for analysis
    root_path = "/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website"
    
    if not os.path.exists(root_path):
        print(f"Error: Path {root_path} does not exist")
        exit(1)
    
    print("🔍 Starting Title-Content Alignment Analysis...")
    print(f"   Analyzing: {root_path}")
    print("-" * 80)
    
    results = analyze_website(root_path)
    generate_report(results)
    
    print("\n✅ Analysis complete!")