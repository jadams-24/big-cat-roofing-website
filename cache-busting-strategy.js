#!/usr/bin/env node

/**
 * Cache Busting Strategy Implementation
 * Adds version hashes to static assets for optimal caching
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class CacheBuster {
    constructor() {
        this.assetMap = new Map();
        this.publicDir = './public_html';
        this.manifestFile = './public_html/cache-manifest.json';
    }

    /**
     * Generate cache-busted filenames for all static assets
     */
    async generateCacheBustedAssets() {
        console.log('🔄 Generating cache-busted asset names...\n');

        const assets = await this.findStaticAssets();

        for (const asset of assets) {
            const hash = await this.generateFileHash(asset);
            const bustableFilename = this.createBustableFilename(asset, hash);

            this.assetMap.set(asset, {
                original: asset,
                busted: bustableFilename,
                hash: hash,
                size: (await fs.stat(asset)).size
            });
        }

        await this.generateManifest();
        await this.updateHTMLReferences();

        console.log(`✅ Cache busting complete! ${assets.length} assets processed.\n`);
        return this.assetMap;
    }

    /**
     * Find all static assets that need cache busting
     */
    async findStaticAssets() {
        const assets = [];
        const directories = [
            `${this.publicDir}/css`,
            `${this.publicDir}/js`,
            `${this.publicDir}/assets`,
            `${this.publicDir}/images`
        ];

        for (const dir of directories) {
            try {
                const files = await this.getFilesRecursively(dir);
                assets.push(...files.filter(file =>
                    /\.(css|js|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf)$/i.test(file)
                ));
            } catch (error) {
                // Directory might not exist
                continue;
            }
        }

        return assets;
    }

    /**
     * Get all files recursively from directory
     */
    async getFilesRecursively(dir) {
        const files = [];

        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    const subFiles = await this.getFilesRecursively(fullPath);
                    files.push(...subFiles);
                } else {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            // Directory doesn't exist or can't be read
        }

        return files;
    }

    /**
     * Generate SHA-256 hash for file content
     */
    async generateFileHash(filePath) {
        try {
            const content = await fs.readFile(filePath);
            return crypto.createHash('sha256').update(content).digest('hex').substring(0, 8);
        } catch (error) {
            console.warn(`Could not hash file ${filePath}:`, error.message);
            return 'fallback';
        }
    }

    /**
     * Create cache-busted filename
     */
    createBustableFilename(originalPath, hash) {
        const ext = path.extname(originalPath);
        const base = originalPath.replace(ext, '');
        return `${base}-${hash}${ext}`;
    }

    /**
     * Generate cache manifest for reference
     */
    async generateManifest() {
        const manifest = {
            timestamp: new Date().toISOString(),
            version: this.generateVersion(),
            assets: {}
        };

        for (const [original, data] of this.assetMap) {
            const relativePath = original.replace(`${this.publicDir}/`, '');
            const bustedPath = data.busted.replace(`${this.publicDir}/`, '');

            manifest.assets[relativePath] = {
                busted: bustedPath,
                hash: data.hash,
                size: data.size
            };
        }

        await fs.writeFile(this.manifestFile, JSON.stringify(manifest, null, 2));
        console.log(`📝 Cache manifest generated: ${this.manifestFile}`);
    }

    /**
     * Update HTML files with cache-busted references
     */
    async updateHTMLReferences() {
        const htmlFiles = await this.findHTMLFiles();

        for (const htmlFile of htmlFiles) {
            await this.updateHTMLFile(htmlFile);
        }

        console.log(`🔄 Updated ${htmlFiles.length} HTML files with cache-busted references`);
    }

    /**
     * Find all HTML files
     */
    async findHTMLFiles() {
        const files = await this.getFilesRecursively(this.publicDir);
        return files.filter(file => /\.html$/i.test(file));
    }

    /**
     * Update individual HTML file
     */
    async updateHTMLFile(htmlFile) {
        try {
            let content = await fs.readFile(htmlFile, 'utf8');
            let updated = false;

            for (const [original, data] of this.assetMap) {
                const relativePath = original.replace(`${this.publicDir}/`, '');
                const bustedPath = data.busted.replace(`${this.publicDir}/`, '');

                // Update references (href, src)
                const patterns = [
                    new RegExp(`(href=["'])([^"']*${relativePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})([^"']*["'])`, 'g'),
                    new RegExp(`(src=["'])([^"']*${relativePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})([^"']*["'])`, 'g')
                ];

                for (const pattern of patterns) {
                    if (pattern.test(content)) {
                        content = content.replace(pattern, `$1${bustedPath}$3`);
                        updated = true;
                    }
                }
            }

            if (updated) {
                await fs.writeFile(htmlFile, content);
            }
        } catch (error) {
            console.warn(`Could not update HTML file ${htmlFile}:`, error.message);
        }
    }

    /**
     * Generate version string
     */
    generateVersion() {
        const now = new Date();
        return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    }

    /**
     * Revert cache busting (for development)
     */
    async revertCacheBusting() {
        console.log('🔄 Reverting cache busting...\n');

        try {
            const manifest = JSON.parse(await fs.readFile(this.manifestFile, 'utf8'));

            // Revert HTML files
            const htmlFiles = await this.findHTMLFiles();
            for (const htmlFile of htmlFiles) {
                await this.revertHTMLFile(htmlFile, manifest);
            }

            console.log('✅ Cache busting reverted successfully.\n');
        } catch (error) {
            console.error('Failed to revert cache busting:', error.message);
        }
    }

    /**
     * Revert individual HTML file
     */
    async revertHTMLFile(htmlFile, manifest) {
        try {
            let content = await fs.readFile(htmlFile, 'utf8');

            for (const [original, data] of Object.entries(manifest.assets)) {
                const bustedPath = data.busted;

                // Revert references
                const patterns = [
                    new RegExp(`(href=["'])([^"']*${bustedPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})([^"']*["'])`, 'g'),
                    new RegExp(`(src=["'])([^"']*${bustedPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})([^"']*["'])`, 'g')
                ];

                for (const pattern of patterns) {
                    content = content.replace(pattern, `$1${original}$3`);
                }
            }

            await fs.writeFile(htmlFile, content);
        } catch (error) {
            console.warn(`Could not revert HTML file ${htmlFile}:`, error.message);
        }
    }
}

// Export for use in other modules
module.exports = CacheBuster;

// CLI usage
if (require.main === module) {
    const cacheBuster = new CacheBuster();
    const action = process.argv[2];

    if (action === 'revert') {
        cacheBuster.revertCacheBusting()
            .then(() => console.log('✅ Cache busting reverted!'))
            .catch(console.error);
    } else {
        cacheBuster.generateCacheBustedAssets()
            .then(() => {
                console.log('🎉 Cache busting implementation complete!');
                console.log('\nNext steps:');
                console.log('1. Test website functionality');
                console.log('2. Run cache header verification');
                console.log('3. Deploy to production');
                console.log('4. Monitor performance improvements');
                console.log('\nTo revert: node cache-busting-strategy.js revert');
            })
            .catch(console.error);
    }
}