// rr/phaseArrow/PhaseWedgeRenderer_ABC.js
import { RendererBase } from "../../../pv-rendererBase.js";

class PhaseWedgeRenderer_ABC extends RendererBase {
    constructor(domain, pearl) {
        super(domain, pearl);
    }

    render(semanticObject, hints) {
        // Let RendererBase + Dispatch handle transforms
        super.render(semanticObject, hints);

        // Trails still need manual handling
        if (semanticObject.trailEnabled) {
            const handle = this.ensureHandle(semanticObject);
            this.pearl.updateTrail(handle, semanticObject);
        }
    }
}


export { PhaseWedgeRenderer_ABC };