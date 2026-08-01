// TestApp.js
import { PhysVizApp } from './pv-physVizApp.js';

export class TestApp extends PhysVizApp {
    constructor() {
        super();
    }

    init(canvasElement) {
        super.init(canvasElement);

        // custom nodes, components, patterns
        this.loadTestModel();
    }

    loadTestModel() {
        // your ActiveEntity, PVFSM, EventBus, etc.
    }

    startSimulation() {
        // custom simulation behavior
        super.startSimulation();
    }
}