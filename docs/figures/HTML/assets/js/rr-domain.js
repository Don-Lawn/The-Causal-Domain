// @ts-check
// ============================================================
// rr-domain.js — Domain: viewport manager + semantic dispatcher
// ============================================================

import { RRHandle } from './rr-handle.js';
import { RRObject } from './rr-object.js';

/**
 * @typedef {Object} ViewRect
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

export class Domain {

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {HTMLElement} panel
     * @param {import('./rr-pearl.js').Pearl} pearl
     */
    constructor(canvas, panel, pearl) {
        this.canvas = canvas;
        this.panel = panel;
        this.pearl = pearl;
        this.objects = [];


        /** @type {ViewRect} */
        this.rect = this.computeRect();

        /**
         * Opaque renderer payload (RRHandle wrapping PearlDomainData)
         * Domain never inspects .impl — only Pearl understands it.
         * @type {RRHandle}
         */
        /** 
         * @typedef {Object} DomainThreeData
         */

        /** @type {DomainThreeData} */
        this.myThreeData = pearl.initialiseDomain(this.rect).impl;

        /**
         * Semantic objects (RRObject subclasses)
         * @type {RRObject[]}
         */
        this.objects = [];

        this.name = "";
    }

    // ------------------------------------------------------------
    // Layout → rect packet
    // ------------------------------------------------------------

    computeRect() {
        const box = this.panel.getBoundingClientRect();
        const canvasBox = this.canvas.getBoundingClientRect();

        return {
            x: box.left - canvasBox.left,
            y: canvasBox.height - (box.bottom - canvasBox.top),
            width: box.width,
            height: box.height
        };
    }

    updateRect() {
        const panelRect = this.panel.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();

        const x = panelRect.left - canvasRect.left;
        const y = canvasRect.height - (panelRect.bottom - canvasRect.top);
        const w = panelRect.width;
        const h = panelRect.height;
        
        this.rect = { x, y, width: w, height: h };

        // Tell Pearl to update the camera projection for this viewport
        this.pearl.updateRect(this.rect);
    }

    // ------------------------------------------------------------
    // Add semantic objects
    // ------------------------------------------------------------

    /**
     * Add a semantic object (RRObject subclass) to this domain.
     * The semantic object already built its RRHandle using Pearl primitives.
     *
     * @param {RRObject} semanticObject
     * @returns {RRHandle}
     */
    addObject(semanticObject) {
        this.objects.push(semanticObject);
        this.pearl.attachSemanticObjectToContent(semanticObject, this.myThreeData);

        return semanticObject.handle;
    }

    // Convenience wrappers for old API
    addComposite(semanticObject) {
        return this.addObject(semanticObject);
    }

    // ------------------------------------------------------------
    // Semantic update loop
    // ------------------------------------------------------------

    update(dt) {
        for (const obj of this.objects) {
            obj.update(dt, this.myThreeData);
        }
    }

    // ------------------------------------------------------------
    // Rendering
    // ------------------------------------------------------------

    render() {
        this.updateRect();
        this.pearl.renderDomain(this.rect, this.myThreeData, this.objects);
    }

    toPNG() {
        this.updateRect();
        return this.pearl.renderDomainToPNG(this.rect, this.myThreeData);
    }

    async copyToClipboard() {
        const dataURL = this.toPNG();
        const res = await fetch(dataURL);
        const blob = await res.blob();
        await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
        ]);
    }
}
