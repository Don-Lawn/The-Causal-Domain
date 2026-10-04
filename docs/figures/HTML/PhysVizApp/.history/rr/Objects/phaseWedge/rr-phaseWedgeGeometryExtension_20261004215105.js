// ---------------------------------------------------------------------------
// rr-phaseWedgeGeometryExtension.js  (Composition Version)
// RR-specific geometry capability for PhaseWedge
// ---------------------------------------------------------------------------

import { BaseExtension } from "../../../pv-baseExtension.js";
import * as THREE from "three";

export class PhaseWedgeGeometryExtension extends BaseExtension {
    constructor({
        radius = 1,
        thickness = 0.1,
        segments = 32
    } = {}) {
        super("phaseWedgeGeometry");

        this.radius = radius;
        this.thickness = thickness;
        this.segments = segments;

        this.mesh = null;
    }

    onAttach(host) {

        // Require GeometryExtension
        if (!host.object3D) {
            throw new Error(
                `PhaseWedgeGeometryExtension requires GeometryExtension on '${host.id}'.`
            );
        }

        // -------------------------------------------------------------------
        // Create RR wedge geometry
        // -------------------------------------------------------------------
        const geometry = new THREE.CircleGeometry(
            this.radius,
            this.segments
        );

        const material = new THREE.MeshStandardMaterial({
            color: host.hints["phaseWedge.color"] ?? 0xff0000,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(geometry, material);

        // Add to Object3D provided by GeometryExtension
        host.object3D.add(this.mesh);

        // -------------------------------------------------------------------
        // Glue: update geometry based on hints
        // -------------------------------------------------------------------
        host.updatePhaseWedgeGeometry = () => {
            const hints = host.hints.phaseWedge;

            // Update color
            this.mesh.material.color.setHex(hints.color);

            // Update scale (magnitude → radius)
            const r = hints.magnitude;
            this.mesh.scale.set(r, r, 1);

            // Update rotation (angle → Z rotation)
            host.object3D.rotation.z = hints.angle;
        };

        // -------------------------------------------------------------------
        // Hook into update(dt)
        // -------------------------------------------------------------------
        if (typeof host.update === "function") {
            const originalUpdate = host.update;

            host.update = (dt) => {
                originalUpdate(dt);
                host.updatePhaseWedgeGeometry();
            };
        }
    }

    onDetach(host) {
        delete host.updatePhaseWedgeGeometry;

        if (this.mesh && host.object3D) {
            host.object3D.remove(this.mesh);
        }

        this.mesh = null;
    }
}
