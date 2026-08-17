/**
 * @typedef {Object} HintShape
 * @property {string} id
 * @property {string} title
 * @property {string} summary
 * @property {string} detail
 * @property {string} category
 * @property {Object<string, any>=} data
 */

/**
 * Base class for all semantic entities in RR.
 * Receives UpdateEvents only.
 * Optional GetRenderHints() exists for future semantic projection.
 */
export class SemanticObject {
    /**
     * @param {string} name
     * @param {HintShape[]=} hints
     */
    constructor(name, hints = []) {
        this.name = name;
        this.domain = null;
        this.semanticState = {};

        /** @type {HintShape[]} */
        this.hints = hints;
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

    // ------------------------------------------------------------
    // Hint accessors
    // ------------------------------------------------------------

    /**
     * @returns {HintShape[]}
     */
    getHints() {
        return this.hints;
    }

    /**
     * @param {HintShape} hint
     */
    addHint(hint) {
        this.hints.push(hint);
    }

    /**
     * @param {string} category
     * @returns {HintShape[]}
     */
    getHintsByCategory(category) {
        return this.hints.filter(h => h.category === category);
    }

    // ------------------------------------------------------------
    // Render hint projection
    // ------------------------------------------------------------

    /**
     * Optional: provide semantic hints for rendering.
     * Domains may call this manually.
     * @returns {Object|null}
     */
    getRenderHints() {
        const hints = {};

        // Public fields → render hint projection
        for (const key of Object.keys(this)) {
            if (!key.startsWith('_')) {
                hints[key] = this[key];
            }
        }

        // NEW: include typed semantic hint bag
        hints.semanticHints = this.hints;

        return Object.freeze(hints);
    }
}
