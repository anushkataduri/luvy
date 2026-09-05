import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  { source: 'src/assets/Bracelets home.png', dest: 'public/assets/bracelets-home.png' },
  { source: 'src/assets/Handbag home.png', dest: 'public/assets/handbag-home.png' },
  { source: 'src/assets/Necklaces home.png', dest: 'public/assets/necklaces-home.png' },
  { source: 'src/assets/Ring home.png', dest: 'public/assets/ring-home.png' }
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
