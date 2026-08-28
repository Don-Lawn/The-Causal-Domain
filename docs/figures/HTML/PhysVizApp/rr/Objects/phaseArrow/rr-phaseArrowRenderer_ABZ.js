    // rr/phaseArrow/PhaseArrowRenderer_ABZ.js
    import { RendererBase } from '../../../pv-rendererBase.js';

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
        this.pearl.setRotationZ(handle, hints.phase ?? 0);
    }

   createPhaseArrowHelixMesh(semanticObject, hints = {}) {
        const turns     = hints.turns     ?? semanticObject.turns     ?? 3;
        const radius    = hints.radius    ?? semanticObject.radius    ?? 0.2;
        const pitch     = hints.pitch     ?? semanticObject.pitch     ?? 0.1;
        const tubeRadius= hints.tubeRadius?? semanticObject.tubeRadius?? 0.03;
        const color     = hints.color     ?? semanticObject.color     ?? 0xffffff;

        // Build helix curve
        const points = [];
        const segments = 100;

        for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * (Math.PI * 2 * turns);
            const x = radius * Math.cos(t);
            const y = pitch * t;
            const z = radius * Math.sin(t);
            points.push(new THREE.Vector3(x, y, z));
        }

        const curve = new THREE.CatmullRomCurve3(points);

        // Tube geometry along the helix
        const geometry = new THREE.TubeGeometry(curve, 200, tubeRadius, 8, false);
        const material = new THREE.MeshStandardMaterial({ color });

        return new THREE.Mesh(geometry, material);
    }

    // Convert phase (radians) → colour
    applyColor(handle, hints) {
        const normalizedPhase = ((hints.phase ?? 0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const hue = ((1 - Math.cos(2 * normalizedPhase)) / 2) * (1 / 3);
        const hex = this.hslToHex(hue, 1.0, 0.5);
        this.pearl.applyColor(handle, hex);
    }

    ensureGeometry(handle) {
    if (!handle.impl) {
        const semantic = handle.semanticObject;
        const hints = semantic.hints ?? {};
        handle.impl = this.pearl.meshFactory.createPhaseArrowHelixMesh(semantic, hints);
    }
}

}

export { PhaseArrowRenderer_ABZ };
