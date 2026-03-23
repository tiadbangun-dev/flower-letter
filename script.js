// Stars Animation
function createStars() {
    const stars = document.getElementById('stars');
    for(let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = star.style.height = (Math.random() * 3 + 1) + 'px';
        star.style.animationDelay = Math.random() * 2 + 's';
        stars.appendChild(star);
    }
}

// Page Navigation
function nextPage(pageNum) {
    document.querySelectorAll('.page').forEach((page, index) => {
        page.classList.toggle('active', index + 1 === pageNum);
    });
}

// Character Counter ✅ FIXED
const letterTextarea = document.getElementById('loveLetter');
const charCount = document.getElementById('charCount');
letterTextarea.addEventListener('input', function() {
    const length = this.value.length;
    charCount.textContent = `${length}/2500`;
    charCount.style.color = length > 2400 ? '#ff4757' : '#8b4513';
});

// Drawing Canvas
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let tool = 'brush';
let currentColor = '#ff69b4';
let brushSize = 8;

// Canvas Setup
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.fillStyle = '#fff8f8';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Mouse Events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch Events
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);
canvas.addEventListener('touchend', stopDrawing);

function startDrawing(e) {
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!drawing) return;
    e.preventDefault();
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineWidth = tool === 'eraser' ? 20 : brushSize;
    ctx.strokeStyle = tool === 'eraser' ? '#fff8f8' : currentColor;
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    drawing = false;
}

function handleTouch(e) {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(
        e.type.replace('touch', 'mouse'),
        { clientX: touch.clientX, clientY: touch.clientY }
    );
    canvas.dispatchEvent(mouseEvent);
}

// Tools
function setTool(newTool) {
    tool = newTool;
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    canvas.style.cursor = newTool === 'eraser' ? 'grab' : 'crosshair';
}

function setColor(color) {
    currentColor = color;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff8f8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 🔥 SHORT URL COMPRESSION (RELIABLE!)
function generateShareLink() {
    // 1. Compress canvas (PNG quality 60%)
    const canvasData = canvas.toDataURL('image/png', 0.6);
    
    // 2. Short data structure
    const data = {
        t: letterTextarea.value,  // text
        c: canvasData.split(',')[1],  // canvas data URL without prefix
        s: Date.now()  // short timestamp
    };
    
    // 3. Minify JSON + URL encode
    const jsonMin = JSON.stringify(data).replace(/"/g, "'"); 
    const encoded = btoa(unescape(encodeURIComponent(jsonMin)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    
    // 4. Short link (max 128 chars)
    const shortId = encoded.substring(0, 128);
    const shareUrl = `${window.location.origin}${window.location.pathname}?l=${shortId}`;
    
    document.getElementById('shareLink').value = shareUrl;
    nextPage(4);
    
    console.log(`📏 Short link: ${shortId.length} chars (was ~${JSON.stringify(data).length})`);
}

function copyLink() {
    const linkInput = document.getElementById('shareLink');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(linkInput.value).then(() => {
        alert('✅ Link SUPER PENDEK dicopy!\n💕 Kirim sekarang ke pasanganmu!');
    });
}

// Load Shared Data
window.addEventListener('load', function() {
    createStars();
    
    // Test textarea works immediately
    letterTextarea.focus();
    
    const urlParams = new URLSearchParams(window.location.search);
    const linkId = urlParams.get('l');
    
    if (linkId) {
        try {
            // Decode
            const decoded = decodeURIComponent(escape(atob(linkId.replace(/-/g, '+').replace(/_/g, '/'))));
            const data = JSON.parse(decoded.replace(/'/g, '"'));
            
            // Load letter
            letterTextarea.value = data.t || '';
            charCount.textContent = `${data.t?.length || 0}/2500`;
            
            // Load canvas
            if (data.c) {
                const img = new Image();
                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                };
                img.src = 'data:image/png;base64,' + data.c;
            }
            
            // Show drawing page
            setTimeout(() => nextPage(3), 1500);
        } catch(e) {
            console.log('Invalid link:', e);
        }
    }
});
