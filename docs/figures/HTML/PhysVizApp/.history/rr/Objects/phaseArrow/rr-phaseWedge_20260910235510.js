// rr-phaseWedge.js
import { PhaseIndicator } from "./rr-phaseIndicator.js";

export class PhaseWedge extends PhaseIndicator {
    constructor(id, params = {}) {
        super(id, "PhaseWedge", {
            visible: params.visible ?? true,
            color: params.color ?? 0xff2b2b,
            opacity: params.opacity ?? 0.5,
            trailEnabled: params.trailEnabled ?? true,
            trailFadeEnabled: params.trailFadeEnabled ?? true,
            fadeRate: params.fadeRate ?? 0.001,
            trailUseSourceOpacity: params.trailUseSourceOpacity ?? true,
            trailCycle: params.trailCycle ?? 0,
            phaseOffset: params.phaseOffset ?? 0,
        });

        this.pulseEnabled = params.pulseEnabled ?? false;
        this.pulseCyclesPerRevolution = params.pulseCyclesPerRevolution ?? 2;
        this.pulsePhaseOffset = params.pulsePhaseOffset ?? 0;
        this.pulseMinOpacity = params.pulseMinOpacity ?? 0.0;
        this.pulseMaxOpacity = params.pulseMaxOpacity ?? 1.0;

        this.centerX = params.centerX ?? 0.5;
        this.centerY = params.centerY ?? 0;
        this.qLevel = params.qLevel ?? -0.5;
        this.circleRadius = params.circleRadius ?? 1;

        this.theta = params.theta ?? this.phaseOffset;
        this.omega = params.omega ?? 0.1;   //radians per sec?

    }

    update(dtMs) {
        const dt = (dtMs || 0) / 1000;
        this.theta += this.omega * dt;
    }

getHints() {
    return {

        // identity
        "id": this.id,
        "type": this.type,

        // semantic (meaning, metadata, non-rendering)
        "semantic.visible": this.visible,
        "semantic.color": this.color,
        "semantic.opacity": this.opacity,

        "semantic.trailEnabled": this.trailEnabled,
        "semantic.trailFadeEnabled": this.trailFadeEnabled,
        "semantic.fadeRate": this.fadeRate,
        "semantic.trailUseSourceOpacity": this.trailUseSourceOpacity,
        "semantic.trailCycle": this.trailCycle,
        "semantic.trailFrames": this.trailFrames,

        "semantic.phase": this.phase,
        "semantic.phaseOffset": this.phaseOffset,

        "semantic.domainName": this.domainName,

        // transform (new section)
        "transform.position.x": 0,
        "transform.position.y": 0,
        "transform.position.z": 0,

        "transform.rotation.x": 0,
        "transform.rotation.y": 0,
        "transform.rotation.z": 0,

        "transform.scale.x": 1,
        "transform.scale.y": 1,
        "transform.scale.z": 1,

        // geometry (shape parameters)
        "geometry.width": 1.0,
        "geometry.height": 0.2,
        "geometry.depth": 0.1,
        "geometry.triangleType": "rightTriangle",
        "geometry.rightAngleCorner": "A",

        // renderer (material, visibility)
        "renderer.color": this.color,
        "renderer.opacity": this.opacity,
        "renderer.visible": this.visible
    };
}





}
