const content = document.querySelector('.content');
const app = document.querySelector('.app');

import icons from '../src/scripts/icons.js';

document.title = 'SquareTool | ConvertThing';

let file;
let originalImage;


function mainPage() {
    content.innerHTML = `
    <div class="nav">
        <div class="nav-inner">
            <a href="https://eris.pages.dev/convertthing" class="inherit"><span class="logo">Convert<font style="color: var(--accent)">Thing</font></span></a>
            <icon>${icons.arrow}</icon>
            <span class="name">SquareTool</span>
        </div>
    </div>
    <div class="main">
        <div class="main-inner">
            <div class="pre">
                <input id="file" type="file" accept="image/*" />
                <p id="error-message" class="error" style="color: red; display: none;"></p>
            </div>
        </div>
    </div>
    `;

    file = document.querySelector('#file');
    const errorMessage = document.querySelector('#error-message');

    file.addEventListener('change', () => {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';

        if (!file.files || file.files.length === 0) {
            alert('Please select an image file.');
            return;
        }

        const selectedFile = file.files[0];
        
        if (!selectedFile.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        const reader = new FileReader();
        
        reader.onerror = () => {
            alert('Error reading the file. Please try again.');
        };

        reader.onload = () => {
            const img = new Image();
            
            img.onerror = () => {
                alert('Error loading the image. Please try again.');
            };
        
            img.onload = () => {
                originalImage = img;
                
                conversionPage();
                updatePreview(originalImage);
            };
        
            img.src = reader.result;
        };
        

        reader.readAsDataURL(selectedFile);
    });
}

mainPage();

function conversionPage() {
    content.innerHTML = `
    <div class="nav">
        <div class="nav-inner">
            <a href="https://eris.pages.dev/convertthing" class="inherit"><span class="logo">Convert<font style="color: var(--accent)">Thing</font></span></a>
            <icon>${icons.arrow}</icon>
            <span class="name">SquareTool</span>
        </div>
    </div>
    <div class="main">
        <div class="main-inner">
            <div class="square-container">
                <img id="square" class="preview" src="" alt="Converted Square" width="300" height="300" />
            </div>
            <div class="options">
                <div class="select" id="background-options">
                    <span id="background__black">Black</span>
                    <span id="background__white">White</span>
                    <span id="background__detected" class="selected">Detected</span>
                    <span id="background__blur">Blur</span>
                </div>
            </div>
            <div class="buttons">
                <button id="download">Download</button>
                <button id="back">Back</button>
            </div>
        </div>
    </div>
    `;

    const backgroundOptions = document.querySelectorAll('#background-options span');

    backgroundOptions.forEach(option => {
        option.addEventListener('click', () => {
            document.querySelector('#background-options .selected').classList.remove('selected');
            option.classList.add('selected');
            updatePreview(originalImage); // Use the original image here
        });
    });
    

    document.querySelector('#download').addEventListener('click', () => {
        const square = document.querySelector('#square');
        const link = document.createElement('a');
        link.download = `${file.files[0].name.split('.')[0]}-square.png`;
        link.href = square.src;
        link.click();
    });

    document.querySelector('#back').addEventListener('click', () => {
        mainPage();
    });
}

function updatePreview(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const selectedBackground = document.querySelector('#background-options .selected').id.split('__')[1];
    const dominantColor = getDominantColor(img);

    const size = Math.max(img.width, img.height);
    canvas.width = canvas.height = size;

    if (selectedBackground === 'blur') {
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const dx = (canvas.width - scaledWidth) / 2;
        const dy = (canvas.height - scaledHeight) / 2;

        ctx.filter = 'blur(10px)';
        ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight);
        ctx.filter = 'none';
    } else {
        let fillColor;
        switch(selectedBackground) {
            case 'black':
                fillColor = '#000000';
                break;
            case 'white':
                fillColor = '#ffffff';
                break;
            case 'detected':
                fillColor = dominantColor;
                break;
        }
        ctx.fillStyle = fillColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    ctx.drawImage(img, 
        (canvas.width - img.width) / 2, 
        (canvas.height - img.height) / 2,
        img.width,
        img.height
    );

    const squareDataUrl = canvas.toDataURL('image/png');
    previewImage(squareDataUrl);
}

function getDominantColor(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.height = Math.max(img.width, img.height);

    ctx.drawImage(img, 
        (canvas.width - img.width) / 2, 
        (canvas.height - img.height) / 2
    );

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const colors = [];

    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) {
            colors.push([data[i], data[i + 1], data[i + 2]]);
        }
    }

    const colorCounts = {};
    let maxCount = 0;
    let dominantColor = [0, 0, 0];

    colors.forEach(color => {
        const key = color.join(',');
        colorCounts[key] = (colorCounts[key] || 0) + 1;

        if (colorCounts[key] > maxCount) {
            maxCount = colorCounts[key];
            dominantColor = color;
        }
    });

    return `rgb(${dominantColor.join(', ')})`;
}

function previewImage(squareDataUrl) {
    const square = document.querySelector('#square');
    square.src = squareDataUrl;
}