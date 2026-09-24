// pv-domainCanvasExtension.js

import { BaseExtension } from "./pv-baseExtension.js";

export class DomainCanvasExtension extends BaseExtension {
    constructor({ panelId, canvasId }) {
        super("domainCanvas");
        this.panelId = panelId;
        this.canvasId = canvasId;
    }

    onAttach(domain) {
        const panel = document.getElementById(this.panelId);
        const canvas = document.getElementById(this.canvasId);

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        domain.canvas = canvas;
        domain.ctx = this.ctx;
    }

    onDetach(domain) {
        delete domain.canvas;
        delete domain.ctx;
    }
}
