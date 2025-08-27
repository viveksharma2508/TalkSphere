import { loadEnv } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve to the Vite project root (one level up from Scripts/)
const root = path.resolve(__dirname, '..');
const mode = process.env.NODE_ENV || 'development';

// Only VITE_* keys are exposed to the client
const env = loadEnv(mode, root, 'VITE_');
console.log('VITE_IMAGEKIT_URL_ENDPOINT:', env.VITE_IMAGEKIT_URL_ENDPOINT);