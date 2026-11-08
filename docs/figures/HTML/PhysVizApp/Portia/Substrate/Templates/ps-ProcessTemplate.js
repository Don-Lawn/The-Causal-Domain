//ps-ProcessTemplate.js

export function processTemplate(templateContent, terminologyMap, extras) {
    let code = templateContent;
    for (const [token, replacement] of Object.entries(terminologyMap)) {
        code = code.replaceAll(token, replacement);
    }
    return code;
}
