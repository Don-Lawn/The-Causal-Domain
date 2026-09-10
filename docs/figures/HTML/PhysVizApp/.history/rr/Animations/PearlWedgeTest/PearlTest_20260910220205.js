import {ThreePearlDispatch} from "../../../pv-threePearlDispatch.js";
import {RendererBase} from "../../../pv-rendererBase.js";
import {PhaseWedgeRenderer_ABC } from "../../../rr/Objects/phaseArrow/rr-phaseWedgeRenderer_ABC.js";
import { SemanticObject } from "../../../pv-object.js";
import { PhaseWedge } from "../../../rr/Objects/phaseArrow/PhaseWedge.js";

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
startAnimationLoop(pearl);


function startAnimationLoop(pearl) {
    let lastTime = performance.now();

    function loop(now) {
        const dt = now - lastTime;
        lastTime = now;

        // In mainline: bus.emit("TICK", { dt })
        // In mainline: bus.emit("RENDER", { dt })

        pearl.render(dt);

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}
