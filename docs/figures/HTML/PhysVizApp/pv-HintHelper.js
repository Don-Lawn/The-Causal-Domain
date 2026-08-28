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
    static mergeHints(defaults = {}, overrides = {}) {
        const result = {
            semantic: {},
            geometric: {},
            render: {}
        };

        // Deep merge each layer independently.
        result.semantic  = HintHelper.deepMerge(defaults.semantic  || {}, overrides.semantic  || {});
        result.geometric = HintHelper.deepMerge(defaults.geometric || {}, overrides.geometric || {});
        result.render    = HintHelper.deepMerge(defaults.render    || {}, overrides.render    || {});

        return result;
    }


    static deepMerge(target, override) {
        if (override === null || typeof override !== "object" || Array.isArray(override)) {
            return override;
        }

        if (target === null || typeof target !== "object" || Array.isArray(target)) {
            target = {};
        }

        for (const key of Object.keys(override)) {
            const overVal = override[key];
            const tgtVal = target[key];

            if (
                typeof overVal === "object" &&
                overVal !== null &&
                !Array.isArray(overVal) &&
                typeof tgtVal === "object" &&
                tgtVal !== null &&
                !Array.isArray(tgtVal)
            ) {
                target[key] = HintHelper.deepMerge(tgtVal, overVal);
            } else {
                target[key] = overVal;
            }
        }

        return target;
    }



    // ------------------------------------------------------------
    // isPlainObject(obj)
    // ------------------------------------------------------------
    static isPlainObject(obj) {
        return obj && typeof obj === "object" && !Array.isArray(obj);
    }


}
