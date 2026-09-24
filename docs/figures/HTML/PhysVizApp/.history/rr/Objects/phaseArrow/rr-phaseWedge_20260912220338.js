// rr-phaseWedge.js
import { SemanticObject } from "./rr-Object.js";
import { HintHelper } from "./pv-HintHelper.js";

export class PhaseWedge extends SemanticObject {

    constructor(id, params = {}) {
        super(id, "PhaseWedge");

        this.id = id;

        // unified hint bag
        this.hints = {};

        // semantic/dynamic state
        this.phase = params.phase ?? 0;          // semantic phase
        this.qRotation = params.qRotation ?? 0;  // geometric rotation
        this.qRate = params.qRate ?? 0.1;        // rotation rate

        EventBus.on("LOAD_DEFAULTS", async () => {
            const defaults = await HintHelper.loadHints("defaults/phaseWedge.json");

            // unified hint bag: defaults + params
            this.hints = HintHelper.mergeHints(defaults, params);
        });
    }

    update(dtMs) {
        const dt = dtMs / 1000;

        // semantic update
        this.phase += this.qRate * dt;

        // geometric update
        this.qRotation += this.qRate * dt;

        // mutate unified hint bag
        this.hints["semantic.phase"] = this.phase;
        this.hints["transform.rotation.z"] = this.qRotation;
    }

    getHints() {
        return this.hints;
    }
}
