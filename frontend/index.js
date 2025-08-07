import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Starting Paragon Frontend Server...');
console.log('Directory:', __dirname);

// Check if dist folder exists, if not build first
const distPath = path.join(__dirname, 'dist');
console.log('Checking for dist folder at:', distPath);

if (!existsSync(distPath)) {
  console.log('Dist folder not found. Building application...');
  exec('npm run build', (error, stdout, stderr) => {
    if (error) {
      console.error('Build failed:', error);
      process.exit(1);
    }
    console.log('Build completed successfully');
    console.log(stdout);
    startServer();
  });
} else {
  console.log('Dist folder found. Starting server...');
  startServer();
}

function startServer() {
  // Serve static files from dist directory
  app.use(express.static(path.join(__dirname, 'dist')));

  // Handle React Router - send all requests to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Frontend server running on port ${PORT}`);
    console.log(`🌐 Server accessible at http://localhost:${PORT}`);
  });
}
