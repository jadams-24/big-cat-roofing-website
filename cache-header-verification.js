#!/usr/bin/env node

/**
 * Cache Header Verification Tool
 * Tests cache headers for all resource types to ensure 1,390 KiB savings
 */

const http = require('http');
const https = require('https');
const fs = require('fs').promises;

class CacheHeaderVerifier {
    constructor(baseUrl = 'http://localhost') {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.results = {
            passed: [],
            failed: [],
            warnings: [],
            totalSavings: 0
        };
        this.testResources = [];
    }

    /**
     * Run comprehensive cache header verification
     */
    async verify() {
        console.log('🔍 Starting Cache Header Verification...\n');
        console.log(`Base URL: ${this.baseUrl}\n`);

        await this.loadTestResources();
        await this.testAllResources();
        this.generateReport();

        return this.results;
    }

    /**
     * Load test resources based on PageSpeed Insights issues
     */
    async loadTestResources() {
        // Resources mentioned in PageSpeed Insights with current cache issues
        this.testResources = [
            // HTML pages
            { url: '/', type: 'html', expectedMaxAge: 3600, size: 50 },
            { url: '/contact.html', type: 'html', expectedMaxAge: 3600, size: 45 },
            { url: '/residential-roofing.html', type: 'html', expectedMaxAge: 3600, size: 48 },

            // Static CSS files
            { url: '/css/styles.css', type: 'css', expectedMaxAge: 31536000, size: 25 },
            { url: '/css/bootstrap.min.css', type: 'css', expectedMaxAge: 31536000, size: 32 },

            // Static JavaScript files
            { url: '/js/main.js', type: 'js', expectedMaxAge: 31536000, size: 45 },
            { url: '/js/contact.js', type: 'js', expectedMaxAge: 31536000, size: 20 },

            // Images
            { url: '/assets/images/logo.png', type: 'image', expectedMaxAge: 31536000, size: 15 },
            { url: '/assets/images/roofing-hero.webp', type: 'image', expectedMaxAge: 31536000, size: 85 },

            // Fonts
            { url: '/assets/fonts/font.woff2', type: 'font', expectedMaxAge: 31536000, size: 12 },

            // Third-party resource proxies (if implemented)
            { url: '/proxy/maps-api', type: 'api', expectedMaxAge: 86400, size: 50 },

            // Manifest and special files
            { url: '/manifest.json', type: 'json', expectedMaxAge: 3600, size: 2 },
            { url: '/sitemap.xml', type: 'xml', expectedMaxAge: 86400, size: 5 }
        ];

        console.log(`📋 ${this.testResources.length} resources queued for testing\n`);
    }

    /**
     * Test cache headers for all resources
     */
    async testAllResources() {
        for (const resource of this.testResources) {
            try {
                await this.testResource(resource);
                await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
            } catch (error) {
                this.results.failed.push({
                    url: resource.url,
                    error: error.message,
                    type: resource.type
                });
            }
        }
    }

    /**
     * Test individual resource cache headers
     */
    async testResource(resource) {
        return new Promise((resolve, reject) => {
            const url = `${this.baseUrl}${resource.url}`;
            const client = url.startsWith('https:') ? https : http;

            const req = client.request(url, { method: 'HEAD' }, (res) => {
                const cacheControl = res.headers['cache-control'] || '';
                const expires = res.headers['expires'];
                const etag = res.headers['etag'];
                const lastModified = res.headers['last-modified'];

                const test = this.evaluateCacheHeaders({
                    cacheControl,
                    expires,
                    etag,
                    lastModified,
                    statusCode: res.statusCode
                }, resource);

                if (test.passed) {
                    this.results.passed.push(test);
                    this.results.totalSavings += resource.size || 0;
                } else {
                    this.results.failed.push(test);
                }

                if (test.warning) {
                    this.results.warnings.push(test);
                }

                resolve(test);
            });

            req.on('error', (error) => {
                reject(new Error(`Request failed: ${error.message}`));
            });

            req.setTimeout(5000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            req.end();
        });
    }

    /**
     * Evaluate cache headers against expected values
     */
    evaluateCacheHeaders(headers, resource) {
        const result = {
            url: resource.url,
            type: resource.type,
            expectedMaxAge: resource.expectedMaxAge,
            actualHeaders: headers,
            passed: false,
            issues: [],
            recommendations: []
        };

        // Check status code
        if (headers.statusCode !== 200) {
            result.issues.push(`HTTP ${headers.statusCode} - Resource not accessible`);
            return result;
        }

        // Parse cache-control
        const cacheControl = this.parseCacheControl(headers.cacheControl);

        // Check max-age
        if (!cacheControl['max-age']) {
            result.issues.push('Missing max-age directive');
        } else {
            const maxAge = parseInt(cacheControl['max-age']);
            if (maxAge < resource.expectedMaxAge) {
                result.issues.push(`max-age too low: ${maxAge} < ${resource.expectedMaxAge}`);
            } else {
                result.passed = true;
            }
        }

        // Check public directive for static assets
        if (['css', 'js', 'image', 'font'].includes(resource.type)) {
            if (!cacheControl.public) {
                result.issues.push('Missing public directive for static asset');
            }
        }

        // Check immutable for versioned files
        if (['css', 'js', 'font'].includes(resource.type)) {
            if (!cacheControl.immutable) {
                result.recommendations.push('Consider adding immutable directive for versioned assets');
            }
        }

        // Check ETag removal for immutable assets
        if (cacheControl.immutable && headers.etag) {
            result.recommendations.push('Remove ETag for immutable assets to save bandwidth');
        }

        // Check must-revalidate for HTML
        if (resource.type === 'html') {
            if (!cacheControl['must-revalidate']) {
                result.recommendations.push('Consider adding must-revalidate for HTML files');
            }
        }

        // Overall pass/fail
        result.passed = result.issues.length === 0;

        return result;
    }

    /**
     * Parse cache-control header into object
     */
    parseCacheControl(cacheControlHeader) {
        const directives = {};

        if (!cacheControlHeader) return directives;

        const parts = cacheControlHeader.split(',').map(part => part.trim());

        for (const part of parts) {
            if (part.includes('=')) {
                const [key, value] = part.split('=', 2);
                directives[key.trim()] = value.trim();
            } else {
                directives[part.trim()] = true;
            }
        }

        return directives;
    }

    /**
     * Generate comprehensive report
     */
    generateReport() {
        console.log('📊 CACHE HEADER VERIFICATION REPORT\n');
        console.log('=' * 50);

        // Summary
        console.log(`\n📈 SUMMARY:`);
        console.log(`✅ Passed: ${this.results.passed.length}`);
        console.log(`❌ Failed: ${this.results.failed.length}`);
        console.log(`⚠️  Warnings: ${this.results.warnings.length}`);
        console.log(`💾 Estimated Savings: ${this.results.totalSavings} KiB`);

        // Target achievement
        const targetSavings = 1390; // KiB from PageSpeed Insights
        const achievementPercent = (this.results.totalSavings / targetSavings * 100).toFixed(1);
        console.log(`🎯 Target Achievement: ${achievementPercent}% (${this.results.totalSavings}/${targetSavings} KiB)`);

        // Failed tests
        if (this.results.failed.length > 0) {
            console.log(`\n❌ FAILED TESTS (${this.results.failed.length}):`);
            this.results.failed.forEach((test, index) => {
                console.log(`\n${index + 1}. ${test.url} (${test.type})`);
                test.issues.forEach(issue => console.log(`   • ${issue}`));
            });
        }

        // Warnings and recommendations
        if (this.results.warnings.length > 0) {
            console.log(`\n⚠️  WARNINGS AND RECOMMENDATIONS:`);
            this.results.warnings.forEach((test, index) => {
                if (test.recommendations && test.recommendations.length > 0) {
                    console.log(`\n${test.url}:`);
                    test.recommendations.forEach(rec => console.log(`   • ${rec}`));
                }
            });
        }

        // Optimization suggestions
        console.log(`\n💡 OPTIMIZATION SUGGESTIONS:`);
        if (this.results.totalSavings < targetSavings) {
            console.log(`• Increase cache durations for failing resources`);
            console.log(`• Implement cache-busting for versioned assets`);
            console.log(`• Add service worker for advanced caching`);
            console.log(`• Configure proxy caching for third-party resources`);
        } else {
            console.log(`🎉 Excellent! You've achieved the target cache savings!`);
        }

        console.log(`\n📋 NEXT STEPS:`);
        console.log(`1. Fix failed cache header configurations`);
        console.log(`2. Implement recommended optimizations`);
        console.log(`3. Re-run verification after changes`);
        console.log(`4. Test with PageSpeed Insights to confirm savings`);
    }

    /**
     * Save detailed report to file
     */
    async saveReport() {
        const report = {
            timestamp: new Date().toISOString(),
            baseUrl: this.baseUrl,
            summary: {
                passed: this.results.passed.length,
                failed: this.results.failed.length,
                warnings: this.results.warnings.length,
                totalSavings: this.results.totalSavings,
                targetSavings: 1390,
                achievementPercent: (this.results.totalSavings / 1390 * 100).toFixed(1)
            },
            details: {
                passed: this.results.passed,
                failed: this.results.failed,
                warnings: this.results.warnings
            }
        };

        await fs.writeFile('./cache-verification-report.json', JSON.stringify(report, null, 2));
        console.log(`\n📄 Detailed report saved to: cache-verification-report.json`);
    }
}

// Export for use in other modules
module.exports = CacheHeaderVerifier;

// CLI usage
if (require.main === module) {
    const baseUrl = process.argv[2] || 'http://localhost';
    const verifier = new CacheHeaderVerifier(baseUrl);

    verifier.verify()
        .then(async () => {
            await verifier.saveReport();
            console.log('\n✅ Cache header verification complete!');

            // Exit with error code if tests failed
            if (verifier.results.failed.length > 0) {
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('❌ Verification failed:', error.message);
            process.exit(1);
        });
}