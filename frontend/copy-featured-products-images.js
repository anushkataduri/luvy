import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  { source: 'src/assets/Handcrafted Artisan Tote home.png', dest: 'public/assets/handcrafted-artisan-tote.png' },
  { source: 'src/assets/Handmade Beaded Bracelet home.png', dest: 'public/assets/handmade-beaded-bracelet.png' },
  { source: 'src/assets/Elegant Summer Dress home.png', dest: 'public/assets/elegant-summer-dress.png' }
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
