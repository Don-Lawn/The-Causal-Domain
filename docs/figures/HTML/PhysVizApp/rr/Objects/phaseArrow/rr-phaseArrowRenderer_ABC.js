// rr/phaseArrow/PhaseArrowRenderer_ABC.js
import { RendererBase } from '../../../pv-rendererBase.js';

class PhaseArrowRenderer_ABC extends RendererBase {    
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
        this.pearl.setPosition(handle, {
            x: 0,
            y: 0,
            z: 0
        });
    }

    setRotationZ(handle, hints) {
        this.pearl.setRotationZ(handle, hints.phase ?? 0);
    }

    ensureGeometry(handle) {
        if (!handle.impl) {
            const semantic = handle.semanticObject;
            const hints = semantic.hints ?? {};
            handle.impl = this.pearl.meshFactory.createPhaseArrowMesh(semantic, hints);
        }
    }

    
    applyColor(handle, hints) {
        const normalizedPhase = ((hints.phase ?? 0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const hue = ((1 - Math.cos(2 * normalizedPhase)) / 2) * (1 / 3);
        const hex = this.hslToHex(hue, 1.0, 0.5);
        this.pearl.applyColor(handle, hex);
    }
}

export { PhaseArrowRenderer_ABC };
