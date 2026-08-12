import { SemanticObject } from "../../../pv-object.js";

export class PhaseIndicator extends SemanticObject {
    constructor(id, type, params = {}) {
        super(id);

        this.id = id;
        this.type = type;

        this.visible = params.visible ?? true;
        this.color = params.color ?? 0xff0000;
        this.opacity = params.opacity ?? 1.0;

        this.trailEnabled = params.trailEnabled ?? false;
        this.trailFadeEnabled = params.trailFadeEnabled ?? false;
        this.fadeRate = params.fadeRate ?? 0.02;
        this.trailUseSourceOpacity = params.trailUseSourceOpacity ?? false;
        this.trailCycle = params.trailCycle ?? 0;
        this.trailFrames = params.trailFrames ?? 0;

        // Renderer handle lifecycle is managed by RendererBase.
        this._pvHandle = null;
        this.domainName = null;

        this.phase = params.phase ?? 0; 
        this.phaseOffset= params.phaseOffset ?? 0
    }

    attachToDomain(domain) {
        super.attachToDomain(domain);
        this.domainName = domain?.name || null;
    }

    setColor(hex) {
        this.color = hex;
    }
}