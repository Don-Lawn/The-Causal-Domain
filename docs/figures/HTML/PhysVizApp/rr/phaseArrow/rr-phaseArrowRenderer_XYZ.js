// rr/phaseArrow/PhaseArrowRenderer_XYZ.js
import { RendererBase } from '../../pv-rendererBase.js';

class PhaseArrowRenderer_XYZ extends RendererBase {
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

    ensureGeometry(handle) {
        if (handle.geometryBuilt) return;

        const pearl = this.pearl;

        const core = pearl.makeSphere({ radius: 0.14, color: 0xffffff });
        const front = pearl.makeSphere({ radius: 0.075, color: 0xffffff });
        const back = pearl.makeSphere({ radius: 0.075, color: 0xffffff });

        pearl.setPosition(front, { x: 0, y: 0, z: 0.16 });
        pearl.setPosition(back, { x: 0, y: 0, z: -0.16 });

        const combined = pearl.combine([core, front, back]);
        handle.impl = combined.impl;

        this.pearl.attachToDomain(handle);   // ⭐ REQUIRED ⭐
        handle.geometryBuilt = true;
    }

    setPosition(handle, hints) {
        this.pearl.setPosition(handle, {
            x: hints.x,
            y: hints.y,
            z: hints.z ?? 0
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
