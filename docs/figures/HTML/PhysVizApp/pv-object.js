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
 * Optional getSemanticHints() exists for future semantic projection.
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

    getHints() {
        return { semantic: this._getSemanticHints()};
    }

    _getSemanticHints(){ 
        // override me.
    }
}
