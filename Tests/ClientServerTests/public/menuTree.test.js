import { JSDOM } from 'jsdom';
import pug from 'pug';

import { MenuTree } from "../../../ClientServer/public/menuTree";

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import axios from 'axios';
import { Socket } from '../public/socket.js';

test("menu tree", () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    dotenv.config({ path: path.join(__dirname, '../.env')});
    const renderFn = pug.compileFile(path.join(__dirname, "../../../ClientServer/src/views/index.pug"));
    const html = renderFn({});
    const { document } = (new JSDOM(html)).window;
    const menuTree = new MenuTree(document);
    //console.log(menuTree);
})