// pv-domain.js
import { PVFSM } from "./pv-fsm.js";
import { ThreePearl } from "./pv-threePearl.js";
import { ActiveEntity } from "./pv-activeEntity.js";

export class PVDomain extends ActiveEntity {
    constructor(name, panelName, canvasName, rendererRegistry) {
        super(name, "MASTER");
        this.configureDefaultLifecycle();

        this.name = name;

        const panelEl = document.getElementById(panelName);
        if (!panelEl) {
            throw new Error(`Panel '${panelName}' not found`);
        }
        this.myPanel = /** @type {HTMLElement} */ (panelEl);

        const canvasEl = document.getElementById(canvasName);
        if (!canvasEl) {
            throw new Error(`Canvas '${canvasName}' not found`);
        }
        this.myCanvas = /** @type {HTMLCanvasElement} */ (canvasEl);

        // SINGLE authoritative object store
        this.objects = new Map();

        this.registry = rendererRegistry;
        this.pearl = new ThreePearl(this.myCanvas, this /* domain*/);

        this.renderers = new Map(); // Map<semanticType, rendererInstance>
        for (const type of rendererRegistry.typesForDomain(this.name)) {
            const RendererClass = rendererRegistry.getClass(this.name, type);
            const renderer = new RendererClass(this, this.pearl);
            this.renderers.set(type, renderer);
        }


        this._setupFSM();
    }

    addObject(obj) {
        obj.attachToDomain (this);   
        this.objects.set(obj.id, obj);

        const renderer = this.getRenderer(obj.type);
        renderer.createHandle(obj);
    }


    removeObject(obj) {
        this.objects.delete(obj.id);
    }

    update(dt) {
        for (const obj of this.objects.values()) {
            if (obj.update) obj.update(dt);
        }
    }

    render(dt) {
        const phaseArrow = [...this.objects.values()].find((obj) => obj.type === "PhaseArrow");
        this.pearl.updateCamera(dt, phaseArrow);

        for (const obj of this.objects.values()) {
            const renderer = this.getRenderer(obj.type);

            // Domain fetches the hint
            const hints = obj.getRenderHints(dt);

           // Renderer consumes it
            renderer.render(obj, hints);
        }

        this.pearl.render();
    }

    getPanelRect () {        
        const canvasRect = this.myCanvas.getBoundingClientRect();
        const panelRect = this.myPanel.getBoundingClientRect();
        const rect = {
            x: panelRect.left - canvasRect.left,
            y: panelRect.top - canvasRect.top,
            width: panelRect.width,
            height: panelRect.height
        };
        return rect
    }
 

    resize() {
        const rect = this.myPanel.getBoundingClientRect();
        this.myCanvas.width = rect.width;
        this.myCanvas.height = rect.height;
    }

    _setupFSM() {
        this.fsm.on("UNINITIALISED", "INIT", () => {
            this.resize();
            this.fsm.transition("ACTIVE");
        });

        this.fsm.on("ACTIVE", "UPDATE", ({ dt }) => {
            this.update(dt);
        });

        this.fsm.on("ACTIVE", "RENDER", ({ dt }) => {
            this.render(dt);
        });

        this.fsm.on("ACTIVE", "RESIZE", () => {
            this.resize();
        });
    }

    getRenderer(semanticType) {
        return this.renderers.get(semanticType);
    }
}
