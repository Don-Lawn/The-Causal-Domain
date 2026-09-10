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
    // Unified hint application entry point
    // ------------------------------------------------------------
    applyHints(handle, flatHints) {
        for (const [key, value] of Object.entries(flatHints)) {
            switch (key) {

                // TRANSFORM
                case "transform.position.x": handle.impl.position.x = value; break;
                case "transform.position.y": handle.impl.position.y = value; break;
                case "transform.position.z": handle.impl.position.z = value; break;

                case "transform.rotation.x": handle.impl.rotation.x = value; break;
                case "transform.rotation.y": handle.impl.rotation.y = value; break;
                case "transform.rotation.z": handle.impl.rotation.z = value; break;

                case "transform.scale.x": handle.impl.scale.x = value; break;
                case "transform.scale.y": handle.impl.scale.y = value; break;
                case "transform.scale.z": handle.impl.scale.z = value; break;

                // RENDERER
                case "renderer.color": handle.impl.material.color.set(value); break;
                case "renderer.opacity":
                    handle.impl.material.opacity = value;
                    handle.impl.material.transparent = value < 1;
                    break;
                case "renderer.visible": handle.impl.visible = value; break;

                // GEOMETRY
                case "geometry.width": /* update geometry */ break;
                case "geometry.height": /* update geometry */ break;
                case "geometry.radius": /* update geometry */ break;

                default:
                    // ignore unknown hints
                    break;
            }
        }
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
