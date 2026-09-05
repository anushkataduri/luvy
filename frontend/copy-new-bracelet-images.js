import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  { source: 'Gold Chain Bracelet.png', dest: 'gold-chain-bracelet.png' },
  { source: 'Silver Charm Bracelet.png', dest: 'silver-charm-bracelet.png' },
  { source: 'Pearl Tennis Bracelet.png', dest: 'pearl-tennis-bracelet.png' },
  { source: 'Beaded Friendship Bracelet.png', dest: 'beaded-friendship-bracelet.png' }
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
