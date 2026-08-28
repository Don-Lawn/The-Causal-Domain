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

        this.pearl.updateSimpleTrail(semanticObject, {
            x: hints.x ?? 0,
            y: hints.y ?? 0,
            z: hints.z ?? 0
        });
    }

    createPhaseArrowSphereMesh(semanticObject, hints = {}) {
        const radius = hints.radius ?? semanticObject.radius ?? 0.15;
        const color  = hints.color  ?? semanticObject.color  ?? 0xffffff;

        return this.makeSphere({
            radius,
            color
        });
    }
    
    ensureGeometry(handle) {
        if (!handle.impl) {
            const semantic = handle.semanticObject;
            const hints = semantic.hints ?? {};
            handle.impl = this.pearl.meshFactory.createPhaseArrowSphereMesh(semantic, hints);
        }
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
