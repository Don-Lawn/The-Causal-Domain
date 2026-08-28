// pv-camera.js
// Autonomous camera object with its own time-based FSM.
// Listens for CAMERA_LIFT / CAMERA_RESET events on the domain bus.
// The domain calls update(dt) each tick and reads getSemanticHints() to apply
// deltas to the pearl camera — completely decoupled from arrow phase.

import { SemanticObject } from "./pv-object.js";
import EventBusInstance from "./pv-eventBus.js";

export class PVCamera extends SemanticObject {
    constructor(id, params = {}) {
        super(id);
        this.id = id;
        this.type = "PVCamera";

        // How long the elevation arc takes (seconds), independent of any other animation.
        this.liftDuration  = params.liftDuration  ?? 10;
        this.liftTarget    = params.liftTarget    ?? Math.PI / 4; // radians
        this.cameraRadius  = params.cameraRadius  ?? 10;
        this.zFollowFactor = params.zFollowFactor ?? 0.5;

        // Optional reference to another semantic object whose Z position the
        // camera target should follow each frame.
        this.followObject  = null;

        // Internal state
        this._liftState       = "IDLE"; // IDLE | LIFTING | SETTLED
        this._liftElapsed     = 0;      // seconds since CAMERA_LIFT received
        this._previousTilt    = 0;      // radians — keeps frame-to-frame delta small
        this._previousFollowZ = 0;
        this._resetRequested  = false;

        this._positionDelta = { x: 0, y: 0, z: 0 };
        this._targetZDelta  = 0;
    }

    attachToDomain(domain) {
        super.attachToDomain(domain);

        EventBusInstance.on(domain.name, "CAMERA_LIFT", () => {
            if (this._liftState === "IDLE") {
                this._liftState   = "LIFTING";
                this._liftElapsed = 0;
            }
        });

        EventBusInstance.on(domain.name, "CAMERA_RESET", () => {
            this._doReset();
        });
    }


    /** Domain calls this after each loop reset to trigger pearl.resetCamera(). */
    consumeResetRequest() {
        const r = this._resetRequested;
        this._resetRequested = false;
        return r;
    }

    getSemanticHints() {
        const active =
            this._liftState === "LIFTING" ||
            Math.abs(this._positionDelta.x) > 0 ||
            Math.abs(this._positionDelta.y) > 0 ||
            Math.abs(this._positionDelta.z) > 0 ||
            Math.abs(this._targetZDelta) > 0;

        return Object.freeze({
            id:            this.id,
            type:          this.type,
            positionDelta: this._positionDelta,
            targetZDelta:  this._targetZDelta,
            active
        });
    }

    update(dtMs) {
        const dt = (dtMs || 0) / 1000;

        const previousTilt = this._previousTilt;
        let currentTilt    = previousTilt;

        if (this._liftState === "LIFTING") {
            this._liftElapsed += dt;
            const ratio = Math.min(1, this._liftElapsed / this.liftDuration);
            currentTilt = ratio * this.liftTarget;
            if (ratio >= 1) {
                this._liftState = "SETTLED";
            }
        }

        const prevOffset = this._tiltToOffset(previousTilt);
        const currOffset = this._tiltToOffset(currentTilt);

        this._positionDelta = {
            x: currOffset.x - prevOffset.x,
            y: currOffset.y - prevOffset.y,
            z: currOffset.z - prevOffset.z,
        };

        const currentFollowZ    = this.followObject?.z ?? 0;
        this._targetZDelta      = (currentFollowZ - this._previousFollowZ) * this.zFollowFactor;
        this._previousFollowZ   = currentFollowZ;
        this._previousTilt      = currentTilt;
    }
}
