// rr/phaseArrow/PhaseWedgeRenderer_ABC.js
import { RendererBase } from "../../../pv-rendererBase.js";

class PhaseWedgeRenderer_ABC extends RendererBase {
	constructor(domain, pearl) {
		super(domain, pearl);
	}

	render(semanticObject, hints) {
		super.render(semanticObject, hints);

		if (semanticObject.trailEnabled) {
			const handle = this.ensureHandle(semanticObject);
			this.pearl.updateTrail(handle, semanticObject);
		}

        this.setScaleZ(semanticObject._pvHandle, hints);
	}

	setPosition(handle, hints) {
		this.pearl.setPosition(handle, {
			x: hints.centerX ?? 0,
			y: hints.centerY ?? 0,
			z: hints.qLevel ?? 0
		});
	}

	setRotationZ(handle, hints) {
		this.pearl.setRotationZ(handle, hints.theta ?? 0);
	}

    setScaleZ(handle, hints) {
        this.pearl.setScaleZ(handle, { localZrotation: (hints.theta - hints.phaseOffset) });
    }

	ensureGeometry(handle) {
		if (handle.geometryBuilt) return;

		// createHandle already built a PhaseWedge mesh in ThreePearl.createMeshFor().
		// Here we only ensure it is attached once to the domain scene.
		this.pearl.attachToDomain(handle);
		handle.geometryBuilt = true;
	}

	applyColor(handle, hints) {
		this.pearl.applyColor(handle, hints.color ?? 0xff2b2b);
	}
}

export { PhaseWedgeRenderer_ABC };