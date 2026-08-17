import { SemanticObject } from "../../../pv-object.js";

/**
 * @typedef {Object} HintShape
 * @property {string} id
 * @property {string} title
 * @property {string} summary
 * @property {string} detail
 * @property {string} category
 * @property {Object<string, any>=} data
 */

export class PhaseIndicator extends SemanticObject {
    constructor(id, type, params = {}, hints = []) {
        super(id);

        this.id = id;
        this.type = type;

        /** @type {HintShape[]} */
        this.hints = hints;

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
        this.phaseOffset = params.phaseOffset ?? 0;
    }

    // ------------------------------------------------------------
    // Hint accessors
    // ------------------------------------------------------------

    /**
     * @returns {HintShape[]}
     */
    getHints() {
        return this.hints;
    }

    /**
     * @param {HintShape} hint
     */
    addHint(hint) {
        this.hints.push(hint);
    }

    /**
     * @param {string} category
     * @returns {HintShape[]}
     */
    getHintsByCategory(category) {
        return this.hints.filter(h => h.category === category);
    }

    // ------------------------------------------------------------
    // Domain attachment
    // ------------------------------------------------------------

    attachToDomain(domain) {
        super.attachToDomain(domain);
        this.domainName = domain?.name || null;
    }

    setColor(hex) {
        this.color = hex;
    }
}
