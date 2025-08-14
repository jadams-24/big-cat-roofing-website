#!/usr/bin/env python3
"""
Warren Page Keyword Density Analyzer
Analyzes keyword usage and density for SEO optimization
"""

import re
from bs4 import BeautifulSoup
from collections import Counter

def extract_visible_text(html_file):
    """Extract visible text from HTML file"""
    with open(html_file, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()
    
    # Get text
    text = soup.get_text()
    
    # Break into lines and remove leading/trailing space
    lines = (line.strip() for line in text.splitlines())
    # Break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # Drop blank lines
    text = ' '.join(chunk for chunk in chunks if chunk)
    
    return text.lower()

def count_keyword_occurrences(text, keywords):
    """Count occurrences of specific keywords/phrases"""
    results = {}
    
    for keyword in keywords:
        # Use word boundaries for more accurate counting
        pattern = r'\b' + re.escape(keyword.lower()) + r'\b'
        matches = re.findall(pattern, text.lower())
        results[keyword] = len(matches)
    
    return results

def calculate_density(text, keyword_counts):
    """Calculate keyword density as percentage"""
    words = text.split()
    total_words = len(words)
    
    densities = {}
    for keyword, count in keyword_counts.items():
        word_count = len(keyword.split())
        density = (count * word_count / total_words) * 100 if total_words > 0 else 0
        densities[keyword] = {
            'count': count,
            'density': round(density, 2)
        }
    
    return densities, total_words

def analyze_warren_page():
    """Analyze the Warren page for keyword optimization"""
    
    # Target keywords to analyze
    target_keywords = [
        # Primary targets
        'roofers warren',
        'roof repair warren',
        
        # Variations
        'warren roofing contractors',
        'roofing company warren',
        'warren roof repair',
        'roof repair warren mi',
        'warren roofers',
        'roofers warren mi',
        
        # Existing important keywords to preserve
        'warren',
        'roofing',
        'roof',
        'roofer',
        'top',
        'gaf',
        'big cat roofing',
        
        # Service keywords
        'roof replacement',
        'emergency',
        'commercial',
        'residential'
    ]
    
    # Analyze the file
    file_path = '/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website/public_html/service-areas/warren.html'
    
    print("=" * 80)
    print("WARREN PAGE KEYWORD DENSITY ANALYSIS")
    print("=" * 80)
    
    # Extract text
    text = extract_visible_text(file_path)
    
    # Count keywords
    keyword_counts = count_keyword_occurrences(text, target_keywords)
    
    # Calculate densities
    densities, total_words = calculate_density(text, keyword_counts)
    
    print(f"\nTotal Words: {total_words}")
    print("-" * 80)
    
    # Sort by count for display
    sorted_keywords = sorted(densities.items(), key=lambda x: x[1]['count'], reverse=True)
    
    print("\n📊 PRIMARY TARGET KEYWORDS:")
    print("-" * 40)
    primary = ['roofers warren', 'roof repair warren']
    for keyword in primary:
        if keyword in densities:
            data = densities[keyword]
            status = "✅" if data['count'] > 0 else "❌"
            print(f"{status} '{keyword}': {data['count']} occurrences ({data['density']}% density)")
    
    print("\n🔍 KEYWORD VARIATIONS:")
    print("-" * 40)
    variations = [
        'warren roofing contractors',
        'roofing company warren', 
        'warren roof repair',
        'roof repair warren mi',
        'warren roofers',
        'roofers warren mi'
    ]
    for keyword in variations:
        if keyword in densities:
            data = densities[keyword]
            if data['count'] > 0:
                print(f"✅ '{keyword}': {data['count']} occurrences ({data['density']}% density)")
    
    print("\n⚡ HIGH-FREQUENCY KEYWORDS:")
    print("-" * 40)
    for keyword, data in sorted_keywords[:10]:
        if keyword not in primary and keyword not in variations:
            print(f"• '{keyword}': {data['count']} occurrences ({data['density']}% density)")
    
    # SEO recommendations
    print("\n💡 SEO ANALYSIS:")
    print("-" * 40)
    
    # Check primary keyword optimization
    primary_total = sum(densities[kw]['count'] for kw in primary if kw in densities)
    if primary_total < 3:
        print("⚠️  Primary keywords need more occurrences (aim for 3-5 each)")
    elif primary_total > 10:
        print("⚠️  Possible over-optimization - reduce keyword usage")
    else:
        print("✅ Primary keyword frequency is optimal")
    
    # Check keyword diversity
    active_variations = sum(1 for kw in variations if kw in densities and densities[kw]['count'] > 0)
    if active_variations < 3:
        print("⚠️  Add more keyword variations for better coverage")
    else:
        print(f"✅ Good keyword variation ({active_variations} different phrases used)")
    
    # Check Warren location emphasis
    warren_count = densities.get('warren', {}).get('count', 0)
    if warren_count < 15:
        print("⚠️  'Warren' should appear more frequently for local SEO")
    elif warren_count > 50:
        print("⚠️  'Warren' may be over-used")
    else:
        print(f"✅ Good local emphasis with 'Warren' ({warren_count} occurrences)")
    
    print("\n📈 OPTIMIZATION SUMMARY:")
    print("-" * 40)
    print(f"• Total word count: {total_words}")
    print(f"• 'Warren' mentions: {densities.get('warren', {}).get('count', 0)}")
    print(f"• Primary keywords integrated: {primary_total} times")
    print(f"• Keyword variations used: {active_variations}")
    print(f"• Overall keyword diversity: {'Good' if active_variations >= 3 else 'Needs improvement'}")
    
    # Check for preserved keywords
    print("\n✅ PRESERVED EXISTING KEYWORDS:")
    print("-" * 40)
    preserved = ['top', 'gaf', 'big cat roofing', 'roof replacement', 'emergency']
    for keyword in preserved:
        if keyword in densities and densities[keyword]['count'] > 0:
            print(f"✓ '{keyword}' preserved ({densities[keyword]['count']} occurrences)")
    
    print("=" * 80)

if __name__ == "__main__":
    analyze_warren_page()