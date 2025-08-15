#!/bin/bash

# PageSpeed Insights Fix Script for Big Cat Roofing Website
echo "Starting PageSpeed optimization fixes..."

cd "public_html"

# Issue 1: Fix render-blocking CSS
echo "Fixing render-blocking CSS..."

# Find all HTML files and update combined.min.css references
find . -name "*.html" -exec grep -l "combined\.min\.css" {} \; | while read file; do
    echo "Processing CSS in: $file"
    
    # Replace render-blocking CSS with async loading
    sed -i 's|<link rel="stylesheet" href="css/combined\.min\.css">|<link rel="stylesheet" href="css/combined.min.css" media="print" onload="this.media='\''all'\''; this.onload=null;">|g' "$file"
    sed -i 's|<link rel="stylesheet" href="../css/combined\.min\.css">|<link rel="stylesheet" href="../css/combined.min.css" media="print" onload="this.media='\''all'\''; this.onload=null;">|g' "$file"
    sed -i 's|<link rel="stylesheet" href="../../css/combined\.min\.css">|<link rel="stylesheet" href="../../css/combined.min.css" media="print" onload="this.media='\''all'\''; this.onload=null;">|g' "$file"
    
    # Add noscript fallback after the async CSS line
    sed -i '/combined\.min\.css.*onload.*all/a\    <noscript><link rel="stylesheet" href="css/combined.min.css"></noscript>' "$file"
    sed -i '/\.\.\/css\/combined\.min\.css.*onload.*all/a\    <noscript><link rel="stylesheet" href="../css/combined.min.css"></noscript>' "$file"
    sed -i '/\.\.\/\.\.\/css\/combined\.min\.css.*onload.*all/a\    <noscript><link rel="stylesheet" href="../../css/combined.min.css"></noscript>' "$file"
done

# Issue 2: Add fetchpriority to logo images
echo "Adding fetchpriority to logo images..."

find . -name "*.html" -exec grep -l "logo.*\.svg" {} \; | while read file; do
    echo "Processing logo in: $file"
    
    # Add fetchpriority="high" to header logos
    sed -i 's|<img src="images/logos/logo-black\.svg" alt="Big Cat Roofing" class="logo-header">|<img src="images/logos/logo-black.svg" alt="Big Cat Roofing" class="logo-header" fetchpriority="high" width="260" height="78">|g' "$file"
    sed -i 's|<img src="../images/logos/logo-black\.svg" alt="Big Cat Roofing" class="logo-header">|<img src="../images/logos/logo-black.svg" alt="Big Cat Roofing" class="logo-header" fetchpriority="high" width="260" height="78">|g' "$file"
    sed -i 's|<img src="../../images/logos/logo-black\.svg" alt="Big Cat Roofing" class="logo-header">|<img src="../../images/logos/logo-black.svg" alt="Big Cat Roofing" class="logo-header" fetchpriority="high" width="260" height="78">|g' "$file"
    
    # Also add to existing logos that might already have attributes
    sed -i '/class="logo-header"/s/>/fetchpriority="high" width="260" height="78">/g' "$file"
    
    # Fix any duplicated attributes
    sed -i 's/fetchpriority="high" width="260" height="78" fetchpriority="high" width="260" height="78"/fetchpriority="high" width="260" height="78"/g' "$file"
done

echo "PageSpeed optimization fixes completed!"
echo ""
echo "Files modified:"
find . -name "*.html" | wc -l | xargs echo "- HTML files:"
echo ""
echo "Changes made:"
echo "1. CSS files now load asynchronously with noscript fallback"
echo "2. Logo images have fetchpriority='high' and proper dimensions"
echo "3. Ready for font-display: swap optimization in CSS files"