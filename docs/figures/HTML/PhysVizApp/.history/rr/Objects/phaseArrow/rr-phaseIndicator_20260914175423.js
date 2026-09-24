import { SemanticObject } from "../../../pv-object.js";

export class PhaseIndicator extends SemanticObject {
    constructor(id, type = "PhaseIndicator", hints = {}) {
        super(id, type, hints);
        this.hints = { ...hints };
    }

    getSemanticHints() {
        return this.hints;
    }
}
