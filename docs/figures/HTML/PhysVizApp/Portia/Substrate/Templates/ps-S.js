//ps-ProcessTemplate.js

import { JSModule } from "../p-JSModule.js";
import { JsonFile } from "../p-FileJson.js";


export class TemplateProcessor {
    constructor(metafileName) {
        this.metadata = null;
        this.metafileName = metafileName;
    }

    _loadTemplate() {
        const fh = new JsonFile(this.metadata.templateFileName);
        this.metadata.templateContent = fh.readText();
    }

    _processTemplate() {
        this.code = this.metadata.templateContent;
        for (const [token, replacement] of Object.entries(this.metadata.templateSubstitutions)) {
            this.code = this.code.replaceAll(token, replacement);
        }
        return this.code;
    }

    _writeCode() {
        const fh = new JsonFile(this.metadata.outputFileName);
        fh.writeText(this.code);
    }

    run(metadata) {
        this.metadata = metadata;
        this._loadTemplate();
        this._processTemplate();
        this._writeCode();
        return this.code
    }

    runFromMetadataFile(fileName) {
        this.metafileName = fileName;
        const fh = new JsonFile(fileName);
        const metadataText = fh.readText();
        const metadata = fh.deserialise(metadataText);
        return this.runAndTest(metadata);
    };

    async test(metadata) {
        // Implement test logic here based on testMetadata
        console.log("Running tests with metadata:", metadata);
        const mod = new JSModule(metadata.outputFileName, metadata.type);
        await mod.load();

        const GeneratedClass = mod.module.default

        GeneratedClass.selfTestCreate(metadata);
    }

    async runAndTest(metadata) {
        this.run(metadata);
        await this.test(metadata);
    }

}