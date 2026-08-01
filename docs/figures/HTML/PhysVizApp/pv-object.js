/**
 * Base class for all semantic entities in RR.
 * Receives UpdateEvents only.
 * Optional GetRenderHints() exists for future semantic projection.
 */
export class SemanticObject {
    constructor(name) {
        this.name = name;
        this.domain = null;
        this.semanticState = {};
    }

    attachToDomain(domain) {
        this.domain = domain;
        // domain.semantic.register(this);
    }

    /**
     * Receive UpdateEvents from the LogicalBus.
     * @param {event} event
     */
    onUpdate(event) {
        // Override in subclass.
    }

    /**
     * Optional: provide semantic hints for rendering.
     * Not called automatically by the engine.
     * Domains may call this manually.
     * @returns {Object|null}
     */
    getRenderHints() {
        const hints = {};

        for (const key of Object.keys(this)) {
            if (!key.startsWith('_')) {
                hints[key] = this[key];
            }
        }

        return Object.freeze(hints);  // Stops renderers from modifying
    }
}

