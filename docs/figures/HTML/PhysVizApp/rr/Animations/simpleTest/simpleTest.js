// simpleTest.js
// Minimal harness: one stationary PhaseWedge in ABC
import { DomainObject } from "../../../pv-domainObject.js";

import { PhaseWedgeObject } from "../../../rr/Objects/phaseWedge/rr-phaseWedgeObject.js";
import { PhaseWedgeRendererExtension_ABC } from "../../../rr/Objects/phaseWedge/rr-phaseWedgeRendererExtension_ABC.js";
import { BusExtension } from "../../../pv-BusExtension.js";

import { PVLogMonitor } from "../../../pv-LogMonitor.js";
import EventBusInstance from "../../../pv-eventBus.js";
import { createObject } from "../../../pv-createObject.js";
import { BaseObject } from "../../../pv-baseObject.js";
import { MasterFSM } from "../../../pv-masterFSM.js";
import { RendererRegistry } from "../../../pv-rendererRegistry.js";
import { RendererExtension } from "../../../pv-rendererExtension.js";
import { FSMExtension } from "../../../pv-FSMExtension.js";
import { HintExtension } from "../../../pv-HintExtension.js";
import { DomainExtension } from "../../../pv-domainExtension.js";
import { DomainObjectRegistryExtension } from "../../../pv-domainObjectRegistryExtension.js";
import { DomainRendererRegistryExtension } from "../../../pv-domainRendererRegistryExtension.js";
import { DomainCanvasExtension } from "../../../pv-domainCanvasExtension.js";

debugger;
    
export function createSimpleTest (){
    // Create MASTER first
    const master = MasterFSM();  

    const monitor = new PVLogMonitor("eventLogPanel", 20);
    EventBusInstance.addMonitor(monitor);


    // Register ABC renderer
    const abc = createObject({name:"ABC", type:"domain",
        hints: new HintExtension({ initialHints: {} }),
        bus: new BusExtension({
                localBusName:"ABC-bus", 
                parentBusName:"MASTERBUS"}),
        fsm: new FSMExtension({
                fsmName:"MASTERFSM", 
                busName:"ABC-bus" }),
        domain: new DomainExtension    ({
                domainName: "ABC-domain",
                domainVersion:1,
                metadata: {}  }),      
        renderer: new RendererExtension(),
        objectRegistry: new DomainObjectRegistryExtension(),
        rendererRegistry: new DomainRendererRegistryExtension(),
        canvas: new DomainCanvasExtension({
                panelId: "abcPanel",
                canvasId: "abcCanvas"
                })
    });

    abc.registerRenderer("PhaseWedge", PhaseWedgeRendererExtension_ABC);


    // Create stationary wedge
    const wedge = PhaseWedgeObject("PrimaryFoE_ABC", abc, {
        angle: 0,
        magnitude: 1,
        color: 0xff2b2b
    });

    abc.addObject(wedge);

    window.addEventListener("resize", () => {
    EventBusInstance.emit("MASTER_RESIZE",{},"MASTERBUS","rr-phaseArrow1.js");

    
    master.emit("LOAD")
    master.emit("START");
}); 
}



// ------------------------------------------------------------
// 6. UI Buttons → Emit Master FSM events
// ------------------------------------------------------------
function handleMasterControlClick(event) {
    const btn = event.currentTarget;
    const eventName = btn.dataset.event;

    if (eventName === "START") {
        createSimpleTest();
    }

    EventBusInstance.emit(eventName, 
        {payload: { source: "UI" }},
        "MASTERBUS",
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

        EventBusInstance.emit("PAUSE", {}, "MASTERBUS", "UI");
        requestAnimationFrame(async () => {
            await copyCanvasToClipboard(canvasId);
            if (shouldResumeAfterCopy) {
                EventBusInstance.emit("RESUME", {}, "MASTERBUS", "UI");
            }
        });
    });
});

// ------------------------------------------------------------
// 9. Resize handling
// ------------------------------------------------------------
/* 

*/


createSimpleTest();