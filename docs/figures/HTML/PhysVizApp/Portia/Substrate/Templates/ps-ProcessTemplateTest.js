//ps-ProcessTemplateTest.js
import { processTemplate } from "./ps-ProcessTemplate.js";
import { FileHandler } from "../Files/ps-FileHandler.js";

const terminologyMap = {
    "%host%": "container",
    "%guest%": "content"
};
const terminologyMap2 = {
    "%host%": "aggregate",
    "%guest%": "partialObject"
};

const terminologyMap3 = {
    "%host%": "set",
    "%guest%": "element"
};

const extras = {
    "type": "Thing.Host.%host%",
    "name": "myContainer",
    "payload": {
    }
};
const extras2 = {
    "type": "Thing.Host.%host%",
    "name": "myAggregate",
    "payload": {    }
};
const extras3 = {
    "type": "Thing.Host.%host%",
    "name": "my %host% of %guest%s",
    "payload": {    }
};
console.log ("cwd =", process.cwd());
const fh = new FileHandler("F:/Projects/PhysViz/Portia/Substrate/Templates/TemplateForHost-Guest.txt");
const templateContent = fh.readFileSync();
const code = processTemplate(templateContent, terminologyMap, extras);
const fh2 = new FileHandler("F:/Projects/PhysViz/Portia/Substrate/ps-Container-Content-Mechanism.js");
fh2.writeFileSync(code);
const code2 = processTemplate(templateContent, terminologyMap2, extras2);
const fh3 = new FileHandler("F:/Projects/PhysViz/Portia/Substrate/ps-Aggregate-partialClass-Mechanism.js");
fh3.writeFileSync(code2);
const code3 = processTemplate(templateContent, terminologyMap3, extras3);
const fh4 = new FileHandler("F:/Projects/PhysViz/Portia/Substrate/ps-Set-Things-Mechanism.js");
fh4.writeFileSync(code3);

