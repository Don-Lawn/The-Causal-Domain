// physVizApp.js
// Generic multi-domain orchestrator for PhysViz.
// No THREE references. Pearl handles rendering.

export class PhysVizApp {

    constructor(pearl) {
        this.pearl = pearl;
        this.domains = [];
        this.lastTime = performance.now();
    }

    addDomain(domain) {
        this.domains.push(domain);
    }

    update(dt) {
        for (const domain of this.domains) {
            domain.update(dt);
        }
    }

    render() {
        for (const domain of this.domains) {
            domain.render(this.pearl);
        }

        // Pearl performs the final composite render
        this.pearl.finalRender();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const now = performance.now();
        const dt = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.update(dt);
        this.render();
    }
}
