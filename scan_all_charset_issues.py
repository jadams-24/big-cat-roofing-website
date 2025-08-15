#!/usr/bin/env python3
"""
Comprehensive Charset Encoding Scanner
Scans all HTML files to identify charset placement issues
"""

import os
import re
import glob
from pathlib import Path

def analyze_charset_placement(file_path):
    """Analyze charset placement in an HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check for DOCTYPE
        has_doctype = content.strip().lower().startswith('<!doctype html>')
        
        # Find the position of <head> tag
        head_match = re.search(r'<head[^>]*>', content, re.IGNORECASE)
        if not head_match:
            return {
                'status': 'ERROR',
                'message': 'No <head> tag found',
                'has_charset': False,
                'position': 'N/A'
            }
        
        head_position = head_match.end()
        
        # Find charset meta tag
        charset_match = re.search(r'<meta\s+charset\s*=\s*["\']?utf-8["\']?\s*/?>', content, re.IGNORECASE)
        
        if not charset_match:
            return {
                'status': 'MISSING',
                'message': 'No charset meta tag found',
                'has_charset': False,
                'position': 'N/A'
            }
        
        charset_position = charset_match.start()
        
        # Get content between <head> and charset
        content_between = content[head_position:charset_position].strip()
        
        # Check if charset is the first element after <head>
        if re.match(r'^[\s\n]*$', content_between):
            return {
                'status': 'CORRECT',
                'message': 'Charset is properly positioned first in <head>',
                'has_charset': True,
                'position': 'First'
            }
        else:
            # Check what's before charset
            first_tag_match = re.search(r'<[^>]+>', content_between)
            if first_tag_match:
                problematic_tag = first_tag_match.group(0)[:50]
                return {
                    'status': 'WRONG_POSITION',
                    'message': f'Content before charset: {problematic_tag}...',
                    'has_charset': True,
                    'position': 'Not first'
                }
            else:
                return {
                    'status': 'WRONG_POSITION', 
                    'message': 'Non-tag content before charset',
                    'has_charset': True,
                    'position': 'Not first'
                }
        
    except Exception as e:
        return {
            'status': 'ERROR',
            'message': str(e),
            'has_charset': False,
            'position': 'N/A'
        }

def scan_all_html_files():
    """Scan all HTML files for charset issues"""
    
    base_path = '/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website/public_html'
    
    # Define service page patterns
    service_patterns = [
        'public_html/*.html',  # Main service pages
        'public_html/service-areas/*.html',  # Location pages
        'public_html/blog/*.html'  # Blog pages
    ]
    
    all_files = []
    for pattern in service_patterns:
        full_pattern = f'/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website/{pattern}'
        all_files.extend(glob.glob(full_pattern))
    
    # Focus on key service pages first
    priority_files = [
        'metal-roofing.html',
        'commercial-roofing.html', 
        'storm-repair.html',
        'gutter-services.html',
        'contact.html',
        'service-areas.html',
        'index.html'
    ]
    
    print("=" * 100)
    print("COMPREHENSIVE CHARSET ENCODING SCAN")
    print("=" * 100)
    
    issues_found = []
    correct_files = []
    
    # Check priority service pages first
    print("\n🎯 PRIORITY SERVICE PAGES:")
    print("-" * 50)
    
    for filename in priority_files:
        file_path = f'/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website/public_html/{filename}'
        if os.path.exists(file_path):
            relative_path = f'public_html/{filename}'
            result = analyze_charset_placement(file_path)
            
            if result['status'] == 'CORRECT':
                status_icon = "✅"
                correct_files.append(relative_path)
            elif result['status'] == 'MISSING':
                status_icon = "❌"
                issues_found.append({'file': relative_path, 'issue': 'MISSING_CHARSET', 'details': result})
            else:
                status_icon = "⚠️"
                issues_found.append({'file': relative_path, 'issue': 'WRONG_POSITION', 'details': result})
            
            print(f"{status_icon} {relative_path}: {result['message']}")
    
    # Check all other HTML files
    print(f"\n📁 ALL OTHER HTML FILES:")
    print("-" * 50)
    
    other_files_checked = 0
    for file_path in all_files:
        relative_path = os.path.relpath(file_path, '/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website')
        filename = os.path.basename(file_path)
        
        # Skip priority files already checked
        if filename in priority_files:
            continue
            
        if os.path.exists(file_path):
            result = analyze_charset_placement(file_path)
            other_files_checked += 1
            
            if result['status'] == 'CORRECT':
                status_icon = "✅"
                correct_files.append(relative_path)
            elif result['status'] == 'MISSING':
                status_icon = "❌"
                issues_found.append({'file': relative_path, 'issue': 'MISSING_CHARSET', 'details': result})
            else:
                status_icon = "⚠️"
                issues_found.append({'file': relative_path, 'issue': 'WRONG_POSITION', 'details': result})
            
            print(f"{status_icon} {relative_path}: {result['message']}")
    
    # Summary report
    print(f"\n" + "=" * 100)
    print("SCAN SUMMARY")
    print("=" * 100)
    
    total_files = len(priority_files) + other_files_checked
    print(f"📊 Total files scanned: {total_files}")
    print(f"✅ Files with correct charset: {len(correct_files)}")
    print(f"⚠️  Files needing fixes: {len(issues_found)}")
    
    if issues_found:
        print(f"\n❌ FILES REQUIRING FIXES:")
        print("-" * 50)
        
        missing_charset = [item for item in issues_found if item['issue'] == 'MISSING_CHARSET']
        wrong_position = [item for item in issues_found if item['issue'] == 'WRONG_POSITION']
        
        if missing_charset:
            print(f"\n🚫 Missing charset entirely ({len(missing_charset)} files):")
            for item in missing_charset:
                print(f"   • {item['file']}")
        
        if wrong_position:
            print(f"\n📍 Wrong charset position ({len(wrong_position)} files):")
            for item in wrong_position:
                print(f"   • {item['file']}: {item['details']['message']}")
    
    print(f"\n🛠️  RECOMMENDED ACTIONS:")
    print("-" * 50)
    
    for item in issues_found:
        print(f"\n📝 {item['file']}:")
        if item['issue'] == 'MISSING_CHARSET':
            print("   → Add <meta charset=\"UTF-8\"> as first element in <head>")
        else:
            print("   → Move <meta charset=\"UTF-8\"> to first position in <head>")
        print(f"   → Current issue: {item['details']['message']}")
    
    return issues_found, correct_files

if __name__ == "__main__":
    issues, correct = scan_all_html_files()
    
    print(f"\n" + "=" * 100)
    print("NEXT STEPS")
    print("=" * 100)
    
    if issues:
        print(f"🔧 {len(issues)} files need charset encoding fixes")
        print("Priority order for fixes:")
        for i, item in enumerate(issues, 1):
            print(f"{i}. {item['file']}")
    else:
        print("🎉 All files have correct charset encoding!")
    
    print(f"\n📋 Verification script created: scan_all_charset_issues.py")
    print("Run this script anytime to check charset encoding across all pages.")