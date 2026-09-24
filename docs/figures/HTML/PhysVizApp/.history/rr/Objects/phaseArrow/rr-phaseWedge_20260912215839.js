// rr-phaseWedge.js
import { PhaseIndicator } from "./rr-phaseIndicator.js";
import { HintHelper } from "./pv-HintHelper.js";

export class PhaseWedge extends PhaseIndicator {

    constructor(id, params = {}) {
        super(id, "PhaseWedge");

        this.id = id;

        // unified hint bag (defaults + params + dynamic)
        this.hints = {};

        // semantic/dynamic state (kept as direct members)
        this.theta = params.theta ?? 0;
        this.omega = params.omega ?? 0.1;

        // load defaults when system starts
        EventBus.on("LOAD_DEFAULTS", async () => {
            const defaults = await HintHelper.loadHints("defaults/phaseWedge.json");

            // unified hint bag: defaults + params
            this.hints = HintHelper.mergeHints(defaults, params);
        });
    }

    update(dtMs) {
        const dt = dtMs / 1000;

        // dynamic semantic state
        this.theta += this.omega * dt;

        // mutate unified hint bag with dynamic values
        this.hints["semantic.phase"] = this.phase;
        this.hints["transform.rotation.z"] = this.theta;
    }

    // renderer consumes unified hint bag directly
    getHints() {
        return this.hints;
    }
}
