// ============================================================
// rr-domain.js — RR Ontology Layer (ES module)
// ============================================================
//
// Domain is pure RR. It receives Three.js groups created by Pearl.
// ============================================================

export function createDomain(scene, groups) {

    const { root, content } = groups;

    // Add root to the scene
    scene.add(root);

    return {
        scene,
        root,
        content,

        // Add RR objects to the domain
        add(obj) {
            content.add(obj);
        },

        // Domain-local transforms
        setOffset(x, y, z) {
            root.position.set(x, y, z);
        },

        rotate(rx, ry, rz) {
            root.rotation.set(rx, ry, rz);
        }
    };
}
