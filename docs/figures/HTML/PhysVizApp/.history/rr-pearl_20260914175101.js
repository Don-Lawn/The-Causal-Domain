export const pearl = {
    renderer: {
        getContext: () => ({
            VIEWPORT: 0,
            SCISSOR_BOX: 0,
            SCISSOR_TEST: 0,
            isEnabled: () => false,
            getParameter: () => 0,
            viewport: () => undefined,
            scissor: () => undefined,
            enable: () => undefined,
            disable: () => undefined,
            readPixels: () => undefined
        })
    },
    canvas: { height: 0 },
    renderAll: () => undefined
};

export class Pearl {}
export default pearl;
