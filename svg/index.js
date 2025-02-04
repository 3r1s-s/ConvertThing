const content = document.querySelector('.content');
const app = document.querySelector('.app');

import 
icons from '../src/scripts/icons.js';

document.title = 'SVG to PNG | ConvertThing';

let file;

function mainPage() {
    content.innerHTML = `
    <div class="nav">
        <div class="nav-inner">
            <a href="https://eris.pages.dev/convertthing" class="inherit"><span class="logo">Convert<font style="color: var(--accent)">Thing</font></span></a>
            <icon>${icons.arrow}</icon>
            <span class="name">SVG to PNG</span>
        </div>
    </div>
    <div class="main">
        <div class="main-inner">
            <div class="pre">
                <input id="file" type="file" accept="image/svg+xml" />
            </div>
        </div>
    </div>
    `;

    file = document.querySelector('#file');

    file.addEventListener('change', () => {
        const reader = new FileReader();
        reader.onload = () => {
            const svg = reader.result;
            const img = new Image();

            img.onload = () => {
                conversionPage();
                updatePreview();
            };

            img.src = svg;
        };
        reader.readAsDataURL(file.files[0]);
    });
}

mainPage();

function conversionPage() {
    content.innerHTML = `
    <div class="nav">
        <div class="nav-inner">
            <a href="https://eris.pages.dev/convertthing" class="inherit"><span class="logo">Convert<font style="color: var(--accent)">Thing</font></span></a>
            <icon>${icons.arrow}</icon>
            <span class="name">SVG to PNG</span>
        </div>
    </div>
    <div class="main">
        <div class="main-inner">
            <div class="png-container">
                <img id="png" class="preview" src="" alt="Converted PNG" width="200px" height="200px" />
            </div>
            <div class="options">
                <div class="select" id="scale-options">
                    <span id="scale__1" class="selected">1x</span>
                    <span id="scale__1-5">1.5x</span>
                    <span id="scale__2">2x</span>
                    <span id="scale__4">4x</span>
                </div>
                <div class="select" id="background-options">
                    <span id="background__black">Black</span>
                    <span id="background__white">White</span>
                    <span id="background__transparent" class="selected">Transparent</span>
                </div>
            </div>
            <div class="buttons">
                <button id="download">Download</button>
                <button id="back">Back</button>
            </div>
        </div>
    </div>
    `;

    const scaleOptions = document.querySelectorAll('#scale-options span');
    const backgroundOptions = document.querySelectorAll('#background-options span');

    scaleOptions.forEach(option => {
        option.addEventListener('click', () => {
            document.querySelector('#scale-options .selected').classList.remove('selected');
            option.classList.add('selected');
            updatePreview();
        });
    });

    backgroundOptions.forEach(option => {
        option.addEventListener('click', () => {
            document.querySelector('#background-options .selected').classList.remove('selected');
            option.classList.add('selected');
            updatePreview();
        });
    });

    document.querySelector('#download').addEventListener('click', () => {
        const png = document.querySelector('#png');
        const link = document.createElement('a');
        link.download = `${file.files[0].name.split('.')[0]}-converted.png`;
        link.href = png.src;
        link.click();
    });

    document.querySelector('#back').addEventListener('click', () => {
        mainPage();
    });
}

function updatePreview() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const scale = parseFloat(document.querySelector('#scale-options .selected').id.split('__')[1]);
    const backgroundColor = document.querySelector('#background-options .selected').id.split('__')[1];

    img.onload = () => {
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.fillStyle = backgroundColor === 'transparent' ? 'rgba(0,0,0,0)' : backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const png = canvas.toDataURL('image/png');
        previewImage(png);
    };

    img.src = URL.createObjectURL(file.files[0]);
}

function previewImage(pngDataUrl) {
    const png = document.querySelector('#png');
    png.src = pngDataUrl;
}