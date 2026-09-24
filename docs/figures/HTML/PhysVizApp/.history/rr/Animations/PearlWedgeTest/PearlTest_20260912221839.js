import {ThreePearlDispatch} from "../../../pv-threePearlDispatch.js";
import {RendererBase} from "../../../pv-rendererBase.js";
import {PhaseWedgeRenderer_ABC } from "../../Objects/phaseWedge/rr-phaseWedgeRenderer_ABC.js";
import { SemanticObject } from "../../../pv-object.js";
import { DebugPhaseWedge } from "../../../rr/Objects/phaseArrow/DebugPhaseWedge.js";

const canvas = document.getElementById("abcCanvas");

// 1. Create Pearl (scene, camera, renderer)
const pearl = new ThreePearlDispatch(canvas, null, {});

// 2. Create a renderer (this owns handles)
const renderer = new PhaseWedgeRenderer_ABC(null, pearl);

// 3. Fake semantic object
const semanticObject = new DebugPhaseWedge("myDPW", {});

// 5. Build geometry via renderer (which calls Pearl)
renderer.render(semanticObject, semanticObject.getSemanticHints());

// 6. Start Pearl’s render animation loop
startAnimationLoop(semanticObject, pearl);


function startAnimationLoop(semanticObject, pearl) {
    let lastTime = performance.now();

    function loop(now) {
        const dt = now - lastTime;
        lastTime = now;

        // --- Phase progression (no tempo yet) ---
        semanticObject.phase += dt * 0.001;  
        // 0.001 = radians per millisecond (slow, smooth)
        // You can adjust this constant later.

        // --- Render ---
        pearl.render(dt);

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

