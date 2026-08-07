// rr/coneEllipse/rr-coneEllipseAnimation3.js

function clamp01(value) {
    return Math.max(0, Math.min(1, value));
}

function createCone(state) {
    state.cone = {
        radiusBottom: state.R,
        radiusTop: 0,
        height: state.H,
        apex: { x: 0, y: 0, z: 0 },
        axis: { x: 0, y: 0, z: 1 }
    };
    return state.cone;
}

function createEllipseAtHeight(state, Z0 = state.Z0, k = state.k) {
    const safeH = Math.max(state.H, 0.0001);
    const safeZ0 = Math.max(0, Math.min(Z0, safeH));
    const safeK = clamp01(k);
    const samples = [];

    const a = (state.R / safeH) * safeZ0;
    const b = safeK * a;

    for (let i = 0; i <= state.ellipseSegments; i += 1) {
        const theta = (i / state.ellipseSegments) * Math.PI * 2;
        samples.push({
            x: a * Math.cos(theta),
            y: b * Math.sin(theta),
            z: safeZ0
        });
    }

    state.Z0 = safeZ0;
    state.k = safeK;
    state.ellipse = { a, b, z: safeZ0, samples };
    return state.ellipse;
}

function createMarker(state) {
    const marker = {
        radius: state.markerRadius,
        theta: 0,
        position: { x: 0, y: 0, z: state.Z0 }
    };
    state.marker = marker;
    return marker;
}

function animateMarkerOnEllipse(state, elapsedSeconds) {
    if (!state.ellipse) {
        createEllipseAtHeight(state, state.Z0, state.k);
    }

    const theta = state.omega * elapsedSeconds;
    const x = state.ellipse.a * Math.cos(theta);
    const y = state.ellipse.b * Math.sin(theta);
    const z = state.ellipse.z;

    state.marker.theta = theta;
    state.marker.position = { x, y, z };
}

function registerAnimation3(overrides = {}) {
    const state = {
        R: overrides.R ?? 1.6,
        H: overrides.H ?? 2.5,
        Z0: overrides.Z0 ?? 1.3,
        k: overrides.k ?? 0.72,
        omega: overrides.omega ?? 1.2,
        ellipseSegments: overrides.ellipseSegments ?? 128,
        markerRadius: overrides.markerRadius ?? 0.055,
        elapsedSeconds: 0,
        cone: null,
        ellipse: null,
        marker: null
    };

    createCone(state);
    createEllipseAtHeight(state, state.Z0, state.k);
    createMarker(state);
    animateMarkerOnEllipse(state, 0);

    function update(dtMs) {
        const seconds = (dtMs || 0) / 1000;
        state.elapsedSeconds += seconds;
        animateMarkerOnEllipse(state, state.elapsedSeconds);
    }

    function setParams(overridesNext = {}) {
        Object.entries(overridesNext).forEach(([key, value]) => {
            if (key in state) {
                state[key] = value;
            }
        });

        createCone(state);
        createEllipseAtHeight(state, state.Z0, state.k);
        if (!state.marker) {
            createMarker(state);
        }
        animateMarkerOnEllipse(state, state.elapsedSeconds);
    }

    return {
        state,
        update,
        setParams,
        createCone: () => createCone(state),
        createEllipseAtHeight: (Z0, k) => createEllipseAtHeight(state, Z0, k),
        createMarker: () => createMarker(state),
        animateMarkerOnEllipse: () => animateMarkerOnEllipse(state, state.elapsedSeconds)
    };
}

export {
    createCone,
    createEllipseAtHeight,
    createMarker,
    animateMarkerOnEllipse,
    registerAnimation3
};
