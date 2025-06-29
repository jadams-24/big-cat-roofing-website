// Big Cat Roofing Service Area Map
// Interactive map showing service coverage across Metro Detroit

document.addEventListener('DOMContentLoaded', function() {
    // Initialize both maps if containers exist
    const fullMapContainer = document.getElementById('service-area-map');
    const compactMapContainer = document.getElementById('homepage-service-map');
    
    if (fullMapContainer) {
        initializeFullMap();
    }
    
    if (compactMapContainer) {
        initializeCompactMap();
    }
});

function initializeFullMap() {
    const mapContainer = document.getElementById('service-area-map');

    // Initialize map centered on Warren, MI (Metro Detroit)
    const map = L.map('service-area-map', {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
        attributionControl: true
    }).setView([42.5149, -83.0364], 10);

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        minZoom: 8
    }).addTo(map);

    // County boundary coordinates (simplified polygons)
    const oaklandCounty = [
        [42.8708, -83.6547], [42.8708, -83.0725], [42.6049, -83.0725],
        [42.4081, -83.1478], [42.4081, -83.3646], [42.4608, -83.5814],
        [42.6576, -83.6547], [42.8708, -83.6547]
    ];

    const wayneCounty = [
        [42.6049, -83.0725], [42.6049, -82.9087], [42.4081, -82.9087],
        [42.1586, -82.9087], [42.1586, -83.2877], [42.4081, -83.3646],
        [42.4081, -83.1478], [42.6049, -83.0725]
    ];

    const macombCounty = [
        [42.8708, -83.0725], [42.8708, -82.5449], [42.6049, -82.5449],
        [42.6049, -82.9087], [42.6049, -83.0725], [42.8708, -83.0725]
    ];

    // Add county highlighting with Big Cat Roofing brand colors
    const countyStyle = {
        fillColor: '#C8AF6A',
        weight: 2,
        opacity: 0.8,
        color: '#C8AF6A',
        fillOpacity: 0.3
    };

    // Add county polygons
    const oaklandPoly = L.polygon(oaklandCounty, countyStyle).addTo(map);
    const waynePoly = L.polygon(wayneCounty, countyStyle).addTo(map);
    const macombPoly = L.polygon(macombCounty, countyStyle).addTo(map);

    // Add county labels
    oaklandPoly.bindTooltip('Oakland County', {permanent: false, direction: 'center'});
    waynePoly.bindTooltip('Wayne County', {permanent: false, direction: 'center'});
    macombPoly.bindTooltip('Macomb County', {permanent: false, direction: 'center'});

    // Service area cities with coordinates and information
    const serviceAreas = {
        // Oakland County
        'Royal Oak': {
            coords: [42.4898, -83.1443],
            county: 'Oakland',
            description: 'Historic home specialists and premium roofing services',
            link: '/service-areas/royal-oak.html'
        },
        'Ferndale': {
            coords: [42.4606, -83.1346],
            county: 'Oakland',
            description: 'Creative community roofing solutions',
            link: '/service-areas/ferndale.html'
        },
        'Troy': {
            coords: [42.6064, -83.1498],
            county: 'Oakland',
            description: 'Comprehensive residential and commercial services'
        },
        'Madison Heights': {
            coords: [42.4859, -83.1052],
            county: 'Oakland',
            description: 'Quality roofing for established neighborhoods'
        },
        'Hazel Park': {
            coords: [42.4625, -83.1041],
            county: 'Oakland',
            description: 'Affordable quality roofing solutions'
        },
        'Oak Park': {
            coords: [42.4592, -83.1827],
            county: 'Oakland',
            description: 'Professional residential roofing services'
        },
        'Huntington Woods': {
            coords: [42.4814, -83.1677],
            county: 'Oakland',
            description: 'Premium roofing for luxury homes'
        },
        'Birmingham': {
            coords: [42.5467, -83.2113],
            county: 'Oakland',
            description: 'Upscale residential and commercial roofing'
        },
        'Bloomfield Hills': {
            coords: [42.5837, -83.2455],
            county: 'Oakland',
            description: 'Luxury estate roofing specialists'
        },

        // Wayne County
        'Detroit': {
            coords: [42.3314, -83.0458],
            county: 'Wayne',
            description: 'Urban roofing solutions for the Motor City'
        },
        'Dearborn': {
            coords: [42.3223, -83.1763],
            county: 'Wayne',
            description: 'Residential and commercial roofing services'
        },
        'Westland': {
            coords: [42.3242, -83.4002],
            county: 'Wayne',
            description: 'Family-focused roofing services'
        },
        'Livonia': {
            coords: [42.3684, -83.3527],
            county: 'Wayne',
            description: 'Suburban roofing expertise'
        },
        'Taylor': {
            coords: [42.2409, -83.2696],
            county: 'Wayne',
            description: 'Reliable roofing for growing families'
        },
        'Lincoln Park': {
            coords: [42.2506, -83.1785],
            county: 'Wayne',
            description: 'Community-focused roofing services'
        },
        'Wyandotte': {
            coords: [42.2142, -83.1496],
            county: 'Wayne',
            description: 'Riverfront community roofing specialists'
        },
        'Southgate': {
            coords: [42.2139, -83.1943],
            county: 'Wayne',
            description: 'Professional residential roofing'
        },

        // Macomb County (Big Cat's home base)
        'Warren': {
            coords: [42.5149, -83.0364],
            county: 'Macomb',
            description: 'Our headquarters - comprehensive roofing services',
            link: '/service-areas/warren.html',
            isHeadquarters: true
        },
        'Sterling Heights': {
            coords: [42.5803, -83.0302],
            county: 'Macomb',
            description: 'Premium residential and commercial roofing',
            link: '/service-areas/sterling-heights.html'
        },
        'Eastpointe': {
            coords: [42.4684, -82.9557],
            county: 'Macomb',
            description: 'Quality roofing for established neighborhoods'
        },
        'Roseville': {
            coords: [42.4973, -82.9371],
            county: 'Macomb',
            description: 'Family-focused roofing specialists',
            link: '/service-areas/roseville.html'
        },
        'St. Clair Shores': {
            coords: [42.4974, -82.8885],
            county: 'Macomb',
            description: 'Lakefront property roofing experts'
        },
        'Fraser': {
            coords: [42.5389, -82.9496],
            county: 'Macomb',
            description: 'Residential roofing specialists'
        },
        'Clinton Township': {
            coords: [42.5870, -82.9199],
            county: 'Macomb',
            description: 'Comprehensive roofing solutions'
        },
        'Mount Clemens': {
            coords: [42.5973, -82.8779],
            county: 'Macomb',
            description: 'Historic city roofing services'
        },
        'Grosse Pointe': {
            coords: [42.3831, -82.9126],
            county: 'Macomb',
            description: 'Luxury estate and premium roofing',
            link: '/service-areas/grosse-pointe.html'
        }
    };

    // Custom marker icon for Big Cat Roofing
    const bigCatIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div class="marker-inner">📍</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    // Special icon for headquarters
    const hqIcon = L.divIcon({
        className: 'custom-marker hq-marker',
        html: '<div class="marker-inner">🏢</div>',
        iconSize: [35, 35],
        iconAnchor: [17, 35],
        popupAnchor: [0, -35]
    });

    // Add city markers
    Object.entries(serviceAreas).forEach(([cityName, cityData]) => {
        const icon = cityData.isHeadquarters ? hqIcon : bigCatIcon;
        
        const marker = L.marker(cityData.coords, { icon: icon }).addTo(map);
        
        // Create popup content
        let popupContent = `
            <div class="map-popup">
                <h4>${cityName}${cityData.isHeadquarters ? ' (HQ)' : ''}</h4>
                <p><strong>${cityData.county} County</strong></p>
                <p>${cityData.description}</p>
                ${cityData.link ? `<a href="${cityData.link}" class="popup-link">Learn More</a>` : ''}
                <div class="popup-contact">
                    <a href="tel:248-709-3746" class="btn-small">Call 248-709-3746</a>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent);
        
        // Add click event for cities with dedicated pages
        if (cityData.link) {
            marker.on('click', function() {
                // Popup will show, but also track the click
                console.log(`Clicked on ${cityName}`);
            });
        }
    });

    // Add service radius circle (15 miles around Warren)
    const serviceRadius = L.circle([42.5149, -83.0364], {
        color: '#C8AF6A',
        fillColor: '#C8AF6A',
        fillOpacity: 0.1,
        radius: 24140, // 15 miles in meters
        weight: 2,
        dashArray: '10, 10'
    }).addTo(map);

    serviceRadius.bindTooltip('15-Mile Service Radius', {permanent: false, direction: 'center'});

    // Add map controls and styling
    map.zoomControl.setPosition('topright');

    // Responsive map handling
    function handleMapResize() {
        if (window.innerWidth < 768) {
            map.setView([42.5149, -83.0364], 9);
        } else {
            map.setView([42.5149, -83.0364], 10);
        }
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }

    // Handle window resize
    window.addEventListener('resize', handleMapResize);
    
    // Initial size check
    handleMapResize();

    // Add custom map styles
    const style = document.createElement('style');
    style.textContent = `
        .custom-marker {
            background: transparent;
            border: none;
        }
        
        .marker-inner {
            font-size: 20px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
        }
        
        .hq-marker .marker-inner {
            font-size: 24px;
        }
        
        .map-popup {
            min-width: 200px;
            text-align: center;
        }
        
        .map-popup h4 {
            color: #1a1a1a;
            margin: 0 0 8px 0;
            font-size: 16px;
            font-weight: 600;
        }
        
        .map-popup p {
            margin: 4px 0;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .popup-link {
            display: inline-block;
            color: #C8AF6A;
            text-decoration: none;
            font-weight: 600;
            margin: 8px 0;
            padding: 4px 8px;
            border: 1px solid #C8AF6A;
            border-radius: 4px;
            transition: all 0.3s ease;
        }
        
        .popup-link:hover {
            background-color: #C8AF6A;
            color: white;
        }
        
        .popup-contact {
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px solid #eee;
        }
        
        .btn-small {
            display: inline-block;
            background-color: #C8AF6A;
            color: white;
            text-decoration: none;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            transition: background-color 0.3s ease;
        }
        
        .btn-small:hover {
            background-color: #ba9a45;
        }
        
        .leaflet-popup-content-wrapper {
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .leaflet-popup-tip {
            background: white;
        }
    `;
    document.head.appendChild(style);

    console.log('Big Cat Roofing Service Area Map loaded successfully');
}

function initializeCompactMap() {
    // Initialize compact map for homepage
    const compactMap = L.map('homepage-service-map', {
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        dragging: false,
        attributionControl: false
    }).setView([42.5149, -83.0364], 9);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 12,
        minZoom: 8
    }).addTo(compactMap);

    // County boundary coordinates (simplified)
    const oaklandCounty = [
        [42.8708, -83.6547], [42.8708, -83.0725], [42.6049, -83.0725],
        [42.4081, -83.1478], [42.4081, -83.3646], [42.4608, -83.5814],
        [42.6576, -83.6547], [42.8708, -83.6547]
    ];

    const wayneCounty = [
        [42.6049, -83.0725], [42.6049, -82.9087], [42.4081, -82.9087],
        [42.1586, -82.9087], [42.1586, -83.2877], [42.4081, -83.3646],
        [42.4081, -83.1478], [42.6049, -83.0725]
    ];

    const macombCounty = [
        [42.8708, -83.0725], [42.8708, -82.5449], [42.6049, -82.5449],
        [42.6049, -82.9087], [42.6049, -83.0725], [42.8708, -83.0725]
    ];

    // County highlighting style
    const compactCountyStyle = {
        fillColor: '#C8AF6A',
        weight: 2,
        opacity: 0.8,
        color: '#C8AF6A',
        fillOpacity: 0.4
    };

    // Add county polygons to compact map
    L.polygon(oaklandCounty, compactCountyStyle).addTo(compactMap);
    L.polygon(wayneCounty, compactCountyStyle).addTo(compactMap);
    L.polygon(macombCounty, compactCountyStyle).addTo(compactMap);

    // Add service radius circle
    L.circle([42.5149, -83.0364], {
        color: '#C8AF6A',
        fillColor: '#C8AF6A',
        fillOpacity: 0.15,
        radius: 24140, // 15 miles
        weight: 2,
        dashArray: '5, 5'
    }).addTo(compactMap);

    // Add Warren headquarters marker
    const hqIcon = L.divIcon({
        className: 'compact-hq-marker',
        html: '<div class="hq-dot"></div>',
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });

    L.marker([42.5149, -83.0364], { icon: hqIcon }).addTo(compactMap);

    // Add click handler to redirect to full map
    compactMap.on('click', function() {
        window.location.href = '/service-areas.html';
    });

    // Add hover effect to map overlay
    const mapOverlay = document.querySelector('.map-overlay');
    const compactMapContainer = document.getElementById('homepage-service-map');
    
    if (mapOverlay && compactMapContainer) {
        compactMapContainer.addEventListener('mouseenter', function() {
            mapOverlay.style.opacity = '1';
        });
        
        compactMapContainer.addEventListener('mouseleave', function() {
            mapOverlay.style.opacity = '0.8';
        });
        
        compactMapContainer.style.cursor = 'pointer';
    }

    console.log('Compact service area map loaded successfully');
}

// Fallback for browsers that don't support modern JavaScript
if (!window.L) {
    console.error('Leaflet library not loaded. Map functionality will not work.');
    const mapContainer = document.getElementById('service-area-map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="padding: 40px; text-align: center; background: #f5f5f5; border-radius: 8px;">
                <h3>Interactive Map Unavailable</h3>
                <p>The interactive map requires JavaScript to be enabled. Please enable JavaScript or contact us directly:</p>
                <a href="tel:248-709-3746" style="display: inline-block; background: #C8AF6A; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; margin-top: 10px;">Call 248-709-3746</a>
            </div>
        `;
    }
}