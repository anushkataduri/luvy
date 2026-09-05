import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.join(__dirname, 'src/assets/home earrings.png');
const destPath = path.join(__dirname, 'public/assets/home-earrings.png');

fs.copyFile(sourcePath, destPath, (err) => {
  if (err) {
    console.error('Error copying file:', err);
  } else {
    console.log('Home earrings image copied successfully!');
  }
});
