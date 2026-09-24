
 
    import { HintHelper } from "../pv-HintHelper.js";
 
 
    export function resetCamera() {
        if (!this.initialCameraState) return;

        this.camera.position.copy(this.initialCameraState.position);
        this.camera.up.copy(this.initialCameraState.up);
        this.camera.zoom = this.initialCameraState.zoom;
        this.camera.updateProjectionMatrix();

        if (this.controls) {
            this.controls.target.copy(this.initialCameraState.target);
            this.controls.update();
        }

        this._updateAxisOverlayPosition();
    }

    /** Point the camera at a semantic object and follow its Z drift each frame. */
    export function setFollowObject(obj) {
        this.followObject     = obj;
        this._previousFollowZ = obj?.z ?? 0;
    }

    export function _tiltToOffset(tilt) {
        return {
            x: Math.sin(tilt) * this.cameraRadius,
            y: Math.sin(tilt) * this.cameraRadius * 0.35,
            z: Math.cos(tilt) * this.cameraRadius,
        };
    }

    export function _doReset() {
        this._liftState       = "IDLE";
        this._liftElapsed     = 0;
        this._previousTilt    = 0;
        this._positionDelta   = { x: 0, y: 0, z: 0 };
        this._targetZDelta    = 0;
        this._resetRequested  = true;
        if (this.followObject) {
            this._previousFollowZ = this.followObject.z ?? 0;
        }
    }



    export function applyCamera(hints) {
        if (HintHelper.consume(hints, "semantic.active") !== true) return;

        const dx = HintHelper.consume(hints, "camera.positionDelta.x", 0);
        const dy = HintHelper.consume(hints, "camera.positionDelta.y", 0);
        const dz = HintHelper.consume(hints, "camera.positionDelta.z", 0);
        const tz = HintHelper.consume(hints, "camera.targetZDelta", 0);

        this.camera.position.x += dx;
        this.camera.position.y += dy;
        this.camera.position.z += this._toThreeZ(dz + tz);

        this.controls.target.z += this._toThreeZ(tz);
    }

