// rr-TestApp.js
// A specific application built on top of PhysVizApp.
// Creates domains, configures layout, and registers them.

import { PhysVizApp } from "./physVizApp.js";
import { Domain } from "./rr-domain.js";

export class RRTestApp extends PhysVizApp {

    constructor(pearl) {
        super(pearl);

        // Get DOM elements
        const canvasABC = document.getElementById("rrCanvas");
        const panelABC  = document.getElementById("panelABC");

        const panelXYZ  = document.getElementById("panelXYZ");

        const panelABZ  = document.getElementById("panelABZ");

        // Create domains using your current signature
        const abc = new Domain(canvas, panelABC, pearl);
        const xyz = new Domain(canvas, panelXYZ, pearl);
        const abz = new Domain(canvas, panelABZ, pearl);

        // Layout rectangles (example values)
        abc.rect = { x: 0,   y: 0,   w: 400, h: 400 };
        xyz.rect = { x: 400, y: 0,   w: 400, h: 400 };
        abz.rect = { x: 0,   y: 400, w: 800, h: 400 };

        // Register domains with the app
        this.addDomain(abc);
        this.addDomain(xyz);
        this.addDomain(abz);

        // Optional: set initial FSM states
        abc.fsm.setState("Spinning");
        xyz.fsm.setState("Idle");
        abz.fsm.setState("DiskMode");
    }
}
