// rr-phaseArrow1.js
// Top-level PV harness for the phase-arrow view.
// Wires together: EventBus, MasterFSM, Domains, Renderers, UI controls, logging.

import EventBusInstance from "./pv-eventBus.js";
import { MasterFSM } from "./pv-masterFSM.js";
import { PVLogMonitor } from "./pv-logMonitor.js";
import { PVDomain } from "./pv-domain.js";
import { RendererRegistry } from "./pv-rendererRegistry.js";

import { PhaseArrow } from "./rr/phaseArrow/rr-phaseArrow.js";
import { PhaseArrowRenderer_ABC } from "./rr/phaseArrow/rr-phaseArrowRenderer_ABC.js";
import { PhaseArrowRenderer_XYZ } from "./rr/phaseArrow/rr-phaseArrowRenderer_XYZ.js";
import { PhaseArrowRenderer_ABZ } from "./rr/phaseArrow/rr-phaseArrowRenderer_ABZ.js";

debugger;

// ------------------------------------------------------------
// 1. Logging monitor
// ------------------------------------------------------------
//const logMonitor = new PVLogMonitor("eventLogPanel", 50);
//EventBusInstance.addMonitor(logMonitor);

// ------------------------------------------------------------
// 2. Master FSM
// ------------------------------------------------------------
const master = new MasterFSM();

// ------------------------------------------------------------
// 3. Renderer registry
// ------------------------------------------------------------
const registry = new RendererRegistry();
registry.register("ABC", "PhaseArrow", PhaseArrowRenderer_ABC);
registry.register("XYZ", "PhaseArrow", PhaseArrowRenderer_XYZ);
registry.register("ABZ", "PhaseArrow", PhaseArrowRenderer_ABZ);

// ------------------------------------------------------------
// 4. Domains
// ------------------------------------------------------------
const abc = new PVDomain("ABC", "abcPanel", "abcCanvas", registry);
const xyz = new PVDomain("XYZ", "xyzPanel", "xyzCanvas", registry);
const abz = new PVDomain("ABZ", "abzPanel", "abzCanvas", registry);

// ------------------------------------------------------------
// 5. Semantic objects
// ------------------------------------------------------------
const arrowABC = new PhaseArrow("ArrowABC");
const arrowXYZ = new PhaseArrow("ArrowXYZ");
const arrowABZ = new PhaseArrow("ArrowABZ");

abc.addObject(arrowABC);
xyz.addObject(arrowXYZ);
abz.addObject(arrowABZ);


EventBusInstance.emit("LOAD", {}, "MASTER", "rr-phaseArrow1.js");
EventBusInstance.emit("START", {}, "MASTER", "rr-phaseArrow1.js");
// ------------------------------------------------------------
// 6. UI Buttons → Emit Master FSM events
// ------------------------------------------------------------
function handleMasterControlClick(event) {
    const btn = event.currentTarget;
    const eventName = btn.dataset.event;

    EventBusInstance.emit(eventName, 
        {payload: { source: "UI" }},
        "MASTER",
        "UI"
    );
}

const masterControls = document.querySelectorAll("#masterControls button");
masterControls.forEach(btn => {
    btn.addEventListener("click", handleMasterControlClick);
});

// ------------------------------------------------------------
// 7. Manual event injector
// ------------------------------------------------------------
const injectBtn = document.getElementById("injectBtn");
const injectInput = /** @type {HTMLInputElement | null} */ (document.getElementById("injectEvent"));

if (injectBtn && injectInput) {
    injectBtn.addEventListener("click", () => {
        const evt = injectInput.value.trim();
        if (evt) {
            EventBusInstance.emit(evt, {
                payload: { source: "manual" }
            });
        }
    });
}

// ------------------------------------------------------------
// 8. Copy-to-graphic helpers for the domain canvases
// ------------------------------------------------------------
const copyCanvasMap = {
    A: "abcCanvas",
    B: "xyzCanvas",
    C: "abzCanvas"
};

async function copyCanvasToClipboard(canvasId) {
    const canvas = /** @type {HTMLCanvasElement | null} */ (document.getElementById(canvasId));
    if (!canvas) {
        return;
    }

    const blob = await new Promise(resolve => {
        /** @type {HTMLCanvasElement} */ (canvas).toBlob(resolve, "image/png");
    });

    if (!blob) {
        return;
    }

    if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
        ]);
    } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${canvasId}.png`;
        link.click();
        URL.revokeObjectURL(url);
    }
}

document.querySelectorAll(".copyBtn").forEach(btn => {
    /** @type {HTMLButtonElement} */ (btn).addEventListener("click", async () => {
        const domainLetter = /** @type {HTMLButtonElement} */ (btn).dataset.domain;
        const canvasId = copyCanvasMap[domainLetter];
        if (!canvasId) {
            return;
        }

        const shouldResumeAfterCopy = master?.fsm?.state === "ACTIVE";

        EventBusInstance.emit("PAUSE", {}, "MASTER", "UI");
        requestAnimationFrame(async () => {
            await copyCanvasToClipboard(canvasId);
            if (shouldResumeAfterCopy) {
                EventBusInstance.emit("RESUME", {}, "MASTER", "UI");
            }
        });
    });
});

// ------------------------------------------------------------
// 9. Resize handling
// ------------------------------------------------------------
window.addEventListener("resize", () => {
    EventBusInstance.emit("MASTER_RESIZE",{},"MASTER","rr-phaseArrow1.js");
});
