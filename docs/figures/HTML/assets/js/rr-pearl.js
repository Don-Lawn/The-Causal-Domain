// ============================================================
// rr-pearl.js — Rendering Engine Wrapper (ES module)
// ============================================================

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// ------------------------------------------------------------
// Create a new scene (Pearl owns scene creation)
// ------------------------------------------------------------
export function createScene() {
    return new THREE.Scene();
}

// ------------------------------------------------------------
// Create RR domain groups (root + content)
// ------------------------------------------------------------
export function createDomainGroups() {
    const root = new THREE.Group();
    const content = new THREE.Group();
    root.add(content);
    return { root, content };
}

// ------------------------------------------------------------
// Initialize Pearl (renderer, camera, controls)
// ------------------------------------------------------------
export function initPearl(canvas) {

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setScissorTest(true);

    // Camera
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(4, 4, 6);

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    // Render one scene into one rectangle
    function renderSceneToRect(scene, rect) {
        const { x, y, width, height } = rect;

        renderer.setViewport(x, y, width, height);
        renderer.setScissor(x, y, width, height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.render(scene, camera);
    }

    // Render all scenes (multi-viewport)
    function renderAll(sceneList) {
        controls.update();
        for (const entry of sceneList) {
            renderSceneToRect(entry.scene, entry.rect);
        }
    }

    // Resize handling
    function resize(w, h) {
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    return {
        renderer,
        camera,
        controls,
        renderAll,
        resize,
        createDomainGroups
    };
}
export function createBox(size = 1, color = 0xffffff) {
    const geo = new THREE.BoxGeometry(size, size, size);
    const mat = new THREE.MeshBasicMaterial({ color });
    return new THREE.Mesh(geo, mat);
}