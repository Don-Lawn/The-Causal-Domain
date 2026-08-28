   // Primitives
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { PVHandle } from "../../PhysVizApp/pv-handle.js";

export function makeCylinder(params) {
        const geom = new THREE.CylinderGeometry(
            params.radiusTop,
            params.radiusBottom,
            params.height,
            32
        );
        const mat = new THREE.MeshBasicMaterial({ color: params.color });
        const mesh = new THREE.Mesh(geom, mat);
        return mesh;
    }

    export function makeCone(params) {
        const geom = new THREE.ConeGeometry(
            params.radius,
            params.height,
            32
        );
        const mat = new THREE.MeshBasicMaterial({ color: params.color });
        const mesh = new THREE.Mesh(geom, mat);
        return mesh;
    }

    export function makeSphere({ radius = 1, color = 0xffffff }) {
        const geometry = new THREE.SphereGeometry(radius, 32, 16);
        const material = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }

    export function makeBox({ width = 1, height = 1, depth = 1, color = 0xffffff }) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }

export function makeTriangularPrism(hints) {

    //deconstruct the hints we will use
    const { width, height, depth, color, triangleType, rightAngleCorner } = hints;

    // build geometry using hints

    
        // ------------------------------------------------------------
        // 1. Define triangle vertices in 2D
        // ------------------------------------------------------------
        let A, B, C;

        if (triangleType === "right") {
            switch (rightAngleCorner) {
                case "A":
                    A = new THREE.Vector3(0, 0, 0);
                    B = new THREE.Vector3(width, 0, 0);
                    C = new THREE.Vector3(0, height, 0);
                    break;

                case "B":
                    B = new THREE.Vector3(0, 0, 0);
                    A = new THREE.Vector3(-width, 0, 0);
                    C = new THREE.VectorVector3(0, height, 0);
                    break;

                case "C":
                    C = new THREE.Vector3(0, 0, 0);
                    A = new THREE.Vector3(0, -height, 0);
                    B = new THREE.Vector3(width, 0, 0);
                    break;
            }
        }

        // ------------------------------------------------------------
        // 2. Extrude along Z by depth (explicit, not via ExtrudeGeometry)
        // ------------------------------------------------------------
        const D = new THREE.Vector3(0, 0, depth);

        const A2 = A.clone().add(D);
        const B2 = B.clone().add(D);
        const C2 = C.clone().add(D);

        // ------------------------------------------------------------
        // 3. Build geometry manually
        // ------------------------------------------------------------
        const geometry = new THREE.BufferGeometry();

        // 12 vertices → 6 faces → 12 triangles
        const vertices = [
            // Bottom face
            A.x, A.y, A.z,
            B.x, B.y, B.z,
            C.x, C.y, C.z,

            // Top face
            A2.x, A2.y, A2.z,
            B2.x, B2.y, B2.z,
            C2.x, C2.y, C2.z,

            // Side faces (two triangles each)
            // A → B → B2 → A2
            A.x, A.y, A.z,
            B.x, B.y, B.z,
            B2.x, B2.y, B2.z,

            A.x, A.y, A.z,
            B2.x, B2.y, B2.z,
            A2.x, A2.y, A2.z,

            // B → C → C2 → B2
            B.x, B.y, B.z,
            C.x, C.y, C.z,
            C2.x, C2.y, C2.z,

            B.x, B.y, B.z,
            C2.x, C2.y, C2.z,
            B2.x, B2.y, B2.z,

            // C → A → A2 → C2
            C.x, C.y, C.z,
            A.x, A.y, A.z,
            A2.x, A2.y, A2.z,

            C.x, C.y, C.z,
            A2.x, A2.y, A2.z,
            C2.x, C2.y, C2.z
        ];

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(vertices, 3)
        );

        geometry.computeVertexNormals();

        // ------------------------------------------------------------
        // 4. Center geometry around origin
        // ------------------------------------------------------------
        geometry.computeBoundingBox();
        const box = geometry.boundingBox;
        const center = new THREE.Vector3();
        box.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);

        // ------------------------------------------------------------
        // 5. Build mesh
        // ------------------------------------------------------------
        const material = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }


    export function combine(handles) {
        const group = new THREE.Group();
        for (const h of handles) group.add(h.impl);
        return group;
    }