# Open Graph URL Audit Report - BigCatRoofs.com

**Generated:** September 15, 2025  
**Total HTML Files Analyzed:** 58

## Executive Summary

The audit identified **54 URL mismatches** between Open Graph `og:url` tags and canonical URLs across the website. All mismatches follow the same pattern: **www vs non-www inconsistency**.

### Primary Issue Pattern
- **og:url tags:** Use `https://www.bigcatroofs.com/` (WITH www)
- **canonical tags:** Use `https://bigcatroofs.com/` (WITHOUT www)
- **Result:** Search engines and social platforms receive conflicting URL signals

## Detailed Findings

### 1. URL Mismatch Breakdown by Page Type

| Page Type | Count | Pattern |
|-----------|-------|---------|
| Homepage | 1 | www vs non-www |
| City Landing Pages | 22 | www vs non-www |
| Service Pages | 6 | www vs non-www |
| Blog Posts | 18 | www vs non-www |
| Other Content | 3 | www vs non-www |
| Legacy Service Areas | 5 | www vs non-www |
| **TOTAL MISMATCHES** | **55** | **All www vs non-www** |

### 2. Missing Meta Tags

| Issue | Files | Impact |
|-------|-------|--------|
| Missing og:url | terms.html | Low (legal page) |
| Missing canonical | 404.html, thank-you.html | Medium (utility pages) |

### 3. Page-by-Page Analysis

#### Homepage Issues (1 file)
```
File: public_html/index.html
Current og:url:    https://www.bigcatroofs.com/
Current canonical: https://bigcatroofs.com/
Issue:             www vs non-www mismatch
```

#### City Landing Pages (22 files)
All city landing pages follow the same pattern:
```
Examples:
- center-line-roofing.html
- clawson-roofing.html
- clinton-township-roofing.html
- detroit-roofing.html
[...and 18 others]

Pattern:
og:url:    https://www.bigcatroofs.com/[city]-roofing.html
canonical: https://bigcatroofs.com/[city]-roofing.html
Issue:     www vs non-www mismatch
```

#### Service Pages (6 files)
```
- commercial-roofing.html
- residential-roofing.html
- gutter-services.html
- metal-roofing.html
- metal-roofing.min.html
- storm-repair.html

Pattern: Same www vs non-www mismatch
```

#### Blog Posts (18 files)
```
All blog posts in /blog/ and /blog/posts/ directories
Pattern: Same www vs non-www mismatch
Examples:
- blog/index.html
- blog/posts/commercial-flat-roof-inspection.html
- blog/posts/emergency-roof-repair.html
[...and 15 others]
```

#### Legacy Service Areas (5 files)
```
Files in /service-areas/ directory:
- ferndale.html
- grosse-pointe.html
- roseville.html
- royal-oak.html
- sterling-heights.html

Note: These should be redirected via .htaccess
```

## Current Implementation Analysis

### How URLs Are Generated
- **og:url tags:** Manually set to include `www.` subdomain
- **canonical tags:** Manually set to exclude `www.` subdomain
- **Inconsistency:** No unified URL standard across meta tags

### Example Current Implementation
```html
<!-- Open Graph -->
<meta property="og:url" content="https://www.bigcatroofs.com/" />

<!-- Canonical -->
<link rel="canonical" href="https://bigcatroofs.com/">
```

## Recommended Fix Strategy

### Option 1: Standardize to Non-WWW (Recommended)
**Action:** Update all og:url tags to remove `www.` to match canonical URLs

**Bulk Fix Command:**
```bash
find public_html -name "*.html" -type f -exec sed -i 's|https://www\.bigcatroofs\.com/|https://bigcatroofs.com/|g' {} \;
```

**Benefits:**
- Aligns with existing canonical URL strategy
- Single bulk operation fixes all 54+ mismatches
- Consistent with current server configuration

### Option 2: Standardize to WWW
**Action:** Update all canonical tags to include `www.` to match og:url tags

**Requirements:**
- Ensure .htaccess redirects non-www to www
- Update all canonical tags across 54+ files
- More complex implementation

## Priority Actions

### High Priority (SEO Critical)
1. **Fix Homepage** - Most important for SEO authority
2. **Fix City Landing Pages** - Key for local SEO rankings
3. **Fix Service Pages** - Core conversion pages

### Medium Priority
4. **Fix Blog Posts** - Content marketing impact
5. **Add missing og:url to terms.html**

### Low Priority
6. **Add canonical tags to 404.html and thank-you.html**
7. **Legacy service-areas pages** (already being redirected)

## Technical Implementation

### Verification Commands
```bash
# Check remaining mismatches after fix
grep -r "www\.bigcatroofs\.com" public_html/

# Verify canonical consistency
grep -r 'rel="canonical"' public_html/ | head -10
```

### Quality Assurance
1. Test social media preview with Facebook Debugger
2. Verify Google Search Console accepts new URLs
3. Monitor for any 404 errors after changes

## Impact Assessment

### Before Fix
- **54 conflicting URL signals** confusing search engines
- **Diluted SEO authority** split between www/non-www
- **Social sharing inconsistencies**

### After Fix
- **Unified URL structure** across all meta tags
- **Consolidated SEO authority** to canonical URLs
- **Consistent social media previews**

---

**Report prepared by:** Claude Code AI Assistant  
**Next Steps:** Implement bulk fix using recommended sed command