import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.join(__dirname, 'src/assets/contact us background.png');
const destPath = path.join(__dirname, 'public/assets/contact-background.png');

fs.copyFile(sourcePath, destPath, (err) => {
  if (err) {
    console.error('Error copying file:', err);
  } else {
    console.log('Contact background image copied successfully!');
  }
});
