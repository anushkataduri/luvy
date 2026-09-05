import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.join(__dirname, 'src/assets/Pearl Drop Earrings.png');
const destPath = path.join(__dirname, 'public/assets/pearl-drop-earrings.png');

fs.copyFile(sourcePath, destPath, (err) => {
  if (err) {
    console.error('Error copying Pearl Drop Earrings image:', err);
  } else {
    console.log('✓ Pearl Drop Earrings image copied successfully!');
  }
});
