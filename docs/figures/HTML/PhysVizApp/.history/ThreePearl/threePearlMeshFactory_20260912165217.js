 // ------------------------------------------------------------
    // Mesh creation (unchanged)
    // ------------------------------------------------------------

    export function createPhaseWedgeMesh(hints) {
        const mesh = this.makeTriangularPrism(hints);

        hints["transform.rotation.x"] = Math.PI / 2;

        const theta       = hints["semantic.theta"]       ?? 0;
        const phaseOffset = hints["semantic.phaseOffset"] ?? 0;

        hints["transform.rotation.z"] = theta + phaseOffset;

        return mesh;
    }





    export function createPhaseArrowMesh(semanticObject, hints = {}) {
        // Semantic defaults
        const shaftLength     = hints.shaftLength     ?? semanticObject.shaftLength     ?? 1.0;
        const shaftRadius     = hints.shaftRadius     ?? semanticObject.shaftRadius     ?? 0.05;
        const headLength      = hints.headLength      ?? semanticObject.headLength      ?? 0.25;
        const headRadius      = hints.headRadius      ?? semanticObject.headRadius      ?? 0.12;
        const color           = hints.color           ?? semanticObject.color           ?? 0xffffff;

        // Shaft
        const shaft = this.makeCylinder({
            radiusTop:    shaftRadius,
            radiusBottom: shaftRadius,
            height:       shaftLength,
            color
        });

        this.setPosition(shaft, {
            x: 0,
            y: shaftLength / 2,
            z: 0
        });

        // Head
        const head = this.makeCone({
            radius: headRadius,
            height: headLength,
            color
        });

        this.setPosition(head, {
            x: 0,
            y: shaftLength + headLength / 2,
            z: 0
        });

        // Composite
        return this.combine([shaft, head]);
    }
