// rr-pearl.js
// Renderer layer. Knows THREE.js. Provides primitives.
// Does NOT know semantic object types.
// @ts-ignore
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
// @ts-ignore
import { OrbitControls } from 'https://unpkg.com/three@0.164.0/examples/jsm/controls/OrbitControls.js';




import { RRHandle } from './rr-handle.js';

export class Pearl {

    constructor(canvas) {
        this.canvas = canvas;

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });

        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setScissorTest(true);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Shared orthographic camera
        this.camera = new THREE.OrthographicCamera(
            -2, 2,
             2, -2,
            0.1, 10
        );

        this.camera.position.set(0, 0, 5);
        this.camera.lookAt(0, 0, 0);

        // Shared OrbitControls
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableRotate = true;
        this.controls.enablePan = true;
        this.controls.enableZoom = true;

        // Optional tuning
        this.controls.minZoom = 0.5;
        this.controls.maxZoom = 5;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
    }

    initialiseDomain(rect) {
        const scene = new THREE.Scene();

        const root = new THREE.Group();
        const content = new THREE.Group();
        root.add(content);

        scene.add(root);

        const light = new THREE.DirectionalLight(0xffffff, 1.0);
        light.position.set(5, 5, 5);
        scene.add(light);

        const payload = {
            scene,
            camera: this.camera,   // shared camera
            root,
            content
        };

        return new RRHandle(payload);
    }



 
    // ------------------------------------------------------------
    // Primitives
    // ------------------------------------------------------------

    makeCylinder(params) {
        const geom = new THREE.CylinderGeometry(
            params.radiusTop,
            params.radiusBottom,
            params.height,
            32
        );
        const mat = new THREE.MeshStandardMaterial({ color: params.color });
        const mesh = new THREE.Mesh(geom, mat);

        return new RRHandle(mesh);
    }

    makeCone(params) {
        const geom = new THREE.ConeGeometry(
            params.radius,
            params.height,
            32
        );
        const mat = new THREE.MeshStandardMaterial({ color: params.color });
        const mesh = new THREE.Mesh(geom, mat);

        return new RRHandle(mesh);
    }

    setPosition(handle, pos) {
        handle.impl.position.set(pos.x, pos.y, pos.z);
    }

    combine(handles) {
        const group = new THREE.Group();
        for (const h of handles) {
            group.add(h.impl);
        }
        return new RRHandle(group);
    }
    
    attachSemanticObjectToContent(semanticObject, data) {
        semanticObject.handle.semanticObject = semanticObject;
        data.content.add(semanticObject.handle.impl);
    }


    updateTrail(handle, threeData) {
        const scene = threeData.scene;

        // Emit ghost from ORIGINAL handle
        const ghost = handle.impl.clone(true);

        // Deep clone all child materials from ORIGINAL handle
        ghost.traverse((node) => {
            if (node.material) {
                node.material = node.material.clone();
                node.material.transparent = true;
                node.material.opacity = 1.0;
            }
        });

        scene.add(ghost);
        handle.trail.push(ghost);

        // Fade ghosts
        for (let i = handle.trail.length - 1; i >= 0; i--) {
            const ghost = handle.trail[i];

            ghost.traverse(node => {
                if (node.material) {
                    node.material.opacity += handle.semanticObject.fadeRate;
                }
            });

            // Check any child to see if opacity reached zero
            const firstChild = ghost.children[0];
            if (firstChild && firstChild.material.opacity <= 0) {
                scene.remove(ghost);
                handle.trail.splice(i, 1);
            }
        }
    }


    applyColorToComposite(handle, r, g, b) {
        const color = new THREE.Color(r, g, b);

        // handle.impl is a THREE.Group
        handle.impl.children.forEach(child => {
            if (child.material) {
                child.material.color.copy(color);
            }
        });
    }

    updateRect(rect) {
        const aspect = rect.width / rect.height;
        const size = 2; // your world scale

        this.camera.left   = -size * aspect;
        this.camera.right  =  size * aspect;
        this.camera.top    =  size;
        this.camera.bottom = -size;

        this.camera.updateProjectionMatrix();
    }


    // ------------------------------------------------------------
    // Rendering
    // ------------------------------------------------------------

    renderDomain(rect, data, objects) {
        this.renderer.setViewport(rect.x, rect.y, rect.width, rect.height);
        this.renderer.setScissor(rect.x, rect.y, rect.width, rect.height);
        this.renderer.setScissorTest(true);
        this.controls.update();

        this.renderer.render(data.scene, data.camera);
    }


    renderDomainToPNG(rect, domainHandle) {
        this.renderDomain(rect, domainHandle);
        return this.canvas.toDataURL("image/png");
    }
}
