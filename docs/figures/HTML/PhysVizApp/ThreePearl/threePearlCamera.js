
 
 
 
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
        if (!hints?.active) return;

        const positionDelta = hints.positionDelta || { x: 0, y: 0, z: 0 };
        const targetZDelta  = hints.targetZDelta ?? 0;

        this.camera.position.x += positionDelta.x;
        this.camera.position.y += positionDelta.y;
        this.camera.position.z += this._toThreeZ(positionDelta.z + targetZDelta);

        this.controls.target.z += this._toThreeZ(targetZDelta);
    }
