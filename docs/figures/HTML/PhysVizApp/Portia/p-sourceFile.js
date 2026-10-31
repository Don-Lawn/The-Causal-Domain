// p-JSsourceFile.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export class SourceFile 
{
    constructor(path, className ) {
        this.sourceFilePath = path;
        this.className = className;
    }

    async LoadSource (pathFileName) {    
        // Step 1: Resolve full path to class file
        if (!this.classFilePath) {
            this.classFilePath = path.resolve(__dirname, this.sourceFilePath);
        }

        // Step 2: Dynamically import the class
        if (!this.module) {
            this.module = await import(this.classFilePath);
        }

        // Step 3: Ensure default export is a class
        if (typeof this.module.default !== 'function') {
            throw new Error(`File ${metadata.classFile} does not export a class as default.`);
        }
    }


    async creatObject(pathFileName, className, params) {
        try {
            // Step 4: Create an object and manipulate it
            const obj = new this.module.default(params);
            return obj;

        } catch (err) {
            console.error("Error:", err.message);
        }
    }
}