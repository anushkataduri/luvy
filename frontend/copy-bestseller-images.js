import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  { source: 'src/assets/Diamond & Sapphire Drop Earrings home.png', dest: 'public/assets/diamond-sapphire-earrings.png' },
  { source: 'src/assets/Classic Navy Leather Handbag home.png', dest: 'public/assets/classic-navy-handbag.png' },
  { source: 'src/assets/Gold & Diamond Infinity Ring home.png', dest: 'public/assets/gold-diamond-ring.png' },
  { source: 'src/assets/Emerald Pendant Necklace home.png', dest: 'public/assets/emerald-pendant-necklace.png' }
];

images.forEach(({ source, dest }) => {
  const sourcePath = path.join(__dirname, source);
  const destPath = path.join(__dirname, dest);
  
  fs.copyFile(sourcePath, destPath, (err) => {
    if (err) {
      console.error(`Error copying ${source}:`, err);
    } else {
      console.log(`✓ ${source} copied successfully!`);
    }
  });
});
