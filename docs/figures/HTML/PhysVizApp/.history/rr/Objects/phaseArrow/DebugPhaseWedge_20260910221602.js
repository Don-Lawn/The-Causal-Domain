

import { PhaseWedge } from "./rr-phaseWedge.js";

export class DebugPhaseWedge extends PhaseWedge {

    constructor(id, opts = {}) {
        super(id, opts);

        // Supply defaults if user didn’t specify them
        this.phase  = opts.phase  ?? Math.PI / 4;
        this.radius = opts.radius ?? 1;
        this.height = opts.height ?? 0.5;
        this.depth  = opts.depth  ?? 0.02;

        // Optional semantic fields
        this.opacity = opts.opacity ?? 1;
        this.visible = opts.visible ?? true;
        this.color   = opts.color   ?? 0xff0000;
        this.phaseOffset = opts.phaseOffset ?? 0;
        this.trailEnabled = opts.trailEnabled ?? false;
    }

   getSemanticHints() {
        return {
            semantic: {
                id: this.id,
                type: this.type,
                phase: this.phase,
                phaseOffset: this.phaseOffset,
                radius: this.radius,
                height: this.height,
                phaseOffset: this.phaseOffset,
                color: this.color,
                opacity: this.opacity,
                visible: this.visible,
                trailEnabled: this.trailEnabled
            },
            geometry: {
                radius: this.radius,
                height: this.height,
                depth: this.depth
            },
            transform: {
                position: this.position ?? [0,0,0],
                rotation: this.rotation ?? [0,0,0],
                scale: this.scale ?? [1,1,1]
            },
            renderer: {
                color: this.color ?? 0xff0000,
                opacity: this.opacity ?? 1
            }
        };
    }

}
