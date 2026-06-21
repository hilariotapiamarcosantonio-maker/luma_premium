const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const srcDir = 'F:/Luma Premium/public/images/marketing/screenshots';
const thumbDir = path.join(srcDir, 'optimized', 'thumb');
const fullDir = path.join(srcDir, 'optimized', 'full');

// Ensure directories exist
fs.mkdirSync(thumbDir, { recursive: true });
fs.mkdirSync(fullDir, { recursive: true });

const files = fs.readdirSync(srcDir);

async function run() {
  console.log("Starting screenshot sizes generation (Thumb & Full)...");
  
  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) continue;

    const ext = path.extname(file).toLowerCase();
    const nameWithoutExt = path.basename(file, ext);
    
    // Normalize filename
    const normalizedName = nameWithoutExt
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_.-]/g, '');

    if (ext === '.png') {
      const thumbDest = path.join(thumbDir, `${normalizedName}.webp`);
      const fullDest = path.join(fullDir, `${normalizedName}.webp`);
      
      console.log(`Processing PNG: ${file}`);
      const image = sharp(srcPath);
      const metadata = await image.metadata();
      const isLandscape = metadata.width > metadata.height;

      // 1. Generate Thumbnail (max-width 1600px for landscape, max-height 1800px for portrait)
      console.log(`  Generating Thumbnail for ${file} -> ${normalizedName}.webp`);
      let thumbPipeline = sharp(srcPath);
      if (isLandscape) {
        thumbPipeline = thumbPipeline.resize({ width: 1600 });
      } else {
        thumbPipeline = thumbPipeline.resize({ height: 1800 });
      }
      await thumbPipeline
        .webp({ quality: 82 })
        .toFile(thumbDest);
      const thumbStat = fs.statSync(thumbDest);
      console.log(`    Thumb done: ${(thumbStat.size / 1024).toFixed(1)} KB`);

      // 2. Generate Full Size (max-width 2400px for landscape, max-height 2600px for portrait)
      console.log(`  Generating Full-size for ${file} -> ${normalizedName}.webp`);
      let fullPipeline = sharp(srcPath);
      if (isLandscape) {
        fullPipeline = fullPipeline.resize({ width: 2400 });
      } else {
        fullPipeline = fullPipeline.resize({ height: 2600 });
      }
      await fullPipeline
        .webp({ quality: 88 })
        .toFile(fullDest);
      const fullStat = fs.statSync(fullDest);
      console.log(`    Full done: ${(fullStat.size / 1024).toFixed(1)} KB`);

    } else if (ext === '.svg') {
      // Copy SVG as-is to both directories
      const thumbDest = path.join(thumbDir, `${normalizedName}.svg`);
      const fullDest = path.join(fullDir, `${normalizedName}.svg`);
      
      console.log(`Copying SVG to optimized directories: ${file}`);
      fs.copyFileSync(srcPath, thumbDest);
      fs.copyFileSync(srcPath, fullDest);
    }
  }
  console.log("Screenshot size generation completed successfully.");
}

run().catch(err => {
  console.error("Error generating screenshot sizes:", err);
  process.exit(1);
});
