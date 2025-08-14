#!/usr/bin/env python3
"""
HTML/CSS minifier for metal roofing page
Removes unnecessary whitespace and comments
"""

import re
import os

def minify_css(css_content):
    """Minify CSS by removing unnecessary whitespace"""
    # Remove comments
    css_content = re.sub(r'/\*.*?\*/', '', css_content, flags=re.DOTALL)
    # Remove extra whitespace
    css_content = re.sub(r'\s+', ' ', css_content)
    # Remove whitespace around certain characters
    css_content = re.sub(r'\s*([{}:;,>+~])\s*', r'\1', css_content)
    # Remove trailing semicolons before closing braces
    css_content = re.sub(r';\s*}', '}', css_content)
    return css_content.strip()

def minify_html(html_content):
    """Minify HTML by removing unnecessary whitespace while preserving functionality"""
    # Preserve content within <script>, <style>, and <textarea> tags
    preserved = []
    
    def preserve_tag(match):
        preserved.append(match.group(0))
        return f'PRESERVED_CONTENT_{len(preserved) - 1}'
    
    # Preserve script and style content
    html_content = re.sub(r'<(script|style)[^>]*>.*?</\1>', preserve_tag, html_content, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove HTML comments (but not IE conditional comments)
    html_content = re.sub(r'<!--(?!\s*\[if).*?-->', '', html_content, flags=re.DOTALL)
    
    # Remove extra whitespace between tags
    html_content = re.sub(r'>\s+<', '><', html_content)
    
    # Remove extra whitespace at start/end of lines
    html_content = re.sub(r'^\s+|\s+$', '', html_content, flags=re.MULTILINE)
    
    # Collapse multiple spaces into single space
    html_content = re.sub(r'\s{2,}', ' ', html_content)
    
    # Restore preserved content
    for i, content in enumerate(preserved):
        # Minify CSS in style tags
        if content.startswith('<style'):
            style_match = re.match(r'(<style[^>]*>)(.*?)(</style>)', content, re.DOTALL | re.IGNORECASE)
            if style_match:
                start_tag, css, end_tag = style_match.groups()
                minified_css = minify_css(css)
                content = start_tag + minified_css + end_tag
        
        html_content = html_content.replace(f'PRESERVED_CONTENT_{i}', content)
    
    return html_content.strip()

def minify_file():
    """Minify the metal roofing HTML file"""
    input_file = '/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website/public_html/metal-roofing.html'
    output_file = '/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website/public_html/metal-roofing.min.html'
    
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found")
        return
    
    # Read original file
    with open(input_file, 'r', encoding='utf-8') as f:
        original_content = f.read()
    
    print(f"Original file size: {len(original_content)} characters")
    
    # Minify content
    minified_content = minify_html(original_content)
    
    print(f"Minified file size: {len(minified_content)} characters")
    print(f"Size reduction: {len(original_content) - len(minified_content)} characters ({((len(original_content) - len(minified_content)) / len(original_content) * 100):.1f}%)")
    
    # Save minified version
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(minified_content)
    
    print(f"Minified file saved as: {output_file}")
    
    # Also replace the original with minified version
    with open(input_file, 'w', encoding='utf-8') as f:
        f.write(minified_content)
    
    print(f"Original file updated with minified version")

if __name__ == "__main__":
    minify_file()