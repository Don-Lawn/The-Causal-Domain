// pv-threePearlDispatch.js
import { ThreePearl } from "./pv-threePearl.js";
import { HintHelper } from "./pv-HintHelper.js";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export class ThreePearlDispatch extends ThreePearl {

    constructor(canvas, domain, callerHints = {}) {

        // Pearl must initialise its engine state first.
        super(canvas, domain);

        // ------------------------------------------------------------
        // Build default engine-derived hints (camera, axis overlay)
        // ------------------------------------------------------------
        this.defaultEngineHints = {
            render: {
                orthoHalfHeight: this.orthoHalfHeight,
                camera: {
                    type: "orthographic",
                    zoom: this.cameraZoom,
                    position: {
                        x: this.camera.position.x,
                        y: this.camera.position.y,
                        z: this.camera.position.z
                    },
                    up: {
                        x: this.camera.up.x,
                        y: this.camera.up.y,
                        z: this.camera.up.z
                    },
                    lookAt: { x: 0, y: 0, z: 0 }
                },
                axisOverlay: {
                    length: this.axisOverlayLength,
                    margin: this.axisOverlayMargin,
                    labels: ["X", "Y", "Z"]
                }
            }
        };

        // ------------------------------------------------------------
        // Build dispatch table (auto‑wrap setX(handle,hints) methods)
        // ------------------------------------------------------------
        this.hintDispatch = HintHelper.buildHintDispatch(this);
    }


    // ------------------------------------------------------------
    // Camera Factory (used only when renderer explicitly requests)
    // ------------------------------------------------------------
    _createCameraFromHints(camHints) {
        const type = (camHints.type || "orthographic").toLowerCase();

        if (type === "perspective") {
            const fov    = camHints.fov    ?? 45;
            const aspect = camHints.aspect ?? 1.0;
            const near   = camHints.near   ?? 0.1;
            const far    = camHints.far    ?? 1000;
            return new THREE.PerspectiveCamera(fov, aspect, near, far);
        }

        // Default: orthographic
        const halfH = camHints.orthoHalfHeight ?? 2.5;
        const near  = camHints.near ?? 0.1;
        const far   = camHints.far  ?? 1000;

        return new THREE.OrthographicCamera(
            -halfH, halfH,
             halfH, -halfH,
             near, far
        );
    }


    // ------------------------------------------------------------
    // Hint‑driven setters
    // ------------------------------------------------------------
    setCameraPosition(handle, hints) {
        const p = hints.render.camera.position;
        if (p) this.camera.position.set(p.x, p.y, p.z);
    }

    setCameraUp(handle, hints) {
        const u = hints.render.camera.up;
        if (u) this.camera.up.set(u.x, u.y, u.z);
    }

    setCameraLookAt(handle, hints) {
        const t = hints.render.camera.lookAt;
        if (t) this.camera.lookAt(t.x, t.y, t.z);
    }

    setCameraZoom(handle, hints) {
        const z = hints.render.camera.zoom;
        if (typeof z === "number") {
            this.camera.zoom = z;
            this.camera.updateProjectionMatrix();
        }
    }
    
    setPositionX(handle, hints) {
        handle.impl.position.x = hints.transform.position.x;
    }
    
    setPositionY(handle, hints) {
        handle.impl.position.y = hints.transform.position.y;
    }
    
    setPositionZ(handle, hints) {
        handle.impl.position.z = hints.transform.position.z;
    }
    
    setRotationX(handle, hints) {
        handle.impl.rotation.x = hints.transform.rotation.x;
    }
    
    setRotationY(handle, hints) {
        handle.impl.rotation.y = hints.transform.rotation.y;
    }
    
    setRotationZ(handle, hints) {
        handle.impl.rotation.z = hints.transform.rotation.z;
    }
    setScaleX(handle, hints) {
        handle.impl.scale.x = hints.transform.scale.x;
    }
    
    setScaleY(handle, hints) {
        handle.impl.scale.y = hints.transform.scale.y;
    }
    
    setScaleZ(handle, hints) {
        handle.impl.scale.z = hints.transform.scale.z;
    }
    setColor(handle, hints) {
        handle.impl.material.color.set(hints.renderer.color);
    }
    
    setOpacity(handle, hints) {
        handle.impl.material.opacity = hints.renderer.opacity;
        handle.impl.material.transparent = hints.renderer.opacity < 1;
    }
    
    setVisible(handle, hints) {
        handle.impl.visible = hints.renderer.visible;
    }
    setRadius(handle, hints) {
        // only if your geometry supports it
    }
    
    setWidth(handle, hints) {
        // wedge-specific
    }
    
    setHeight(handle, hints) {
        // wedge-specific
    }


    // ------------------------------------------------------------
    // Unified hint application entry point
    // ------------------------------------------------------------
    applyHints(handle, hints = {}) {
        if (!hints) return;

        const walk = (obj, prefix = "") => {
            for (const [key, value] of Object.entries(obj)) {
                const path = prefix ? `${prefix}.${key}` : key;

                if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                    walk(value, path);
                } else {
                    const fn = this.hintDispatch[path];
                    if (fn) 
                        fn(handle, hints);
                }
            }
        };

        walk(hints);
    }


    // ------------------------------------------------------------
    // START lifecycle — RR‑final: do NOT apply hints here
    // ------------------------------------------------------------
    start() {
        // Pearl is already fully initialised by super().
        // Camera, axis overlay, and all transforms will be set
        // ONLY when the renderer calls applyHints().
        this._initialHintsPending = false;
    }
}
