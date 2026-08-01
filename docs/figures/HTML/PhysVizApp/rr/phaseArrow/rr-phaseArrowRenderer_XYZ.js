// rr/phaseArrow/PhaseArrowRenderer_XYZ.js
import { RendererBase } from '../../pv-rendererBase.js';

class PhaseArrowRenderer_XYZ extends RendererBase {
    constructor (domain, pearl) {
        super(domain, pearl);
    }
 

    ensureGeometry(handle) {
        if (handle.geometryBuilt) return;

        const pearl = this.pearl;

        // Photon dot = small sphere
        const radius = 0.15;

        const sphere = pearl.makeSphere({
            radius,
            color: 0xffffff
        });

        handle.impl = sphere.impl;
        this.pearl.attachToDomain(handle);   // ⭐ REQUIRED ⭐
        handle.geometryBuilt = true;
    }

    setPosition(handle, hints) {
        this.pearl.setPosition(handle, {
            x: hints.x,
            y: hints.y,
            z: 0
        });
    }

    applyColor(handle, hints) {
        const normalizedPhase = ((hints.phase ?? 0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const hue = ((1 - Math.cos(2 * normalizedPhase)) / 2) * (1 / 3);
        const hex = this.hslToHex(hue, 1.0, 0.5);
        this.pearl.applyColor(handle, hex);
    }
}

export { PhaseArrowRenderer_XYZ };
