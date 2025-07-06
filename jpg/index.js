const content = document.querySelector('.content');
import icons from '../src/scripts/icons.js';

document.title = 'JPG Compressor | ConvertThing';

let selectedFile; // ✅ this will always be the real File

function mainPage() {
    content.innerHTML = `
    <div class="nav">
        <div class="nav-inner">
            <a href="https://eris.pages.dev/convertthing" class="inherit"><span class="logo">Convert<font style="color: var(--accent)">Thing</font></span></a>
            <icon>${icons.arrow}</icon>
            <span class="name">JPG Compressor</span>
        </div>
    </div>
    <div class="main">
        <div class="main-inner">
            <div class="pre">
                <input id="fileInput" type="file" accept="image/jpeg, image/png, image/webp" />
            </div>
        </div>
    </div>
    `;

    const fileInput = document.querySelector('#fileInput');

    fileInput.addEventListener('change', () => {
        selectedFile = fileInput.files[0]; // ✅ store real file
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                conversionPage();
                updatePreview();
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(selectedFile);
    });

    document.addEventListener('paste', e => {
        const items = e.clipboardData.items;
        const pastedFile = items[0].getAsFile();
        if (pastedFile && pastedFile.type.startsWith('image/')) {
            selectedFile = pastedFile; // ✅ store real file
            conversionPage();
            updatePreview();
        }
    });
}

mainPage();

function conversionPage() {
    content.innerHTML = `
    <div class="nav">
        <div class="nav-inner">
            <a href="https://eris.pages.dev/convertthing" class="inherit"><span class="logo">Convert<font style="color: var(--accent)">Thing</font></span></a>
            <icon>${icons.arrow}</icon>
            <span class="name">JPG Compressor</span>
        </div>
    </div>
    <div class="main">
        <div class="main-inner">
            <div class="jpg-container">
                <img id="jpg" class="preview" src="" alt="Compressed JPG" width="200px" height="200px" />
            </div>
            <div class="options">
                <div class="select" id="quality-options">
                    <span id="quality__0.01">BitCrush</span>
                    <span id="quality__0.1">10%</span>
                    <span id="quality__0.5" class="selected">50%</span>
                    <span id="quality__0.8">80%</span>
                    <span id="quality__1">100%</span>
                </div>
                <div class="select" id="file-options">
                    <span id="file__jpg" class="selected">jpg</span>
                    <span id="file__webp">webp</span>
                </div>
            </div>
            <div class="buttons">
                <button id="download">Download</button>
                <button id="copy">Copy</button>
                <button id="back">Back</button>
            </div>
        </div>
    </div>
    `;

    const qualityOptions = document.querySelectorAll('#quality-options span');
    qualityOptions.forEach(option => {
        option.addEventListener('click', () => {
            document.querySelector('#quality-options .selected').classList.remove('selected');
            option.classList.add('selected');
            updatePreview();
        });
    });

    const fileOptions = document.querySelectorAll('#file-options span');
    fileOptions.forEach(option => {
        option.addEventListener('click', () => {
            document.querySelector('#file-options .selected').classList.remove('selected');
            option.classList.add('selected');
            updatePreview();
        });
    });

    document.querySelector('#download').addEventListener('click', () => {
        const jpg = document.querySelector('#jpg');
        const fileType = document.querySelector('#file-options .selected').id.split('__')[1];
        const fileBaseName = selectedFile.name ? selectedFile.name.split('.')[0] : 'image';
        const link = document.createElement('a');
        link.download = `${fileBaseName}-compressed.${fileType}`;
        link.href = jpg.src;
        link.click();
    });

    document.querySelector('#copy').addEventListener('click', () => {
        const jpg = document.querySelector('#jpg');

        const image = new Image();
        image.crossOrigin = 'anonymous'; // convert to png because DUMB
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            canvas.toBlob(blob => {
                const item = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([item]).then(() => {
                    const copyButton = document.querySelector('#copy');
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 1000);
                }).catch(err => {
                    console.error('Failed to copy image: ', err);
                });
            }, 'image/png');
        };
        image.src = jpg.src;
    });

    document.querySelector('#back').addEventListener('click', () => {
        mainPage();
    });
}

function updatePreview() {
    const img = document.querySelector('#jpg');
    const quality = parseFloat(document.querySelector('#quality-options .selected').id.split('__')[1]);

    if (quality === 1) {
        img.src = URL.createObjectURL(selectedFile);
    } else {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.onload = () => {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                const useWebp = document.querySelector('#file-options .selected').id.split('__')[1] === 'webp';
                const mimeType = useWebp ? 'image/webp' : 'image/jpeg';
                const qualityVal = useWebp ? 1 : quality;
                const compressedImageData = canvas.toDataURL(mimeType, qualityVal);
                img.src = compressedImageData;
                URL.revokeObjectURL(image.src);
            };
            image.src = reader.result;
        };
        reader.readAsDataURL(selectedFile);
    }
}
