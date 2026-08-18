   // ------------------------------------------------------------
    // Trails (unchanged)
    // ------------------------------------------------------------

    import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
    import { PVHandle } from "../pv-handle.js";

    export function updateTrail(handle, semanticObject) {
        const ghost = handle.impl.clone(true);
        const preserveSourceOpacity = semanticObject?.trailUseSourceOpacity === true;

        ghost.traverse(node => {
            if (node.material) {
                node.material = node.material.clone();
                node.material.transparent = true;
                node.material.opacity = 1.0;
                if (!preserveSourceOpacity) {
                    node.material.opacity = 1.0;
                }
            }
        });

        this.scene.add(ghost);
        handle.trail.push(ghost);

        if (semanticObject.trailFadeEnabled === false) {
            return;
        }

        for (let i = handle.trail.length - 1; i >= 0; i--) {
            const g = handle.trail[i];

            g.scale.multiplyScalar(0.998);

            g.traverse(node => {
                if (node.material) {
                    node.material.opacity -= semanticObject.fadeRate;
                }
            });

            const first = g.children[0];
            if (first && first.material.opacity <= 0) {
                this.scene.remove(g);
                handle.trail.splice(i, 1);
            }
        }
    }


    export function    resetTrailCycleState(handle, semanticObject) {
        if (!handle || !semanticObject) {
            return;
        }

        const cycle = semanticObject.trailCycle ?? 0;

        if (handle.loopCycle !== cycle) {
            if (Array.isArray(handle.trail)) {
                for (const ghost of handle.trail) {
                    this.scene.remove(ghost);
                }
                handle.trail = [];
            }
            handle.loopCycle = cycle;
        }

        const id = semanticObject.id;
        this.simpleTrailCycles = this.simpleTrailCycles || new Map();

        if (this.simpleTrailCycles.get(id) !== cycle) {
            this.simpleTrailCycles.set(id, cycle);

            if (this.simpleTrails) {
                this.simpleTrails.set(id, []);
            }

            const trail = this.simpleTrailObjects?.get(id);
            if (trail) {
                trail.geometry.dispose();
                trail.geometry = new THREE.BufferGeometry();
                trail.visible = false;
            }
        }
    }

    export function updateSimpleTrail(semanticObject, point, options = {}) {
        if (!semanticObject || !this.scene) {
            return;
        }

        const id = semanticObject.id;
        if (!this.simpleTrails) {
            this.simpleTrails = new Map();
        }

        const history = this.simpleTrails.get(id) || [];
        history.push(point);

        while (history.length > 64) {
        const maxPoints = Number.isFinite(options.maxPoints) ? Math.max(1, Math.floor(options.maxPoints)) : 64;
        while (history.length > maxPoints) {
            history.shift();
        }

        this.simpleTrails.set(id, history);

        let trail = this.simpleTrailObjects?.get(id);
        if (!trail) {
            const geometry = new THREE.BufferGeometry();
            const material = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: false,
                opacity: 1.0,
                depthTest: false,
                depthWrite: false
            });
            trail = new THREE.Line(geometry, material);
            trail.renderOrder = 900;
            this.content.add(trail);
            this.simpleTrailObjects = this.simpleTrailObjects || new Map();
            this.simpleTrailObjects.set(id, trail);
        }

        const includeOrigin = options.includeOrigin ?? true;
        const points = includeOrigin ? [{ x: 0, y: 0, z: 0 }, ...history] : history;
        const positions = new Float32Array(points.length * 3);
        points.forEach((p, index) => {
            positions[index * 3 + 0] = p.x;
            positions[index * 3 + 1] = p.y;
            positions[index * 3 + 2] = this._toThreeZ(p.z);
        });

        trail.geometry.dispose();
        trail.geometry = new THREE.BufferGeometry();
        trail.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        trail.visible = points.length > 1;
    }
}