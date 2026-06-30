// rr-core.js
// Shared utilities, billboards, textures, timing, layout for RR triad
import * as THREE from 'three';

// ===== PALETTE =====
export const RRPalette = {
    causal: 0xC8A2FF,       // lavender
    phenomenal: 0x8A2BE2,   // violet
    hybrid: 0xA060FF,       // blend
    background: 0x111111,   // page background
    border: 0x5533AA        // frame border
};

// ===== LAYOUT CONSTANTS =====
export const A4_ASPECT = 297 / 210; // landscape A4 ratio

export const RRLayout = {
    abcPos: { x: -2.5, y: 1.5, z: 0 },
    xyzPos: { x:  2.5, y: 1.5, z: 0 },
    abzPos: { x:  0.0, y: -1.5, z: 0 },
    panelSize: { wTop: 3.0, hTop: 2.0, wBottom: 4.0, hBottom: 2.5 }
};

// ===== TIMING HELPERS =====
export function makeClock() {
    const clock = new THREE.Clock();
    return {
        clock,
        elapsed: 0,
        dt: 0,
        update() {
            this.dt = this.clock.getDelta();
            this.elapsed += this.dt;
        }
    };
}

export function phase(time, speed) {
    return time * speed;
}

export function lerp(a, b, t) {
    return a + (b - a) * t;
}

// ===== BILLBOARD FACTORY =====
export function makeBillboard({ texture, color, width, height, opacity }) {
    const material = new THREE.MeshBasicMaterial({
        map: texture || null,
        color: color !== undefined ? color : 0xffffff,
        transparent: true,
        opacity: opacity !== undefined ? opacity : 0.12,
        depthWrite: false
    });

    const geometry = new THREE.PlaneGeometry(width, height);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.isBillboard = true;
    return mesh;
}

export function updateBillboards(scene, camera) {
    scene.traverse(obj => {
        if (obj.userData && obj.userData.isBillboard) {
            obj.lookAt(camera.position);
        }
    });
}

// ===== TEXTURE GENERATORS =====
// All textures are small canvases, tiled by Three.js

function makeCanvasTexture(drawFn, size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    drawFn(ctx, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
}

// --- Radial phase texture for abc ---
export function makeRadialTexture(colorHex) {
    return makeCanvasTexture((ctx, size) => {
        const cx = size / 2;
        const cy = size / 2;
        const maxR = size / 2;
        const color = `#${colorHex.toString(16).padStart(6, '0')}`;

        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, size, size);

        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.15;
        ctx.lineWidth = 1;

        for (let r = maxR; r > 0; r -= 8) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
        }

        // faint spiral hint
        ctx.globalAlpha = 0.08;
        ctx.beginPath();
        let angle = 0;
        let radius = 0;
        while (radius < maxR) {
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            if (radius === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            angle += 0.15;
            radius += 0.5;
        }
        ctx.stroke();
    });
}

// --- Grid texture for xyz ---
export function makeGridTexture(colorHex) {
    return makeCanvasTexture((ctx, size) => {
        const color = `#${colorHex.toString(16).padStart(6, '0')}`;

        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, size, size);

        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.12;
        ctx.lineWidth = 1;

        const step = 16;
        for (let x = 0; x <= size; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, size);
            ctx.stroke();
        }
        for (let y = 0; y <= size; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(size, y);
            ctx.stroke();
        }
    });
}

// --- Twin-slit interference texture for abz (slightly curved fringes) ---
export function makeTwinSlitTexture(colorHex) {
    return makeCanvasTexture((ctx, size) => {
        const color = `#${colorHex.toString(16).padStart(6, '0')}`;

        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, size, size);

        ctx.globalAlpha = 0.14;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;

        const fringes = 18;
        const amplitude = size * 0.06;
        const phaseStep = (Math.PI * 2) / fringes;

        for (let i = 0; i < fringes; i++) {
            const phase0 = i * phaseStep;
            ctx.beginPath();
            for (let x = 0; x <= size; x += 4) {
                const t = x / size;
                const yCenter = size * (0.2 + 0.6 * t); // diagonal drift
                const yOffset = Math.sin(phase0 + t * Math.PI * 2) * amplitude;
                const y = yCenter + yOffset;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    });
}

// ===== SCENE HELPERS =====
export function setupRendererAndCamera(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setClearColor(RRPalette.background, 1.0);

    const camera = new THREE.PerspectiveCamera(
        45,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        100
    );
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    return { renderer, camera };
}

export function resizeRendererToDisplaySize(renderer, camera) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

// ===== AXIS GLYPH PLACEHOLDER (for later) =====
export function makeAxisGlyph(labels, colorHex) {
    const group = new THREE.Group();
    // You can add text sprites or small arrows later.
    group.userData.isAxisGlyph = true;
    group.userData.labels = labels;
    group.userData.color = colorHex;
    return group;
}
