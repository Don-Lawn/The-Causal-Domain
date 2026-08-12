// rr/coneEllipse/rr-coneEllipse.js
import { SemanticObject } from "../../../pv-object.js";
import { registerAnimation3 } from "./rr-coneEllipseAnimation3.js";

class RRConeEllipse extends SemanticObject {
    constructor(id, params = {}) {
        super(id);
        this.id = id;
        this.type = "RRConeEllipse";
        this.visible = true;
        this.color = 0xffffff;
        this.animation3 = registerAnimation3(params);
    }

    update(dt) {
        this.animation3.update(dt);
    }

    setAnimation3Params(overrides = {}) {
        this.animation3.setParams(overrides);
    }

    getAnimation3Controller() {
        return this.animation3;
    }

    getRenderHints() {
        const state = this.animation3.state;
        return Object.freeze({
            id: this.id,
            type: this.type,
            visible: this.visible,
            cone: state.cone,
            ellipse: state.ellipse,
            marker: state.marker,
            R: state.R,
            H: state.H,
            Z0: state.Z0,
            k: state.k,
            omega: state.omega
        });
    }
}

export { RRConeEllipse };
