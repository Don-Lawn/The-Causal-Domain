// ---------------------------------------------------------------------------
// pv-domainExtension.js
// Generic domain capability for RR / PV / Q / Tempo objects
// ---------------------------------------------------------------------------

import { BaseExtension } from "./pv-baseExtension.js";

export class DomainExtension extends BaseExtension {
    constructor({
        domainName = "RR",
        domainVersion = 1,
        metadata = {}
    } = {}) {
        super("domain");

        this.domainName = domainName;
        this.domainVersion = domainVersion;
        this.metadata = { ...metadata };
    }

    onAttach(object) {

        // -------------------------------------------------------------------
        // Add domain metadata to unified hint bag
        // -------------------------------------------------------------------
        object.addHintCategory("domain", {
            name: this.domainName,
            version: this.domainVersion,
            ...this.metadata
        });

        // -------------------------------------------------------------------
        // Glue: domain getters/setters
        // -------------------------------------------------------------------
        object.getDomain = () => this.domainName;

        object.setDomain = (name) => {
            this.domainName = name;
            object.hints.domain.name = name;
        };

        object.getDomainMetadata = () => ({ ...this.metadata });

        object.setDomainMetadata = (meta) => {
            this.metadata = { ...meta };
            object.hints.domain = {
                name: this.domainName,
                version: this.domainVersion,
                ...this.metadata
            };
        };

        object.mergeDomainMetadata = (meta) => {
            Object.assign(this.metadata, meta);
            Object.assign(object.hints.domain, meta);
        };

        // -------------------------------------------------------------------
        // Optional domain lifecycle hooks
        // -------------------------------------------------------------------
        object.onDomainStart = () => {
            // Domain-specific startup behaviour
        };

        object.onDomainStop = () => {
            // Domain-specific shutdown behaviour
        };

        // -------------------------------------------------------------------
        // Optional domain event routing
        // -------------------------------------------------------------------
        if (object.on) {
            object.on("DOMAIN_START", () => object.onDomainStart());
            object.on("DOMAIN_STOP", () => object.onDomainStop());
        }
    }

    onDetach(object) {
        delete object.getDomain;
        delete object.setDomain;
        delete object.getDomainMetadata;
        delete object.setDomainMetadata;
        delete object.mergeDomainMetadata;
        delete object.onDomainStart;
        delete object.onDomainStop;

        delete object.hints.domain;
    }
}
