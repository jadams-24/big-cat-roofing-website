#!/usr/bin/env python3
"""
Title-Content Fix Generator for BC Roofing Website
Generates specific content additions to include missing title words
"""

import json
import os
from bs4 import BeautifulSoup
import re

# Load the analysis results
with open('title_content_analysis.json', 'r') as f:
    results = json.load(f)

def generate_natural_content(missing_words, page_file):
    """Generate natural content that includes missing words"""
    suggestions = {}
    
    # Handle specific pages
    if '404.html' in page_file:
        suggestions['h1'] = "Page Not Found - 404 Error"
        suggestions['opening'] = "Sorry, the page you're looking for cannot be found. It may have been moved or no longer exists."
        suggestions['additional'] = "If you found this page by following a link, please contact us so we can fix it."
    
    elif 'thank-you.html' in page_file:
        suggestions['h1'] = "Thank You from Big Cat Roofing"
        suggestions['opening'] = "Thank you for contacting Big Cat Roofing! We appreciate your interest in our roofing services."
        suggestions['additional'] = "Our Big Cat team will review your inquiry and get back to you within 24 hours."
    
    elif 'index.html' in page_file:
        if 'roofer' in missing_words:
            suggestions['h2_addition'] = "Why Choose Big Cat as Your Local Roofer"
            suggestions['content_addition'] = """As experienced roofers serving Warren and Metro Detroit, we understand the unique challenges Michigan weather presents. 
Our certified roofers have completed over 1,000 successful projects, making us the preferred roofer for homeowners throughout the area."""
    
    elif 'service-areas.html' in page_file:
        if 'roofer' in missing_words:
            suggestions['h2_addition'] = "Your Trusted Local Roofer in Every Neighborhood"
            suggestions['content_addition'] = """Big Cat Roofing serves as the go-to roofer for communities throughout Metro Detroit. 
Whether you need a residential roofer or commercial roofer, our team delivers quality workmanship in every service area."""
    
    elif 'blog/index.html' in page_file:
        if 'blog' in missing_words:
            suggestions['h1'] = "Big Cat Roofing Blog - Expert Tips & Advice"
            suggestions['opening'] = "Welcome to the Big Cat Roofing blog, your source for expert roofing tips, maintenance advice, and industry insights."
            suggestions['content_addition'] = "Browse our blog posts below to learn from our experienced roofing professionals."
    
    elif 'warren.html' in page_file:
        if 'top' in missing_words and 'roofer' in missing_words:
            suggestions['h1'] = "Top Warren MI Roofer - Big Cat Roofing"
            suggestions['opening'] = """As Warren's top-rated roofer, Big Cat Roofing has earned the trust of hundreds of homeowners. 
Our reputation as the top choice for roofing services comes from our commitment to quality and customer satisfaction."""
            suggestions['h2_addition'] = "Why We're Warren's Top Roofer"
    
    return suggestions

def apply_fixes():
    """Generate fix recommendations for each problematic page"""
    print("\n" + "=" * 80)
    print("SPECIFIC CONTENT FIXES FOR MISSING TITLE WORDS")
    print("=" * 80)
    
    for page in results['pages_with_issues']:
        file_path = os.path.join("/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website", page['file'])
        
        print(f"\n📄 {page['file']}")
        print(f"   Missing words: {', '.join(page['missing_words'])}")
        print(f"\n   RECOMMENDED CONTENT ADDITIONS:")
        print("-" * 40)
        
        suggestions = generate_natural_content(page['missing_words'], page['file'])
        
        if suggestions:
            for key, value in suggestions.items():
                if key == 'h1':
                    print(f"\n   → Replace/Update H1 Tag:")
                    print(f"     \"{value}\"")
                elif key == 'opening':
                    print(f"\n   → Add to Opening Paragraph:")
                    print(f"     \"{value}\"")
                elif key == 'h2_addition':
                    print(f"\n   → Add New H2 Section:")
                    print(f"     \"{value}\"")
                elif key == 'content_addition':
                    print(f"\n   → Add Content Block:")
                    wrapped = '\n     '.join([value[i:i+80] for i in range(0, len(value), 80)])
                    print(f"     {wrapped}")
                elif key == 'additional':
                    print(f"\n   → Additional Content:")
                    print(f"     \"{value}\"")
        
        # Also provide location-specific recommendations
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                soup = BeautifulSoup(f.read(), 'html.parser')
            
            # Find specific insertion points
            h1 = soup.find('h1')
            first_p = soup.find('p')
            
            if h1:
                print(f"\n   📍 Current H1: \"{h1.get_text().strip()}\"")
            if first_p:
                first_p_text = first_p.get_text().strip()[:100]
                print(f"   📍 First paragraph starts with: \"{first_p_text}...\"")
        except:
            pass
    
    print("\n" + "=" * 80)
    print("IMPLEMENTATION GUIDE")
    print("=" * 80)
    print("""
    To implement these fixes:
    
    1. PRIORITY 1 - Homepage & Service Pages (index.html, service-areas.html)
       These are your most important pages for SEO. Update them first.
    
    2. PRIORITY 2 - Location Pages (warren.html)
       Local SEO is crucial, ensure location pages include all title keywords.
    
    3. PRIORITY 3 - Blog & Utility Pages (blog/index.html, thank-you.html, 404.html)
       These support pages should also align with their titles for consistency.
    
    Best practices for implementation:
    • Make changes natural and reader-friendly
    • Don't keyword stuff - integrate naturally
    • Update meta descriptions to match
    • Consider updating image alt text to include missing keywords
    • Test readability after changes
    """)

if __name__ == "__main__":
    if not os.path.exists('title_content_analysis.json'):
        print("Error: Please run analyze_title_content.py first to generate the analysis.")
        exit(1)
    
    apply_fixes()