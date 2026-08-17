// pv-HintHelper.js
// Pure utility module: no ThreePearl-specific logic.

export class HintHelper {

    // ------------------------------------------------------------
    // buildHintDispatch(tpInstance)
    // ------------------------------------------------------------
    // Scans the prototype of the ThreePearlDispatch instance and
    // auto-wraps any method named setSomething(handle, hints).
    //
    // IMPORTANT:
    // This does NOT apply engine semantics. It only builds a table
    // mapping "scaleX" → tpInstance.setScaleX(handle, hints).
    //
    // ThreePearlDispatch decides how to interpret the hints.
    // ------------------------------------------------------------
    static buildHintDispatch(tpInstance) {
        const dispatch = {};
        const proto = Object.getPrototypeOf(tpInstance);

        for (const key of Object.getOwnPropertyNames(proto)) {
            const fn = proto[key];

            // Only wrap methods named "setSomething" with (handle, hints)
            if (!key.startsWith("set")) continue;
            if (typeof fn !== "function") continue;
            if (fn.length !== 2) continue; // must be (handle, hints)

            // Convert setScaleX → scaleX
            const hintName = key.slice(3); // remove "set"
            const camel = hintName.charAt(0).toLowerCase() + hintName.slice(1);

            // Generic wrapper: ThreePearlDispatch decides how to interpret "value"
            dispatch[camel] = (handle, value) => {
                tpInstance[key](handle, value);
            };
        }

        return dispatch;
    }


    // ------------------------------------------------------------
    // mergeHints(defaults, overrides)
    // ------------------------------------------------------------
    // Deep merges hierarchical hint objects.
    // Caller overrides always win.
    // ------------------------------------------------------------
    static mergeHints(defaults = {}, overrides = {}) {
        const result = {};

        for (const key of Object.keys(defaults)) {
            const defVal = defaults[key];
            const overVal = overrides[key];

            if (overVal !== undefined) {
                if (HintHelper.isPlainObject(defVal) && HintHelper.isPlainObject(overVal)) {
                    result[key] = HintHelper.mergeHints(defVal, overVal);
                } else {
                    result[key] = overVal;
                }
            } else {
                result[key] = defVal;
            }
        }

        for (const key of Object.keys(overrides)) {
            if (!(key in defaults)) {
                result[key] = overrides[key];
            }
        }

        return result;
    }


    // ------------------------------------------------------------
    // isPlainObject(obj)
    // ------------------------------------------------------------
    static isPlainObject(obj) {
        return obj && typeof obj === "object" && !Array.isArray(obj);
    }
}
