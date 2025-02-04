const content = document.querySelector('.content');
const app = document.querySelector('.app');

import 
icons from './src/scripts/icons.js';

document.title = 'ConvertThing';

let file;

function mainPage() {
    content.innerHTML = `
    <div class="nav">
        <div class="nav-inner">
            <a href="https://eris.pages.dev/convertthing" class="inherit"><span class="logo">Convert<font style="color: var(--accent)">Thing</font></span></a>
        </div>
    </div>
    <div class="main">
        <div class="main-inner">
            <div class="pre">
                <a href="svg" class="big-link">SVG to PNG</a>
                <a href="jpg" class="big-link">JPG Compressor</a>
                <a href="square" class="big-link">SquareTool</a>
            </div>
        </div>
    </div>
    `;
}

mainPage();