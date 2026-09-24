// ---------------------------------------------------------------------------
// pv-phaseWedgeExtension.js
// RR domain-specific behaviour for PhaseWedge objects
// ---------------------------------------------------------------------------

import { BaseExtension } from "../../../pv-baseExtension.js";

export class PhaseWedgeExtension extends BaseExtension {
    constructor({
        angle = 0,
        magnitude = 1,
        domain = "RR",
        color = 0xff0000
    } = {}) {
        super("phaseWedge");

        // Domain state
        this.angle = angle;
        this.magnitude = magnitude;
        this.domain = domain;
        this.color = color;
    }

    onAttach(object) {

        // -------------------------------------------------------------------
        // Add domain hints (merged automatically downstream)
        // -------------------------------------------------------------------
        object.addHintCategory("phaseWedge", {
            angle: this.angle,
            magnitude: this.magnitude,
            domain: this.domain,
            color: this.color
        });

        // -------------------------------------------------------------------
        // Glue: domain setters (update both local + hint state)
        // -------------------------------------------------------------------
        object.setAngle = (a) => {
            this.angle = a;
            object.hints.phaseWedge.angle = a;
        };

        object.setMagnitude = (m) => {
            this.magnitude = m;
            object.hints.phaseWedge.magnitude = m;
        };

        object.setDomain = (d) => {
            this.domain = d;
            object.hints.phaseWedge.domain = d;
        };

        object.setColor = (c) => {
            this.color = c;
            object.hints.phaseWedge.color = c;
        };

        // -------------------------------------------------------------------
        // Domain behaviour: phase evolution
        // -------------------------------------------------------------------
        object.updatePhase = (dt) => {
            // Example RR behaviour: angle evolves with magnitude
            this.angle += this.magnitude * dt * 0.001;

            // Update hint bag (merged automatically on emit)
            object.hints.phaseWedge.angle = this.angle;
        };

        // -------------------------------------------------------------------
        // Hook into update(dt) if present
        // -------------------------------------------------------------------
        if (typeof object.update === "function") {
            const originalUpdate = object.update;

            object.update = (dt) => {
                originalUpdate(dt);
                object.updatePhase(dt);
            };
        }
    }

    onDetach(object) {
        delete object.setAngle;
        delete object.setMagnitude;
        delete object.setDomain;
        delete object.setColor;
        delete object.updatePhase;

        delete object.hints.phaseWedge;
    }
}
