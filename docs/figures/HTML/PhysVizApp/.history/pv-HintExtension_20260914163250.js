// ---------------------------------------------------------------------------
// pv-hintExtension.js
// Unified hint/parameter capability for any BaseObject
// ---------------------------------------------------------------------------

import { BaseExtension } from "./pv-baseExtension.js";

export class HintExtension extends BaseExtension {
    constructor(initialHints = {}) {
        super("hints");

        // Extension-level hints (optional)
        this.localHints = { ...initialHints };
    }

    onAttach(object) {

        // -------------------------------------------------------------------
        // Merge extension-level hints into object.hints
        // -------------------------------------------------------------------
        Object.assign(object.hints, this.localHints);

        // -------------------------------------------------------------------
        // Glue: add/update/remove hints
        // -------------------------------------------------------------------
        object.setHint = (key, value) => {
            object.hints[key] = value;
        };

        object.getHint = (key) => {
            return object.hints[key];
        };

        object.removeHint = (key) => {
            delete object.hints[key];
        };

        // -------------------------------------------------------------------
        // Glue: bulk update
        // -------------------------------------------------------------------
        object.mergeHints = (hintObj) => {
            Object.assign(object.hints, hintObj);
        };

        // -------------------------------------------------------------------
        // Glue: category support
        // -------------------------------------------------------------------
        object.addHintCategory = (categoryName, data = {}) => {
            if (!object.hints[categoryName]) {
                object.hints[categoryName] = {};
            }
            Object.assign(object.hints[categoryName], data);
        };
    }

    onDetach(object) {
        // Remove glue methods
        delete object.setHint;
        delete object.getHint;
        delete object.removeHint;
        delete object.mergeHints;
        delete object.addHintCategory;

        // We do NOT delete object.hints — it belongs to the object.
    }
}
