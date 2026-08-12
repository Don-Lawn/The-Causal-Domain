// rr/coneEllipse/rr-gravityWell.js
import { SemanticObject } from "../../../pv-object.js";

class RRGravityWell extends SemanticObject {
    constructor(id, params = {}) {
        super(id);
        this.id = id;
        this.type = "RRGravityWell";

        this.visible = params.visible ?? true;
        this.style = params.style ?? "wireframe"; // "wireframe" | "shaded"
        this.color = params.color ?? 0x4a90ff;
        this.opacity = params.opacity ?? 0.25;

        // z = -strength / r^2 sampled for r in [rMin, rMax]
        this.strength = params.strength ?? 1.0;
        this.circularityFactor = params.circularityFactor ?? 1.0;
        this.rMin = params.rMin ?? 0.35;
        this.rMax = params.rMax ?? 2.0;
        this.radialSamples = params.radialSamples ?? 160;
        this.segments = params.segments ?? 128;
        this.zFloor = params.zFloor ?? -4.0;
        this.xRotationDeg = params.xRotationDeg ?? 90;
    }

    update(dt) {
        return;
    }

    getRenderHints() {
        return Object.freeze({
            id: this.id,
            type: this.type,
            visible: this.visible,
            style: this.style,
            color: this.color,
            opacity: this.opacity,
            strength: this.strength,
            circularityFactor: this.circularityFactor,
            rMin: this.rMin,
            rMax: this.rMax,
            radialSamples: this.radialSamples,
            segments: this.segments,
            zFloor: this.zFloor,
            xRotationDeg: this.xRotationDeg
        });
    }
}

export { RRGravityWell };
