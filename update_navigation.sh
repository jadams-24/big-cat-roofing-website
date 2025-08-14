#!/bin/bash

# Update navigation menus to include Metal Roofing link
files=(
    "public_html/commercial-roofing.html"
    "public_html/storm-repair.html" 
    "public_html/gutter-services.html"
    "public_html/contact.html"
    "public_html/service-areas.html"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Updating $file..."
        # Add Metal Roofing to dropdown menu if not already present
        if ! grep -q "metal-roofing.html" "$file"; then
            sed -i 's|<li><a href="gutter-services.html">Gutter Services</a></li>|<li><a href="gutter-services.html">Gutter Services</a></li>\n                                <li><a href="metal-roofing.html">Metal Roofing</a></li>|g' "$file"
        fi
    fi
done

echo "Navigation updates complete!"