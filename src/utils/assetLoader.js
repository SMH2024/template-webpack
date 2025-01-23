// Asset loading optimization utilities
export class AssetLoader {
    constructor(scene) {
        this.scene = scene;
    }

    preloadAssets(assets) {
        // Group similar assets together
        const groups = this.groupAssets(assets);
        
        // Load assets in parallel within their groups
        Object.entries(groups).forEach(([type, items]) => {
            items.forEach(item => {
                switch(type) {
                    case 'image':
                        this.scene.load.image(item.key, item.path);
                        break;
                    case 'spritesheet':
                        this.scene.load.spritesheet(item.key, item.path, item.config);
                        break;
                    case 'audio':
                        this.scene.load.audio(item.key, item.path);
                        break;
                }
            });
        });

        // Add loading progress bar
        const progressBar = this.scene.add.graphics();
        const progressBox = this.scene.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        this.scene.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.scene.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
        });
    }

    groupAssets(assets) {
        return assets.reduce((acc, asset) => {
            if (!acc[asset.type]) {
                acc[asset.type] = [];
            }
            acc[asset.type].push(asset);
            return acc;
        }, {});
    }
}