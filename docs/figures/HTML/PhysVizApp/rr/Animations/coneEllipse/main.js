import EventBusInstance from "../../../pv-eventBus.js";
import { MasterFSM } from "../../../pv-masterFSM.js";
import { PVDomain } from "../../../pv-domain.js";
import { RendererRegistry } from "../../../pv-rendererRegistry.js";

import { RRConeEllipse } from "./rr-coneEllipse.js";
import { RRConeEllipseRenderer } from "./rr-coneEllipseRenderer.js";
import { RRGravityWell } from "./rr-gravityWell.js";
import { RRGravityWellRenderer } from "./rr-gravityWellRenderer.js";
import { RRCausalPhaseArrowRenderer } from "./rr-causalPhaseArrowRenderer.js";
import { PhaseWedge } from "../../phaseArrow/rr-phaseWedge.js";

const master = new MasterFSM();

const registry = new RendererRegistry();
registry.register("VQTOP", "RRConeEllipse", RRConeEllipseRenderer);
registry.register("ZQVIEW", "RRConeEllipse", RRConeEllipseRenderer);
registry.register("VQTOP", "RRGravityWell", RRGravityWellRenderer);
registry.register("ZQVIEW", "RRGravityWell", RRGravityWellRenderer);
registry.register("VQTOP", "PhaseWedge", RRCausalPhaseArrowRenderer);

const vqTop = new PVDomain("VQTOP", "topPanel", "topCanvas", registry);
const zqView = new PVDomain("ZQVIEW", "bottomPanel", "bottomCanvas", registry);

const coneTop = new RRConeEllipse("ConeTop");
//const coneBottom = new RRConeEllipse("ConeBottom");
const phaseArrowTop = new PhaseWedge("PhaseArrowTop", {
    color: 0xff2b2b,
    opacity: 0.5,
    pulseEnabled: true,
    pulseCyclesPerRevolution: 2,
    pulsePhaseOffset: 0,
    pulseMinOpacity: 0.0,
    pulseMaxOpacity: 1.0,
    trailFadeEnabled: true,
    fadeRate: 0.0025,
    centerX: 0,
    centerY: 0,
    qLevel: 0.5,
    circleRadius: 0.5,
    omega: 1.4
});
const phaseArrowTopGreen = new PhaseWedge("PhaseArrowTopGreen", {
    color: 0x22cc55,
    opacity: 0.5,
    pulseEnabled: true,
    pulseCyclesPerRevolution: 2,
    pulsePhaseOffset: Math.PI / 2,
    pulseMinOpacity: 0.0,
    pulseMaxOpacity: 1.0,
    trailFadeEnabled: true,
    fadeRate: 0.0025,
    centerX: 0,
    centerY: 0,
    qLevel: 0.5,
    circleRadius: 0.5,
    omega: 1.4,
    theta: Math.PI / 2
});
const gravityWellBottom = new RRGravityWell("GravityWellBottom", {
    style: "wireframe",
    color: 0x4a90ff,
    opacity: 0.25,
    xRotationDeg: 90,
    strength: 1,
    circularityFactor: 0.72,
    rMin: 0.35,
    rMax: 2.0,
    radialSamples: 32,
    segments: 26,
    zFloor: -4.0
});

vqTop.addObject(coneTop);
vqTop.addObject(phaseArrowTop);
vqTop.addObject(phaseArrowTopGreen);
zqView.addObject(gravityWellBottom);
//zqView.addObject(coneBottom);

EventBusInstance.emit("LOAD", {}, "MASTER", "rr-coneEllipse/main.js");
EventBusInstance.emit("START", {}, "MASTER", "rr-coneEllipse/main.js");

function handleMasterControlClick(event) {
    const btn = event.currentTarget;
    const eventName = btn.dataset.event;

    EventBusInstance.emit(
        eventName,
        { payload: { source: "UI" } },
        "MASTER",
        "UI"
    );
}

document.querySelectorAll("#masterControls button").forEach((btn) => {
    btn.addEventListener("click", handleMasterControlClick);
});

const copyCanvasMap = {
    A: "topCanvas",
    B: "bottomCanvas",
    C: "bottomCanvas"
};

async function copyCanvasToClipboard(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        return;
    }

    const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
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

document.querySelectorAll(".copyBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
        const domainLetter = btn.dataset.domain;
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

window.addEventListener("resize", () => {
    EventBusInstance.emit("MASTER_RESIZE", {}, "MASTER", "rr-coneEllipse/main.js");
});
