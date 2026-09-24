// simpleTest.js
// Minimal harness: one stationary PhaseWedge in ABC
import { BaseObject } from "../../../pv-baseObject.js";
import { MasterFSM } from "../../../pv-masterFSM.js";

import EventBusInstance from "../../../pv-eventBus.js";
import { RendererRegistry } from "../../../pv-rendererRegistry.js";
import { DomainObject } from "../../../pv-domainObject.js";

import { PhaseWedgeObject } from "../../../rr/Objects/phaseWedge/rr-phaseWedgeObject.js";
import { PhaseWedgeRendererExtension_ABC } from "../../../rr/Objects/phaseWedge/rr-phaseWedgeRendererExtension_ABC.js";

function run (){
    // Create MASTER first
    const master = MasterFSM();  

    const abc = DomainObject("ABC", "abcPanel", "abcCanvas", new RendererRegistry());
    // Register ABC renderer
    abc.registerRenderer("PhaseWedge", PhaseWedgeRendererExtension_ABC);


    // Create stationary wedge
    const wedge = PhaseWedgeObject("PrimaryFoE_ABC", abc, {
        angle: 0,
        magnitude: 1,
        color: 0xff2b2b
    });

    abc.addObject(wedge);

    window.addEventListener("resize", () => {
    EventBusInstance.emit("MASTER_RESIZE",{},"MASTER","rr-phaseArrow1.js");
}); 
}



// ------------------------------------------------------------
// 6. UI Buttons → Emit Master FSM events
// ------------------------------------------------------------
function handleMasterControlClick(event) {
    const btn = event.currentTarget;
    const eventName = btn.dataset.event;

    if (eventName === "START") {
        run();
    }

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
    A: "abcCanvas"
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
/* 

*/
