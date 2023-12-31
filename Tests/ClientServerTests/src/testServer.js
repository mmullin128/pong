
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { startServer, closeServer } from '../../../ClientServer/src/server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env')});
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

process.chdir(path.join(__dirname, '../../../ClientServer/src/'));

startServer(PORT,DB_URI)
.catch(err => {
    console.error(err);
    process.exit(1);
})
.then(() => {});