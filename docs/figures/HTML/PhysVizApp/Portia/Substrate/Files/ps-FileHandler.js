// ps-FileHandler.js

import fs from 'fs';

export class FileHandler
{
    constructor (filename) {
        this.filename = filename;
    }

    getCurrentWorkingDirectory() {
        return process.cwd();
    }
    
    readFileSync() {
        return fs.readFileSync(this.filename, 'utf8');
    }

    writeFileSync(content) {
        fs.writeFileSync(this.filename, content, 'utf8');
    }
}


