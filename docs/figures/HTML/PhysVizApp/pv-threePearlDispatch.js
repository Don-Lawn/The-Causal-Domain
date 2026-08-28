// pv-threePearlDispatch.js
import { ThreePearl } from "./pv-threePearl.js";
import { HintHelper } from "./pv-HintHelper.js";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";


export class ThreePearlDispatch extends ThreePearl {

    constructor(canvas, domain, callerHints = {}) {
        // IMPORTANT: Do not merge hints before calling super().
        // Pearl must initialise its engine state (camera, scene, renderer,
        // axis overlay, trails) using the raw callerHints. Dispatch then
        // reads Pearl’s initialised values to build defaultHints and merges
        // callerHints afterward. Merging before super() would give Pearl
        // incorrect or premature values and break the hint pipeline.

        super(canvas, domain, callerHints);

        // ------------------------------------------------------------
        // Build default hints from engine state
        // ------------------------------------------------------------
        const defaultHints = {
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
        // Merge caller hints over defaults
        // ------------------------------------------------------------
        this.hints = HintHelper.mergeHints(defaultHints, callerHints);

        // ------------------------------------------------------------
        // Build dispatch table (auto‑wrap setX(handle,hints) methods)
        // ------------------------------------------------------------
        this.hintDispatch = HintHelper.buildHintDispatch(this);

        // ------------------------------------------------------------
        // Defer initialization until start()
        // ------------------------------------------------------------
        this._initialHintsPending = true;
    }


    // ------------------------------------------------------------
    // Camera Factory
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
    // Hint‑driven camera setters
    // ------------------------------------------------------------
    setCameraPosition(handle, hints) {
        const p = hints.position;
        if (p) this.camera.position.set(p.x, p.y, p.z);
    }

    setCameraUp(handle, hints) {
        const u = hints.up;
        if (u) this.camera.up.set(u.x, u.y, u.z);
    }

    setCameraLookAt(handle, hints) {
        const t = hints.lookAt;
        if (t) this.camera.lookAt(t.x, t.y, t.z);
    }

    setCameraZoom(handle, hints) {
        if (typeof hints.zoom === "number") {
            this.camera.zoom = hints.zoom;
            this.camera.updateProjectionMatrix();
        }
    }


    // ------------------------------------------------------------
    // Unified hint application entry point
    // ------------------------------------------------------------
    applyHints(handle, hints = {}) {
        if (!hints) return;

        for (const [key, value] of Object.entries(hints)) {
            const fn = this.hintDispatch[key];
            if (fn) fn(handle, value);
        }
    }

    setScaleX(handle, hints) {
        handle.impl.scale.x = hints.scale.x;
    }

    setScaleY(handle, hints) {
        handle.impl.scale.y = hints.scale.y;
    }

    setScaleZ(handle, hints) {
        handle.impl.scale.z = hints.scale.z;
    }

    // ------------------------------------------------------------
    // Semantic scale setters (high‑level)
    // ------------------------------------------------------------
    setScaleXFromPhase(handle, hints) {
        const scale = Math.sin(hints.localXrotation);
        this.setScaleX(handle, { scale: { x: scale } });
    }

    setScaleYFromPhase(handle, hints) {
        const scale = Math.sin(hints.localYrotation);
        this.setScaleY(handle, { scale: { y: scale } });
    }

    setScaleZFromPhase(handle, hints) {
        const scale = Math.sin(hints.localZrotation);
        this.setScaleZ(handle, { scale: { z: scale } });
    }
    // ------------------------------------------------------------
    // START lifecycle — apply initial hints
    // ------------------------------------------------------------
    start(extraHints = null) {

        // Merge any additional hints provided at start time
        if (extraHints) {
            this.hints = HintHelper.mergeHints(this.hints, extraHints);
        }

        // Only apply once
        if (!this._initialHintsPending) return;

        // Rebuild camera from hints
        this.camera = this._createCameraFromHints(this.hints.camera || {});

        // Apply camera transforms via hint‑dispatch
        this.applyHints(null, {
            cameraPosition: { position: this.hints.camera.position },
            cameraUp:       { up: this.hints.camera.up },
            cameraLookAt:   { lookAt: this.hints.camera.lookAt },
            cameraZoom:     { zoom: this.hints.camera.zoom }
        });

        // Apply axis overlay hints
        this.axisOverlayLength = this.hints.axisOverlay.length;
        this.axisOverlayMargin = this.hints.axisOverlay.margin;

        // Update frustum after camera changes
        this._updateOrthographicFrustum();

        this._initialHintsPending = false;
    }
}
