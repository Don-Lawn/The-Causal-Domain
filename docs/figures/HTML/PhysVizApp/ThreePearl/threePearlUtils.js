
    // Physics Z → Three.js Z
    export function _toThreeZ(physicsZ = 0) {
        return -physicsZ;
    }


    // Frustum update
    export function _updateOrthographicFrustum(width = this.canvas.clientWidth, height = this.canvas.clientHeight) {
        const safeWidth = Math.max(width || 1, 1);
        const safeHeight = Math.max(height || 1, 1);
        const aspect = safeWidth / safeHeight;

        this.camera.left = -this.orthoHalfHeight * aspect;
        this.camera.right = this.orthoHalfHeight * aspect;
        this.camera.top = this.orthoHalfHeight;
        this.camera.bottom = -this.orthoHalfHeight;
        this.camera.zoom = this.cameraZoom;
        this.camera.updateProjectionMatrix();

        this._updateAxisOverlayPosition();
    }