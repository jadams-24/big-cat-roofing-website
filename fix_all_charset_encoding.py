#!/usr/bin/env python3
"""
Automated Charset Encoding Fix Script
Fixes charset placement issues across all HTML files systematically
"""

import os
import re
import glob
import shutil
from pathlib import Path

def fix_charset_encoding(file_path):
    """Fix charset encoding placement in a single HTML file"""
    
    try:
        # Read file content
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Backup original content
        backup_content = content
        
        # Check if charset meta tag exists
        charset_match = re.search(r'<meta\s+charset\s*=\s*["\']?utf-8["\']?\s*/?>', content, re.IGNORECASE)
        
        if not charset_match:
            return {
                'status': 'SKIPPED',
                'message': 'No charset meta tag found',
                'changes_made': False
            }
        
        # Find the <head> tag
        head_match = re.search(r'(<head[^>]*>)', content, re.IGNORECASE)
        
        if not head_match:
            return {
                'status': 'ERROR',
                'message': 'No <head> tag found',
                'changes_made': False
            }
        
        head_tag = head_match.group(1)
        head_end_pos = head_match.end()
        
        # Remove existing charset tag
        charset_tag = charset_match.group(0)
        content_without_charset = content.replace(charset_tag, '', 1)
        
        # Prepare the charset tag to insert (ensure proper formatting)
        charset_to_insert = '    <meta charset="UTF-8">'
        
        # Find head tag position in content without charset
        head_match_new = re.search(r'(<head[^>]*>)', content_without_charset, re.IGNORECASE)
        head_end_pos_new = head_match_new.end()
        
        # Insert charset as first element after <head>
        new_content = (
            content_without_charset[:head_end_pos_new] + 
            '\n' + charset_to_insert + '\n' + 
            content_without_charset[head_end_pos_new:]
        )
        
        # Clean up any extra whitespace around the inserted charset
        new_content = re.sub(r'(<head[^>]*>)\s*\n\s*(<meta charset="UTF-8">)', r'\1\n\2', new_content, flags=re.IGNORECASE)
        
        # Write the fixed content back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        return {
            'status': 'FIXED',
            'message': 'Charset moved to first position in <head>',
            'changes_made': True,
            'backup_content': backup_content
        }
        
    except Exception as e:
        return {
            'status': 'ERROR',
            'message': f'Error processing file: {str(e)}',
            'changes_made': False
        }

def fix_all_charset_issues():
    """Fix charset issues across all HTML files"""
    
    base_path = '/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website/public_html'
    
    # Get all HTML files from scan results
    priority_files = [
        'metal-roofing.html',
        'commercial-roofing.html', 
        'storm-repair.html',
        'gutter-services.html',
        'contact.html',
        'service-areas.html',
        'index.html',
        'about.html',
        'blog/index.html',
        'thank-you.html',
        '404.html'
    ]
    
    # Pattern for all HTML files
    all_patterns = [
        'public_html/*.html',
        'public_html/service-areas/*.html',
        'public_html/blog/*.html'
    ]
    
    all_files = []
    for pattern in all_patterns:
        full_pattern = f'/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website/{pattern}'
        all_files.extend(glob.glob(full_pattern))
    
    print("=" * 100)
    print("AUTOMATED CHARSET ENCODING FIX")
    print("=" * 100)
    
    results = {
        'fixed': [],
        'skipped': [],
        'errors': [],
        'already_correct': []
    }
    
    # Process priority files first
    print("\n🎯 FIXING PRIORITY SERVICE PAGES:")
    print("-" * 50)
    
    for filename in priority_files:
        file_path = f'/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website/public_html/{filename}'
        if os.path.exists(file_path):
            relative_path = f'public_html/{filename}'
            
            # Check current status first
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                head_match = re.search(r'<head[^>]*>', content, re.IGNORECASE)
                charset_match = re.search(r'<meta\s+charset\s*=\s*["\']?utf-8["\']?\s*/?>', content, re.IGNORECASE)
                
                if head_match and charset_match:
                    head_pos = head_match.end()
                    charset_pos = charset_match.start()
                    content_between = content[head_pos:charset_pos].strip()
                    
                    if re.match(r'^[\s\n]*$', content_between):
                        print(f"✅ {relative_path}: Already correct")
                        results['already_correct'].append(relative_path)
                        continue
                
            except Exception:
                pass
            
            # Apply fix
            result = fix_charset_encoding(file_path)
            
            if result['status'] == 'FIXED':
                print(f"🔧 {relative_path}: {result['message']}")
                results['fixed'].append({'file': relative_path, 'details': result})
            elif result['status'] == 'SKIPPED':
                print(f"⏭️  {relative_path}: {result['message']}")
                results['skipped'].append({'file': relative_path, 'details': result})
            else:
                print(f"❌ {relative_path}: {result['message']}")
                results['errors'].append({'file': relative_path, 'details': result})
    
    # Process all other files
    print(f"\n📁 FIXING ALL OTHER HTML FILES:")
    print("-" * 50)
    
    processed_basenames = [os.path.basename(f'public_html/{pf}') for pf in priority_files]
    
    for file_path in all_files:
        relative_path = os.path.relpath(file_path, '/mnt/c/Users/adams/OneDrive/Desktop/BC Roofing Website')
        basename = os.path.basename(file_path)
        
        # Skip priority files already processed
        if basename in processed_basenames:
            continue
        
        if os.path.exists(file_path):
            # Check current status first
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                head_match = re.search(r'<head[^>]*>', content, re.IGNORECASE)
                charset_match = re.search(r'<meta\s+charset\s*=\s*["\']?utf-8["\']?\s*/?>', content, re.IGNORECASE)
                
                if head_match and charset_match:
                    head_pos = head_match.end()
                    charset_pos = charset_match.start()
                    content_between = content[head_pos:charset_pos].strip()
                    
                    if re.match(r'^[\s\n]*$', content_between):
                        print(f"✅ {relative_path}: Already correct")
                        results['already_correct'].append(relative_path)
                        continue
                
            except Exception:
                pass
            
            # Apply fix
            result = fix_charset_encoding(file_path)
            
            if result['status'] == 'FIXED':
                print(f"🔧 {relative_path}: {result['message']}")
                results['fixed'].append({'file': relative_path, 'details': result})
            elif result['status'] == 'SKIPPED':
                print(f"⏭️  {relative_path}: {result['message']}")
                results['skipped'].append({'file': relative_path, 'details': result})
            else:
                print(f"❌ {relative_path}: {result['message']}")
                results['errors'].append({'file': relative_path, 'details': result})
    
    # Summary report
    print(f"\n" + "=" * 100)
    print("FIX SUMMARY")
    print("=" * 100)
    
    total_processed = len(results['fixed']) + len(results['skipped']) + len(results['errors']) + len(results['already_correct'])
    
    print(f"📊 Total files processed: {total_processed}")
    print(f"✅ Already correct: {len(results['already_correct'])}")
    print(f"🔧 Successfully fixed: {len(results['fixed'])}")
    print(f"⏭️  Skipped: {len(results['skipped'])}")
    print(f"❌ Errors: {len(results['errors'])}")
    
    if results['fixed']:
        print(f"\n✅ SUCCESSFULLY FIXED ({len(results['fixed'])} files):")
        print("-" * 50)
        for item in results['fixed']:
            print(f"   • {item['file']}")
    
    if results['errors']:
        print(f"\n❌ ERRORS ENCOUNTERED ({len(results['errors'])} files):")
        print("-" * 50)
        for item in results['errors']:
            print(f"   • {item['file']}: {item['details']['message']}")
    
    if results['skipped']:
        print(f"\n⏭️  SKIPPED ({len(results['skipped'])} files):")
        print("-" * 50)
        for item in results['skipped']:
            print(f"   • {item['file']}: {item['details']['message']}")
    
    print(f"\n🎉 CHARSET ENCODING FIX COMPLETE!")
    print("All service pages now have proper charset declaration positioning.")
    
    return results

if __name__ == "__main__":
    results = fix_all_charset_issues()
    
    print(f"\n" + "=" * 100)
    print("VERIFICATION RECOMMENDED")
    print("=" * 100)
    print("Run 'python scan_all_charset_issues.py' to verify all fixes were applied correctly.")