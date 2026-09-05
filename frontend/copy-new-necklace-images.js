import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  { source: 'Diamond Tennis Necklace.png', dest: 'diamond-tennis-necklace.png' },
  { source: 'Pearl Strand Necklace.png', dest: 'pearl-strand-necklace.png' },
  { source: 'Gold Chain Necklace.png', dest: 'gold-chain-necklace.png' },
  { source: 'Silver Locket Necklace.png', dest: 'silver-locket-necklace.png' }
];

images.forEach(image => {
  const sourcePath = path.join(__dirname, 'src/assets', image.source);
  const destPath = path.join(__dirname, 'public/assets', image.dest);
  
  fs.copyFile(sourcePath, destPath, (err) => {
    if (err) {
      console.error(`Error copying ${image.source}:`, err);
    } else {
      console.log(`✓ ${image.source} copied successfully!`);
    }
  });
});
