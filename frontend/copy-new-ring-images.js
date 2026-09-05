import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  { source: 'Silver Band Ring.png', dest: 'silver-band-ring.png' },
  { source: 'Emerald Cut Ring.png', dest: 'emerald-cut-ring.png' },
  { source: 'Pearl Promise Ring.png', dest: 'pearl-promise-ring.png' },
  { source: 'Vintage Style Ring.png', dest: 'vintage-style-ring.png' }
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
