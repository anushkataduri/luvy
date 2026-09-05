import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  { source: 'Gold Hoop Earrings.png', dest: 'gold-hoop-earrings.png' },
  { source: 'Silver Stud Earrings.png', dest: 'silver-stud-earrings.png' },
  { source: 'Crystal Chandelier Earrings.png', dest: 'crystal-chandelier-earrings.png' }
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
