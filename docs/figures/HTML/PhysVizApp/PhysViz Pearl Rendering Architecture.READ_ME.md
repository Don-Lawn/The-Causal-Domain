# **Portia / Pearl Rendering Architecture**

## **1. Overview**

The system is structured as a three‑layer pipeline:

1. **Semantic Layer** — meaning, phase, Q/C values, Tempo
2. **Visual Layer** — glyphs/renderers that convert semantic state into transforms
3. **Render Layer (Pearl)** — Three.js owner, scene manager, render loop

Infrastructure components (EventBus, FSM, Domain) drive updates and coordinate the layers.

Three.js is a **singleton** owned exclusively by Pearl.

# **2. Semantic Layer —** `SemanticObject`

### **Role**

Holds *meaning*, not geometry.

### **Responsibilities**

- Phase (`phase`, `startPhase`)
- Q/C values
- Tempo
- Logical state (active/inactive, domain state)

### **Non‑Responsibilities**

- No Three.js imports
- No meshes
- No transforms (`position`, `rotation`, `scale`)
- No rendering logic

### **Example**

js

```
class SemanticObject {
    constructor(opts = {}) {
        this.id = opts.id;
        this.startPhase = opts.startPhase ?? 0;
        this.phase = this.startPhase;
        this.tempo = opts.tempo ?? 1.0;
    }

    advance(dt) {
        this.phase += this.tempo * dt;
    }
}
```

SemanticObjects are updated by the FSM/domain and consumed by the visual layer.

# **3. Render Layer —** `Pearl`

### **Role**

Pearl is the **sole owner** of Three.js and the rendering pipeline.

### **Responsibilities**

- Import Three.js (only here)
- Create and manage:
  - `THREE.Scene`
  - `THREE.WebGLRenderer`
  - `THREE.Camera`
- Maintain a registry of glyphs
- Call glyph `.update(dt)` each frame
- Render the scene

### **Three.js Singleton**

Pearl exports its Three.js instance:

js

```
import * as THREE from './lib/three.module.js';
export const Three = THREE;
```

All other modules import Three from Pearl:

js

```
import { Three } from './pv-threePearl.js';
```

### **Example**

js

```
class Pearl {
    constructor() {
        this.scene = new Three.Scene();
        this.renderer = new Three.WebGLRenderer({ antialias: true });
        this.camera = new Three.PerspectiveCamera(...);
        this.glyphs = [];
    }

    addGlyph(glyph) {
        this.glyphs.push(glyph);
        this.scene.add(glyph.mesh);
    }

    render(dt) {
        for (const glyph of this.glyphs) {
            glyph.update(dt);
        }
        this.renderer.render(this.scene, this.camera);
    }
}
```

# **4. Visual Layer — Glyph / Renderer Classes**

### **Role**

Convert semantic state into Three.js transforms.

### **Responsibilities**

- Hold a reference to a `SemanticObject`
- Create a Three.js mesh using Pearl’s `Three`
- Apply transforms based on semantic state:
  - rotation
  - scale
  - position
- Implement visual behaviour (phase arrows, wedges, etc.)

### **Non‑Responsibilities**

- No direct Three.js imports
- No global render loop
- No semantic updates

### **Example: Phase Wedge Glyph**

js

```
import { Three } from './pv-threePearl.js';

class PhaseGlyph {
    constructor(semanticObj, opts = {}) {
        this.semantic = semanticObj;
        this.phaseOffset = opts.phaseOffset ?? 0;
        this.baseDepth = 0.05;

        this.mesh = this._createWedgeMesh(opts.color ?? 0xff0000);
    }

    _createWedgeMesh(color) {
        const shape = new Three.Shape();
        // define wedge shape...
        const geom = new Three.ExtrudeGeometry(shape, { depth: this.baseDepth });
        const mat = new Three.MeshBasicMaterial({ color });
        return new Three.Mesh(geom, mat);
    }

    update(dt) {
        const phase = this.semantic.phase + this.phaseOffset;

        // rotation
        this.mesh.rotation.z = phase;

        // height modulation (quadrature)
        const h = 0.2 * Math.sin(phase);
        this.mesh.scale.z = h / this.baseDepth; // supports inversion
    }
}
```

### **Quadrature Example**

Red wedge:

js

```
new PhaseGlyph(redSemantic, { phaseOffset: 0 });
```

Green wedge:

js

```
new PhaseGlyph(greenSemantic, { phaseOffset: Math.PI / 2 });
```

# **5. EventBus + FSM + Domain**

### **Role**

Drive semantic updates and trigger rendering.

### **Flow**

1. EventBus emits a `tick` or `render` event
2. FSM advances all SemanticObjects (`semantic.advance(dt)`)
3. Domain or FSM calls `Pearl.render(dt)`
4. Pearl calls each glyph’s `.update(dt)`
5. Pearl renders the scene

### **Responsibilities**

- Deterministic update ordering
- Routing events between domains, FSMs, and Pearl
- Maintaining semantic state independent of rendering

# **6. Three.js Import Rules**

### **Critical Rule**

Three.js must be imported **only in Pearl**.

### **All other modules**

Use:

js

```
import { Three } from './pv-threePearl.js';
```

### **Why**

Multiple Three.js imports create:

- prototype mismatches
- invalid `instanceof` checks
- missing properties (`scale` becomes undefined)
- “Multiple instances of Three.js being imported” warnings
- runtime failures during transform updates

Pearl’s Three.js instance must be the **single source of truth**.

# **7. Phase Arrow / Glyph Reuse**

### **Rule**

There must be **one canonical phase glyph implementation**.

New visual behaviours must:

- reuse the existing phase semantics
- reuse the existing glyph base
- avoid creating parallel or duplicate phase arrow classes

If a new phase arrow appears, it must be merged back into the canonical glyph.

9. Hints as a Semantic Bag of Parameters
The Hints system provides a flexible, forward‑compatible mechanism for passing optional, context‑specific parameters through multiple layers of the architecture without introducing coupling or breakage. A hint is a lightweight, self‑describing metadata envelope: a structured object containing named fields that may or may not be recognised by the receiving subsystem. This allows components to evolve independently while still sharing semantic information.

9.1 Purpose and Motivation
Hints exist to solve a recurring architectural need: the ability to enrich operations with auxiliary information without modifying function signatures, class hierarchies, or core data structures. They allow the system to carry additional meaning—rendering directives, physics modifiers, semantic tags, debugging cues—without forcing every subsystem to understand every possible parameter.

This pattern mirrors the Portia triplet design: a payload that can be passed through arbitrarily deep layers, where each layer reads only the fields it recognises and ignores the rest. The result is a stable, extensible communication channel.

9.2 Structural Requirements
Although hints behave like a “bag of parameters,” they are not an untyped blob. To preserve IntelliSense, maintainability, and architectural clarity, hints conform to a defined schema:

HintShape — the canonical structure describing the metadata envelope

HintCategory — a closed enumeration defining the domain of the hint

HintNode — typed sub‑elements describing formulas, relationships, or semantic structure

Hint — an explicit class wrapper providing safe accessors and predictable behaviour

This ensures that hints remain discoverable, navigable, and type‑checked, even though their contents are optional and may vary between categories.

9.3 Behaviour Across Subsystems
Hints are designed for graceful degradation:

A subsystem may read any field it recognises.

A subsystem must ignore fields it does not recognise.

No subsystem may assume the presence of any hint.

No subsystem may fail due to missing or extra hint fields.

This behaviour ensures that hints can be added, removed, or extended without breaking existing code. It also allows new subsystems to interpret hints in novel ways without requiring changes elsewhere in the architecture.

9.4 Pass‑Through and Envelope Semantics
Hints are passed through the architecture as a semantic envelope:

They accompany core objects (nodes, renderables, physics entities) without altering their identity.

They accumulate meaning as they move through the pipeline.

They may be inspected, transformed, or augmented at any stage.

They preserve all fields unless explicitly rewritten.

This makes hints suitable for cross‑cutting concerns such as:

Rendering modes

Physics modifiers

Q‑dimension annotations

Symbolic or mythological metadata

Debugging and instrumentation flags

9.5 Extensibility and Future‑Proofing
The hints system is intentionally open‑ended. New categories, nodes, and fields can be introduced without affecting existing behaviour. Because the structure is typed and explicit, IntelliSense remains reliable even as the system grows.

This design supports long‑term evolution of the architecture, including:

richer semantic modelling

integration with the Q‑dimension cosmogony

symbolic hyperlinking across mythological constructs

adaptive rendering pipelines

dynamic behaviour driven by hint metadata

# **8. Summary**

- **SemanticObject:** meaning only
- **Glyphs:** visual behaviour
- **Pearl:** rendering + Three.js singleton
- **EventBus/FSM/Domain:** control flow
- **Three.js:** imported only once
- **Phase glyphs:** canonical, reusable, quadrature‑capable

This architecture ensures:

- deterministic behaviour
- clean separation of concerns
- stable rendering
- no Three.js duplication
- predictable phase and Q/C visualisation