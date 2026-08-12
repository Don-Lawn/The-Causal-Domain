// rr/coneEllipse/rr-coordinateSpaces.js

const RECIPROCAL_EPSILON = 1e-9;

function clampUnitInterval(value) {
    return Math.max(0, Math.min(1, value));
}

function reciprocal(value) {
    if (Math.abs(value) < RECIPROCAL_EPSILON) {
        return value >= 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }
    return 1 / value;
}

// Phenomenal (R-space) -> Causal (W-space)
// Wa = 1 / Rx
// Wb = 1 / Ry
// Q  = sqrt(1 - Z^2)
export function phenomenalToCausal(position = {}) {
    const rx = position.rx ?? position.x ?? 0;
    const ry = position.ry ?? position.y ?? 0;
    const z = position.z ?? 0;

    const wa = reciprocal(rx);
    const wb = reciprocal(ry);
    const q = Math.sqrt(clampUnitInterval(1 - z * z));

    return {
        wa,
        wb,
        q,
        x: wa,
        y: wb,
        z: q,
        wx: wa,
        wy: wb
    };
}

// Causal (W-space) -> Phenomenal (R-space)
// Rx = 1 / Wa
// Ry = 1 / Wb
// Z  = sqrt(1 - Q^2)  (positive branch)
export function causalToPhenomenal(position = {}) {
    const wa = position.wa ?? position.wx ?? position.x ?? 0;
    const wb = position.wb ?? position.wy ?? position.y ?? 0;
    const q = position.q ?? 0;

    const rx = reciprocal(wa);
    const ry = reciprocal(wb);
    const z = Math.sqrt(clampUnitInterval(1 - q * q));

    return {
        rx,
        ry,
        q,
        x: rx,
        y: ry,
        z
    };
}
