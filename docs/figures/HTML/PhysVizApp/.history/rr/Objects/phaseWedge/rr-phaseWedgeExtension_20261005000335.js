// ---------------------------------------------------------------------------
// pv-phaseWedgeExtension.js
// RR domain-specific behaviour for PhaseWedge objects
// ---------------------------------------------------------------------------

import { BaseExtension } from "../../../pv-baseExtension.js";
import EventBusInstance from "../../../pv-eventBus.js";

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

    onAttach(wedgeObject) {

        // -------------------------------------------------------------------
        // Add domain hints (merged automatically downstream)
        // -------------------------------------------------------------------
        wedgeObject.setHint("phaseWedge.angle", this.angle);
        wedgeObject.setHint("phaseWedge.magnitude", this.magnitude);
        wedgeObject.setHint("phaseWedge.domain", this.domain);
        wedgeObject.setHint("phaseWedge.color", this.color);

        // -------------------------------------------------------------------
        // Glue: domain setters (update both local + hint state)
        // -------------------------------------------------------------------
        wedgeObject.setAngle = (a) => {
            this.angle = a;
            wedgeObject.setHint("phaseWedge.angle", a);
        };

        wedgeObject.setMagnitude = (m) => {
            this.magnitude = m;
            wedgeObject.setHint("phaseWedge.magnitude", m);
        };

        wedgeObject.setDomain = (d) => {
            this.domain = d;
            wedgeObject.setHint("phaseWedge.domain", d);
        };

        wedgeObject.setColor = (c) => {
            this.color = c;
            wedgeObject.setHint("phaseWedge.color", c);
        };
        // -------------------------------------------------------------------
        // Domain behaviour: phase evolution
        // -------------------------------------------------------------------
        wedgeObject.updatePhase = (evt) => {
            // Example RR behaviour: angle evolves with magnitude
            const dt = evt.payload?.deltaTimeSeconds ?? 0;
            this.angle += this.magnitude * dt * 0.001;

            // Update hint bag (merged automatically on emit)
            wedgeObject.setHint("phaseWedge.angle", this.angle);
        };

        // -------------------------------------------------------    ------------
        EventBusInstance.on(
            wedgeObject.busName,    
            "UPDATE",
            (evt) => {
                wedgeObject.updatePhase(evt);
            }
        );
    }

    onDetach(wedgeObject) {
        delete wedgeObject.setAngle;
        delete wedgeObject.setMagnitude;
        delete wedgeObject.setDomain;
        delete wedgeObject.setColor;
        delete wedgeObject.updatePhase;
        delete wedgeObject.hints.phaseWedge;
    }
}
