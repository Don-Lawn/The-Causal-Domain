// pv-cameraRenderer.js
import { RendererBase } from "./pv-rendererBase.js";
import { PVCamera } from "./pv-camera.js";

export class PVCameraRenderer extends RendererBase {

    getRenderHints(obj) {
        return {};   // camera has no renderer-specific hints
    }

    getGeometricHints(obj) {
        return {};   // camera has no geometry hints
    }

    ensureGeometry(handle, hints) {
        // camera has no geometry
    }

    animate(semanticObject, hints) {
        // Camera only moves when active
        if (hints["semantic.active"] !== true) {
            return;
        }

        // Apply camera transforms using semantic hints only
        this.pearl.applyCamera(hints);
    }
 
    getDefaultHints() {
        return { };
    }
}
