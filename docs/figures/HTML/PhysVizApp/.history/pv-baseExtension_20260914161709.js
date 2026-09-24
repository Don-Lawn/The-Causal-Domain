// ---------------------------------------------------------------------------
// BaseExtension.js
// Capability module — behaviour lives here
// ---------------------------------------------------------------------------

export class BaseExtension {
    constructor(name) {
        this.name = name;
        this.object = null;
    }

    // Called by BaseObject.extend()
    attachTo(object) {
        this.object = object;
        this.onAttach(object);
    }

    // Optional hook for subclasses
    onAttach(object) {
        // Override in subclasses
    }

    // Optional detach support
    detach() {
        if (this.object) {
            this.onDetach(this.object);
            this.object.capabilities.delete(this.name);
            this.object = null;
        }
    }

    onDetach(object) {
        // Override in subclasses
    }
}
