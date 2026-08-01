// rr/phaseArrow/PhaseArrowRenderer_ABZ.js
import { RendererBase } from '../../pv-rendererBase.js';

class PhaseArrowRenderer_ABZ extends RendererBase {
    constructor (domain, pearl) {
        super(domain, pearl);
    }

    render(semanticObject, hints) {
        super.render(semanticObject, hints);

        if (semanticObject.trailEnabled) {
            const handle = this.ensureHandle(semanticObject);
            this.pearl.updateTrail(handle, semanticObject);
        }
    }

    setPosition(handle, hints) {
        const z = hints.z ?? 0;

        this.pearl.setPosition(handle, {
            x: 0,
            y: 0,
            z
        });
    }

    setRotationZ(handle, hints) {
        this.pearl.setRotationZ(handle, hints.radians ?? hints.phase ?? 0);
    }

    ensureGeometry(handle) {
        if (handle.geometryBuilt) return;

        const pearl = this.pearl;

        const shaftLength = 0.4;
        const shaftRadius = 0.05;
        const headLength = 0.15;
        const headRadius = 0.10;

        const shaft = pearl.makeCylinder({
            radiusTop: shaftRadius,
            radiusBottom: shaftRadius,
            height: shaftLength,
            color: 0xffffff
        });
        pearl.setPosition(shaft, {
            x: 0,
            y: shaftLength / 2,
            z: 0
        });

        const head = pearl.makeCone({
            radius: headRadius,
            height: headLength,
            color: 0xffffff
        });
        pearl.setPosition(head, {
            x: 0,
            y: shaftLength + headLength / 2,
            z: 0
        });

        const combined = pearl.combine([shaft, head]);
        handle.impl = combined.impl;

        this.pearl.attachToDomain(handle);   // ⭐ REQUIRED ⭐
        handle.geometryBuilt = true;
    }

    // Convert phase (radians) → colour
    applyColor(handle, hints) {
        const normalizedPhase = ((hints.phase ?? 0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const hue = ((1 - Math.cos(2 * normalizedPhase)) / 2) * (1 / 3);
        const hex = this.hslToHex(hue, 1.0, 0.5);
        this.pearl.applyColor(handle, hex);
    }

}

export { PhaseArrowRenderer_ABZ };
