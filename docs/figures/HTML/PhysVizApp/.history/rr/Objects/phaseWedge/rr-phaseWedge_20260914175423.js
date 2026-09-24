// rr-phaseWedge.js
import { SemanticObject } from "../../../pv-object.js";
import { HintHelper } from "../../../pv-HintHelper.js";
import  EventBusInstance  from "../../../pv-eventBus.js";

export class PhaseWedge extends SemanticObject {

    constructor(name, params = {}) {
        super(name, "PhaseWedge");

        this.name = name;

        // unified hint bag
        this.hints = {};

        // semantic/dynamic state
        this.phase = params.phase ?? 0;          // semantic phase
        this.qRotation = params.qRotation ?? 0;  // geometric rotation
        this.qRate = params.qRate ?? 0.1;        // rotation rate

        EventBusInstance.on("ABC","LOAD", async () => {
            const defaults = await HintHelper.loadHintsSync("../../../rr/Objects/phaseWedge/phaseWedge.json");

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

    _getHints() {
        this.hints["semantic.fsmState"] = this.fsm.getCurrentState();
        return this.hints;
    }
}
