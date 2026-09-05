import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  { source: 'src/assets/Rose Gold Diamond Ring home.png', dest: 'public/assets/rose-gold-diamond-ring.png' },
  { source: 'src/assets/Pearl Cascade Earrings home.png', dest: 'public/assets/pearl-cascade-earrings.png' },
  { source: 'src/assets/Crystal Heart Necklace home.png', dest: 'public/assets/crystal-heart-necklace.png' },
  { source: 'src/assets/Leather Wrap Bracelet home.png', dest: 'public/assets/leather-wrap-bracelet.png' },
  { source: 'src/assets/Crossbody Mini Bag home.png', dest: 'public/assets/crossbody-mini-bag.png' }
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
