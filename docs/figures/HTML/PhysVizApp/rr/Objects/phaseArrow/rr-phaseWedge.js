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
            id: this.id,
            type: this.type,

            semantic: {
                visible: this.visible,
                color: this.color,
                opacity: this.opacity,

                trailEnabled: this.trailEnabled,
                trailFadeEnabled: this.trailFadeEnabled,
                fadeRate: this.fadeRate,
                trailUseSourceOpacity: this.trailUseSourceOpacity,
                trailCycle: this.trailCycle,
                trailFrames: this.trailFrames,

                phase: this.phase,
                phaseOffset: this.phaseOffset,

                domainName: this.domainName
            },

            geometric: {},
            render: {
                width: 1.0,
                height: 0.2,
                depth: 0.1,
                triangleType: "rightTriangle",
                rightAngleCorner:"A"
            },
        };
    }



}
