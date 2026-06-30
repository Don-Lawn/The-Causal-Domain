// ============================================================
// rr-test.js — Top-level orchestration (ES module)
// ============================================================
import { initPearl, createScene, createBox } from './rr-pearl.js';
import { createDomain } from './rr-domain.js';

// ------------------------------------------------------------
// 1. Grab canvas + panel elements
// ------------------------------------------------------------
const canvas = document.getElementById('rrCanvas');

const panelABC = document.getElementById('abcPanel');
const panelXYZ = document.getElementById('xyzPanel');
const panelABZ = document.getElementById('abzPanel');

// ------------------------------------------------------------
// 2. Initialize Pearl (renderer, camera, controls)
// ------------------------------------------------------------
const pearl = initPearl(canvas);

// ------------------------------------------------------------
// 3. Create three scenes (one per domain)
// ------------------------------------------------------------
const sceneABC = createScene();
const sceneXYZ = createScene();
const sceneABZ = createScene();

// ------------------------------------------------------------
// 4. Create domain groups + domains
// ------------------------------------------------------------
const ABC = createDomain(sceneABC, pearl.createDomainGroups());
const XYZ = createDomain(sceneXYZ, pearl.createDomainGroups());
const ABZ = createDomain(sceneABZ, pearl.createDomainGroups());

// ------------------------------------------------------------
// 5. Add test geometry
// ------------------------------------------------------------
function addTestCube(domain, color, x) {
    const cube = createBox(1, color);
    cube.position.x = x;
    domain.add(cube);
}

addTestCube(ABC, 0xff0000, -1);
addTestCube(XYZ, 0x00ff00, 0);
addTestCube(ABZ, 0x0000ff, 1);

// ------------------------------------------------------------
// 6. Main render loop
// ------------------------------------------------------------
function animate() {
    requestAnimationFrame(animate);

    const rectABC = panelABC.getBoundingClientRect();
    const rectXYZ = panelXYZ.getBoundingClientRect();
    const rectABZ = panelABZ.getBoundingClientRect();

    pearl.renderAll([
        { scene: sceneABC, rect: rectABC },
        { scene: sceneXYZ, rect: rectXYZ },
        { scene: sceneABZ, rect: rectABZ }
    ]);
}

animate();

// ------------------------------------------------------------
// 7. Resize handling
// ------------------------------------------------------------
window.addEventListener('resize', () => {
    pearl.resize(window.innerWidth, window.innerHeight);
});
