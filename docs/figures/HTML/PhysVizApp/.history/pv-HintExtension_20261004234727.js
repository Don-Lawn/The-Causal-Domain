// ---------------------------------------------------------------------------
// pv-hintExtension.js (updated)
// Unified hint/parameter capability for any BaseObject
// ---------------------------------------------------------------------------

import { BaseExtension } from "./pv-baseExtension.js";

export class HintExtension extends BaseExtension {
    constructor(initialHints = {}) {
        super("hints");
        this.localHints = { ...initialHints };
    }

    onAttach(object)
    {
        object.setHint = function setHint(key, value)
        {
            object.hints[key] = value;
        };

        object.getHint = function getHint(key)
        {
            return object.hints[key];
        };

        object.removeHint = function removeHint(key)
        {
            delete object.hints[key];
        };

        object.mergeHints = function mergeHints(hintObj)
        {
            Object.assign(object.hints, hintObj);
        };
    }

    onDetach(object) {
        delete object.setHint;
        delete object.getHint;
        delete object.removeHint;
        delete object.mergeHints;
        delete object.addHintCategory;
    }
}
