// ---------------------------------------------------------------------------
// pv-geometryExtension.js
// Provides spatial state + Three.js Object3D + optional geometry/material
// ---------------------------------------------------------------------------

import { BaseExtension } from "./pv-baseExtension.js";
import * as THREE from "three";

export class GeometryExtension extends BaseExtension {
    constructor({
        geometry = null,
        material = null,
        autoAddToScene = true,
        scene = null
    } = {}) {
        super("geometry");

        this.geometry = geometry;
        this.material = material;
        this.autoAddToScene = autoAddToScene;
        this.scene = scene;

        this.object3D = new THREE.Object3D();
    }

    onAttach(object) {

        // -------------------------------------------------------------------
        // Attach geometry + material if provided
        // -------------------------------------------------------------------
        if (this.geometry && this.material) {
            const mesh = new THREE.Mesh(this.geometry, this.material);
            this.object3D.add(mesh);
        }

        // -------------------------------------------------------------------
        // Glue: expose spatial state on the object
        // -------------------------------------------------------------------
        object.object3D = this.object3D;

        object.setPosition = (x, y, z) => {
            this.object3D.position.set(x, y, z);
        };

        object.setRotation = (x, y, z) => {
            this.object3D.rotation.set(x, y, z);
        };

        object.setScale = (x, y, z) => {
            this.object3D.scale.set(x, y, z);
        };

        object.lookAt = (x, y, z) => {
            this.object3D.lookAt(x, y, z);
        };

        // -------------------------------------------------------------------
        // Optional: auto-add to scene
        // -------------------------------------------------------------------
        if (this.autoAddToScene && this.scene) {
            this.scene.add(this.object3D);
        }

        // -------------------------------------------------------------------
        // Optional: RENDER → update transforms
        // (RenderExtension already routes RENDER events)
        // -------------------------------------------------------------------
        if (typeof object.render === "function") {
            const originalRender = object.render;

            object.render = (dt) => {
                // Allow user-defined render first
                originalRender(dt);

                // Then update Object3D if needed (no-op for now)
                // This hook is here for future animation logic
            };
        }
    }

    onDetach(object) {
        // Remove glue
        delete object.object3D;
        delete object.setPosition;
        delete object.setRotation;
        delete object.setScale;
        delete object.lookAt;

        // Remove from scene if needed
        if (this.scene && this.autoAddToScene) {
            this.scene.remove(this.object3D);
        }

        // Destroy geometry if present
        this.object3D.clear();
    }
}
