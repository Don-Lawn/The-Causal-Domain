// rr/coneEllipse/rr-causalPhaseArrowRenderer.js
//import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { PVHandle } from "../../../pv-handle.js";
import { RendererBase } from "../../../pv-rendererBase.js";

class RRCausalPhaseArrowRenderer extends RendererBase {
    constructor(domain, pearl) {
        super(domain, pearl);
    }

    createHandle(semanticObject) {
        const handle = new PVHandle(new THREE.Group());
        this.handles.set(semanticObject.id, handle);
        return handle;
    }

    ensureGeometry(handle) {
        if (handle.geometryBuilt) return;

        const group = new THREE.Group();

        const shaft = new THREE.Mesh(
            new THREE.CylinderGeometry(0.014, 0.014, 0.4, 16),
            new THREE.MeshBasicMaterial({ color: 0xff2b2b, transparent: true, opacity: 0.5 })
        );
        shaft.rotation.z = -Math.PI / 2;

        const head = new THREE.Mesh(
            new THREE.ConeGeometry(0.04, 0.1, 16),
            new THREE.MeshBasicMaterial({ color: 0xff2b2b, transparent: true, opacity: 0.5 })
        );
        head.rotation.z = -Math.PI / 2;

        const circle = new THREE.LineLoop(
            new THREE.BufferGeometry(),
            new THREE.LineBasicMaterial({ color: 0xff4a4a, transparent: true, opacity: 0.5 })
        );

        group.add(circle);
        group.add(shaft);
        group.add(head);

        handle.impl = group;
        handle.circle = circle;
        handle.shaft = shaft;
        handle.head = head;
        handle.lastRadius = null;

        this.pearl.attachToDomain(handle);
        handle.geometryBuilt = true;
    }

    render(semanticObject, hints) {
        super.render(semanticObject, hints);
        const handle = this.ensureHandle(semanticObject);
        this.updateArrowGeometry(handle, hints);
        this.applyRedColor(handle, hints);

        if (semanticObject.trailEnabled) {
            this.pearl.updateTrail(handle, semanticObject);
        }
    }

    setPosition(handle, hints) {
        this.pearl.setPosition(handle, {
            x: hints.centerX ?? 0,
            y: hints.centerY ?? 0,
            z: hints.qLevel ?? -0.5
        });
    }

    setRotationZ(handle, hints) {
        this.pearl.setRotationX(handle, 0);
        this.pearl.setRotationY(handle, 0);
        this.pearl.setRotationZ(handle, hints.theta ?? 0);
    }

    updateArrowGeometry(handle, hints) {
        const radius = Math.max(hints.circleRadius ?? 0.5, 0.05);
        if (handle.lastRadius === radius) {
            return;
        }

        const headLength = Math.max(0.08, radius * 0.2);
        const shaftLength = Math.max(0.02, radius - headLength);

        handle.shaft.geometry.dispose();
        handle.shaft.geometry = new THREE.CylinderGeometry(0.014, 0.014, shaftLength, 16);
        handle.shaft.rotation.z = -Math.PI / 2;
        handle.shaft.position.set(shaftLength / 2, 0, 0);

        handle.head.geometry.dispose();
        handle.head.geometry = new THREE.ConeGeometry(Math.max(0.03, headLength * 0.4), headLength, 16);
        handle.head.rotation.z = -Math.PI / 2;
        handle.head.position.set(shaftLength + headLength / 2, 0, 0);

        const segments = 96;
        const points = [];
        for (let i = 0; i < segments; i += 1) {
            const t = (i / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(t) * radius, Math.sin(t) * radius, 0));
        }

        handle.circle.geometry.dispose();
        handle.circle.geometry = new THREE.BufferGeometry().setFromPoints(points);

        handle.lastRadius = radius;
    }

    applyRedColor(handle, hints) {
        const color = hints.color ?? 0xff2b2b;
        const baseOpacity = Math.max(0, Math.min(1, hints.opacity ?? 0.5));
        let opacity = baseOpacity;

        if (hints.pulseEnabled) {
            const cycles = Math.max(1, hints.pulseCyclesPerRevolution ?? 2);
            const pulsePhaseOffset = hints.pulsePhaseOffset ?? 0;
            const phase = (((hints.theta ?? 0) * cycles) + pulsePhaseOffset) % (2 * Math.PI);
            // 0..1 oscillation: full -> transparent -> full, repeated by `cycles` per revolution.
            const wave01 = 0.5 * (1 + Math.cos(phase));
            const pulseMin = Math.max(0, Math.min(1, hints.pulseMinOpacity ?? 0));
            const pulseMax = Math.max(pulseMin, Math.min(1, hints.pulseMaxOpacity ?? 1));
            const pulsedOpacity = pulseMin + (pulseMax - pulseMin) * wave01;
            opacity = baseOpacity * pulsedOpacity;
        }

        handle.shaft.material.color.setHex(color);
        handle.shaft.material.transparent = true;
        handle.shaft.material.opacity = opacity;

        handle.head.material.color.setHex(color);
        handle.head.material.transparent = true;
        handle.head.material.opacity = opacity;

        handle.circle.material.color.setHex(color);
        handle.circle.material.transparent = true;
        handle.circle.material.opacity = opacity;
    }

    applyColor(handle, hints) {
        return;
    }
}

export { RRCausalPhaseArrowRenderer };
