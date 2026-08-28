// pv-threePearl.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.164.0/examples/jsm/controls/OrbitControls.js";
import { PVHandle } from "./pv-handle.js";

import * as MeshFactory from "./ThreePearl/threePearlMeshFactory.js";
import * as PearlTrails from "./ThreePearl/threePearlTrails.js";
import * as PearlCamera from "./ThreePearl/threePearlCamera.js";
import * as PearlOverlay from "./ThreePearl/threePearlOverlay.js";
import * as PearlPrimitives from "./ThreePearl/threePearlPrimitives.js";
import * as PearlUtils from "./ThreePearl/threePearlUtils.js";


// ThreePearl
// Pure rendering engine: scene, camera, renderer, controls, primitives.
export class ThreePearl {
// NOTE: ThreePearl still contains several hard‑coded rendering constants
// (camera zoom, ortho half‑height, axis overlay sizes, trail defaults, etc.).
// These should eventually be replaced with values supplied via the hierarchical
// hints system so Domain/Semantic/Renderer layers can configure Pearl without
// modifying engine code.
//
// For now we add a `hints` parameter (currently unused) so the call signature
// is ready for migration. The actual hint‑driven replacements will be wired in
// later once Dispatch and RendererBase are fully modernised.

    constructor(canvas, domain, hints ={}) {
        this.canvas = canvas;
        this.myDomain = domain;

        
        // bind scattered functions to this instance makeTrianglePrism
        this.createPhaseWedgeMesh = MeshFactory.createPhaseWedgeMesh.bind(this);
        this.makeTriangularPrism = PearlPrimitives.makeTriangularPrism.bind(this);
        this.updateTrail = PearlTrails.updateTrail.bind(this);
        this.updateSimpleTrail = PearlTrails.updateSimpleTrail.bind(this);
        this.resetTrailCycleState = PearlTrails.resetTrailCycleState.bind(this);

        this.applyCamera = PearlCamera.applyCamera.bind(this);
        this._createAxisOverlay = PearlOverlay.createAxisOverlay.bind(this);
        this._createAxisLabelSprite = PearlOverlay.createAxisLabelSprite.bind(this);
        this._updateAxisOverlayPosition = PearlOverlay.updateAxisOverlayPosition.bind(this);


        this._toThreeZ = PearlUtils._toThreeZ.bind(this);
        this._updateOrthographicFrustum = PearlUtils._updateOrthographicFrustum.bind(this);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setScissorTest(true);

        // Scene
        this.scene = new THREE.Scene();

        // Camera + frustum parameters
        this.orthoHalfHeight = 2.5;
        this.cameraZoom = 1.0;
        this.axisOverlayLength = 1.4;
        this.axisOverlayMargin = 0.35;

        this.camera = new THREE.OrthographicCamera(
            -10, 10,
            10, -10,
            0.1, 1000
        );
        this.camera.position.set(0, 0, 5);
        this.camera.lookAt(0, 0, 0);
        this.camera.up.set(0, 1, 0);

        this._updateOrthographicFrustum();

        // Axis overlay
        this.axisOverlay = this._createAxisOverlay();
        this.scene.add(this.axisOverlay);

        // Controls
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableRotate = true;
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.enableDamping = false;
        this.controls.target.set(0, 0, 0);
        this._updateAxisOverlayPosition();

        this.initialCameraState = {
            position: this.camera.position.clone(),
            target: this.controls.target.clone(),
            up: this.camera.up.clone(),
            zoom: this.camera.zoom
        };

        // Root/content groups
        this.root = new THREE.Group();
        this.content = new THREE.Group();
        this.root.add(this.content);
        this.scene.add(this.root);

        // Light
        const light = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(light);


    }



    attachToDomain(handle) {
        this.content.add(handle.impl);
    }

    resolveHint(key, hints, defaults) {
        return hints.render?.[key]
            ?? hints.geometric?.[key]
            ?? hints.semantic?.[key]
            ?? defaults?.[key];
    }

    
    // Rendering
    render() {
        try {
    
            const rect = this.canvas.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            this.renderer.setSize(width, height, false);
            this._updateOrthographicFrustum(width, height);

            this.renderer.setViewport(0, 0, width, height);
            this.renderer.setScissor(0, 0, width, height);
            this.renderer.setScissorTest(true);

            this.controls.update();
            this.renderer.render(this.scene, this.camera); } catch (err) {
            console.error("Renderer error: in ThreePearl.render", err);
        }
    }
}
