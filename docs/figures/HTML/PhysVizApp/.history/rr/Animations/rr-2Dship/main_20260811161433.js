import EventBusInstance from "../../../pv-eventBus.js";
import { MasterFSM } from "../../../pv-masterFSM.js";
import { PVDomain } from "../../../pv-domain.js";
import { RendererRegistry } from "../../../pv-rendererRegistry.js";

import { RR2DShip } from "./rr-2Dship.js";
import { RR2DShipRenderer_TOP } from "./rr-2DshipRenderer_TOP.js";
import { RR2DShipRenderer_ZQ } from "./rr-2DshipRenderer_ZQ.js";

const master = new MasterFSM();

const registry = new RendererRegistry();
registry.register("VQTOP", "RR2DShip", RR2DShipRenderer_TOP);
registry.register("ZQVIEW", "RR2DShip", RR2DShipRenderer_ZQ);

const vqTop = new PVDomain("VQTOP", "topPanel", "topCanvas", registry);
const zqView = new PVDomain("ZQVIEW", "bottomPanel", "bottomCanvas", registry);

const shipTop = new RR2DShip("ShipTop");
const shipBottom = new RR2DShip("ShipBottom");

vqTop.addObject(shipTop);
zqView.addObject(shipBottom);

EventBusInstance.emit("LOAD", {}, "MASTER", "rr-2Dship/main.js");
EventBusInstance.emit("START", {}, "MASTER", "rr-2Dship/main.js");

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
    EventBusInstance.emit("MASTER_RESIZE", {}, "MASTER", "rr-2Dship/main.js");
});
