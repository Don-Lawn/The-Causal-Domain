// rr/coneEllipse/rr-causalPhaseArrow.js
import { SemanticObject } from "../../../pv-object.js";

class RRCausalPhaseArrow extends SemanticObject {
    constructor(id, params = {}) {
        super(id);
        this.id = id;
        this.type = "RRCausalPhaseArrow";

        this.visible = params.visible ?? true;
        this.color = params.color ?? 0xff2b2b;
        this.opacity = params.opacity ?? 0.5;
        this.trailEnabled = params.trailEnabled ?? true;
        this.trailFadeEnabled = params.trailFadeEnabled ?? true;
        this.fadeRate = params.fadeRate ?? 0.02;
        this.trailUseSourceOpacity = params.trailUseSourceOpacity ?? true;
        this.pulseEnabled = params.pulseEnabled ?? false;
        this.pulseCyclesPerRevolution = params.pulseCyclesPerRevolution ?? 2;
        this.pulsePhaseOffset = params.pulsePhaseOffset ?? 0;
        this.pulseMinOpacity = params.pulseMinOpacity ?? 0.0;
        this.pulseMaxOpacity = params.pulseMaxOpacity ?? 1.0;

        // Circle parallel to Wx/Wy at fixed Q depth.
        this.centerX = params.centerX ?? 0;
        this.centerY = params.centerY ?? 0;
        this.qLevel = params.qLevel ?? -0.5;
        this.circleRadius = params.circleRadius ?? 0.5;

        this.theta = params.theta ?? 0;
        this.omega = params.omega ?? 1.2; // rad/s
    }

    update(dtMs) {
        const dt = (dtMs || 0) / 1000;
        this.theta += this.omega * dt;
    }

    getRenderHints() {
        return Object.freeze({
            id: this.id,
            type: this.type,
            visible: this.visible,
            color: this.color,
            opacity: this.opacity,
            trailEnabled: this.trailEnabled,
            trailFadeEnabled: this.trailFadeEnabled,
            fadeRate: this.fadeRate,
            trailUseSourceOpacity: this.trailUseSourceOpacity,
            pulseEnabled: this.pulseEnabled,
            pulseCyclesPerRevolution: this.pulseCyclesPerRevolution,
            pulsePhaseOffset: this.pulsePhaseOffset,
            pulseMinOpacity: this.pulseMinOpacity,
            pulseMaxOpacity: this.pulseMaxOpacity,
            centerX: this.centerX,
            centerY: this.centerY,
            qLevel: this.qLevel,
            circleRadius: this.circleRadius,
            theta: this.theta
        });
    }
}

export { RRCausalPhaseArrow };
