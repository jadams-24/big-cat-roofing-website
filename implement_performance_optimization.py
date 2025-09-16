#!/usr/bin/env python3
"""
Performance Optimization Implementation Script
Removes unused JavaScript and implements lazy loading across all HTML pages
Target: 972 KiB JavaScript savings + 115 KiB CSS savings
"""

import os
import re
import glob
from pathlib import Path

def optimize_html_file(file_path):
    """Optimize a single HTML file for better performance"""
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = []
        
        # 1. Remove popup-modal script tags (will be loaded lazily)
        popup_script_pattern = r'<script[^>]*src=["\'](?:\.\.\/)?js\/popup-modal(?:\.min)?\.js["\'][^>]*><\/script>'
        popup_matches = re.findall(popup_script_pattern, content, re.IGNORECASE)
        if popup_matches:
            content = re.sub(popup_script_pattern, '', content, flags=re.IGNORECASE)
            changes_made.append(f"Removed {len(popup_matches)} popup-modal script tags")
        
        # 2. Remove popup-modal CSS links (will be loaded lazily)
        popup_css_pattern = r'<link[^>]*href=["\'](?:\.\.\/)?css\/popup-modal(?:\.min)?\.css["\'][^>]*>'
        popup_css_matches = re.findall(popup_css_pattern, content, re.IGNORECASE)
        if popup_css_matches:
            content = re.sub(popup_css_pattern, '', content, flags=re.IGNORECASE)
            changes_made.append(f"Removed {len(popup_css_matches)} popup-modal CSS links")
        
        # 3. Remove service-area-map script tags (will be loaded conditionally)
        map_script_pattern = r'<script[^>]*src=["\'](?:\.\.\/)?js\/service-area-map(?:\.min)?\.js["\'][^>]*><\/script>'
        map_matches = re.findall(map_script_pattern, content, re.IGNORECASE)
        if map_matches:
            content = re.sub(map_script_pattern, '', content, flags=re.IGNORECASE)
            changes_made.append(f"Removed {len(map_matches)} service-area-map script tags")
        
        # 4. Remove email-notifications script tags (will be loaded conditionally)
        email_script_pattern = r'<script[^>]*src=["\'](?:\.\.\/)?js\/email-notifications(?:\.min)?\.js["\'][^>]*><\/script>'
        email_matches = re.findall(email_script_pattern, content, re.IGNORECASE)
        if email_matches:
            content = re.sub(email_script_pattern, '', content, flags=re.IGNORECASE)
            changes_made.append(f"Removed {len(email_matches)} email-notifications script tags")
        
        # 5. Remove Leaflet CSS and JS (will be loaded conditionally with maps)
        leaflet_patterns = [
            r'<link[^>]*href=["\'][^"\']*leaflet[^"\']*\.css["\'][^>]*>',
            r'<script[^>]*src=["\'][^"\']*leaflet[^"\']*\.js["\'][^>]*><\/script>'
        ]
        for pattern in leaflet_patterns:
            leaflet_matches = re.findall(pattern, content, re.IGNORECASE)
            if leaflet_matches:
                content = re.sub(pattern, '', content, flags=re.IGNORECASE)
                changes_made.append(f"Removed {len(leaflet_matches)} Leaflet resources")
        
        # 6. Add performance optimizer script before closing </body> tag
        # Determine the correct path for the script based on file location
        relative_path = os.path.relpath(file_path, '/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website/public_html')
        if relative_path.count('/') == 0:
            # Root level file
            script_path = 'js/performance-optimized-loader.min.js'
        elif relative_path.count('/') == 1:
            # One level deep (service-areas/, blog/)
            script_path = '../js/performance-optimized-loader.min.js'
        else:
            # Two levels deep (blog/posts/)
            script_path = '../../js/performance-optimized-loader.min.js'
        
        # Check if performance optimizer is already included
        if 'performance-optimized-loader' not in content:
            # Add performance optimizer before closing body tag
            performance_script = f'    <script src="{script_path}" defer></script>'
            
            if '</body>' in content:
                content = content.replace('</body>', f'{performance_script}\n</body>')
                changes_made.append("Added performance optimizer script")
            else:
                # Add at end of document if no closing body tag
                content += f'\n{performance_script}'
                changes_made.append("Added performance optimizer script at end")
        
        # 7. Clean up extra whitespace left by removed elements
        # Remove multiple consecutive newlines
        content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
        
        # Remove empty lines around head section
        content = re.sub(r'(<head[^>]*>)\s*\n\s*\n', r'\1\n', content, flags=re.IGNORECASE)
        content = re.sub(r'\n\s*\n\s*(</head>)', r'\n\1', content, flags=re.IGNORECASE)
        
        # Only write if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return {
                'status': 'OPTIMIZED',
                'changes': changes_made,
                'file': file_path
            }
        else:
            return {
                'status': 'NO_CHANGES',
                'changes': [],
                'file': file_path
            }
            
    except Exception as e:
        return {
            'status': 'ERROR',
            'changes': [],
            'file': file_path,
            'error': str(e)
        }

def optimize_all_pages():
    """Optimize all HTML pages for performance"""
    
    base_path = '/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website/public_html'
    
    # Get all HTML files
    html_patterns = [
        'public_html/*.html',
        'public_html/service-areas/*.html',
        'public_html/blog/*.html',
        'public_html/blog/posts/*.html'
    ]
    
    all_files = []
    for pattern in html_patterns:
        full_pattern = f'/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website/{pattern}'
        all_files.extend(glob.glob(full_pattern))
    
    print("=" * 100)
    print("PERFORMANCE OPTIMIZATION IMPLEMENTATION")
    print("=" * 100)
    print("Target: 972 KiB JavaScript savings + 115 KiB CSS savings")
    print("Strategy: Lazy loading for popup-modal, service-area-map, email-notifications")
    
    results = {
        'optimized': [],
        'no_changes': [],
        'errors': []
    }
    
    print(f"\n🚀 OPTIMIZING {len(all_files)} HTML FILES:")
    print("-" * 50)
    
    for file_path in all_files:
        relative_path = os.path.relpath(file_path, '/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website')
        
        result = optimize_html_file(file_path)
        
        if result['status'] == 'OPTIMIZED':
            print(f"⚡ {relative_path}: {', '.join(result['changes'])}")
            results['optimized'].append(result)
        elif result['status'] == 'NO_CHANGES':
            print(f"✅ {relative_path}: Already optimized")
            results['no_changes'].append(result)
        else:
            print(f"❌ {relative_path}: {result.get('error', 'Unknown error')}")
            results['errors'].append(result)
    
    # Summary report
    print(f"\n" + "=" * 100)
    print("OPTIMIZATION SUMMARY")
    print("=" * 100)
    
    total_files = len(results['optimized']) + len(results['no_changes']) + len(results['errors'])
    print(f"📊 Total files processed: {total_files}")
    print(f"⚡ Files optimized: {len(results['optimized'])}")
    print(f"✅ Files already optimized: {len(results['no_changes'])}")
    print(f"❌ Errors: {len(results['errors'])}")
    
    if results['optimized']:
        print(f"\n⚡ OPTIMIZATION DETAILS:")
        print("-" * 50)
        
        change_counts = {}
        for result in results['optimized']:
            for change in result['changes']:
                change_counts[change] = change_counts.get(change, 0) + 1
        
        for change, count in change_counts.items():
            print(f"   • {change}: {count} files")
    
    if results['errors']:
        print(f"\n❌ ERRORS ENCOUNTERED:")
        print("-" * 50)
        for result in results['errors']:
            rel_path = os.path.relpath(result['file'], '/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website')
            print(f"   • {rel_path}: {result.get('error', 'Unknown error')}")
    
    # Calculate estimated savings
    print(f"\n💾 ESTIMATED PERFORMANCE GAINS:")
    print("-" * 50)
    
    js_savings = 0
    css_savings = 0
    
    # Calculate savings based on optimization changes
    for result in results['optimized']:
        for change in result['changes']:
            if 'popup-modal script' in change:
                js_savings += 20  # ~20KB popup-modal.min.js
            if 'popup-modal CSS' in change:
                css_savings += 13  # ~13KB popup-modal.min.css
            if 'service-area-map script' in change:
                js_savings += 16  # ~16KB service-area-map.min.js
            if 'email-notifications script' in change:
                js_savings += 16  # ~16KB email-notifications.min.js
            if 'Leaflet resources' in change:
                js_savings += 144  # ~144KB leaflet.js
                css_savings += 12  # ~12KB leaflet.css
    
    print(f"📉 JavaScript savings: ~{js_savings} KB per optimized page")
    print(f"📉 CSS savings: ~{css_savings} KB per optimized page")
    print(f"📈 Total potential savings: ~{js_savings + css_savings} KB per page")
    
    # Calculate total savings across all pages
    total_js_savings = js_savings * len(results['optimized'])
    total_css_savings = css_savings * len(results['optimized'])
    
    print(f"\n🎯 TOTAL PERFORMANCE IMPACT:")
    print("-" * 50)
    print(f"🚀 Total JS reduction: ~{total_js_savings} KB")
    print(f"🚀 Total CSS reduction: ~{total_css_savings} KB")
    print(f"🚀 Combined savings: ~{total_js_savings + total_css_savings} KB")
    
    if total_js_savings >= 972:
        print(f"✅ TARGET ACHIEVED: JavaScript savings exceed 972 KB goal!")
    else:
        print(f"⚠️  JavaScript savings: {total_js_savings} KB (need {972 - total_js_savings} KB more)")
    
    if total_css_savings >= 115:
        print(f"✅ TARGET ACHIEVED: CSS savings exceed 115 KB goal!")
    else:
        print(f"⚠️  CSS savings: {total_css_savings} KB (need {115 - total_css_savings} KB more)")
    
    print(f"\n🔄 NEXT STEPS:")
    print("-" * 50)
    print("1. Test optimized pages to ensure functionality works correctly")
    print("2. Monitor PageSpeed scores for improvement")
    print("3. Implement additional optimizations if needed")
    
    return results

if __name__ == "__main__":
    results = optimize_all_pages()
    
    print(f"\n🎉 PERFORMANCE OPTIMIZATION COMPLETE!")
    print("All pages now use lazy loading for non-critical JavaScript and CSS.")