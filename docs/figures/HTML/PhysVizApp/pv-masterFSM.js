// pv-master.js
import { ActiveEntity } from "./pv-activeEntity.js";
import EventBusInstance from "./pv-eventBus.js";


export class MasterFSM extends ActiveEntity {

    constructor() {
        super("MASTER", null);   // Master listens on MASTER, no parent
        this.configureDefaultLifecycle();
        this.lastTime = performance.now();
        this.animationLoop = this.animationLoop.bind(this);
        
        this.fsm.on("READY", "START", () => {
            this.lastTime = performance.now();
            this.animationLoop(performance.now());
        });
    }

    animationLoop(now) {
        if (this.fsm.state === "STOPPED") {
            return;
        }

        const dt = now - this.lastTime;
        this.lastTime = now;

        if (this.fsm.state === "ACTIVE") {
            EventBusInstance.emit("TICK", { dt }, "MASTER", "MASTER.animationLoop");
        }

        EventBusInstance.emit("RENDER", { dt }, "MASTER", "MASTER.animationLoop");
        requestAnimationFrame(this.animationLoop);
    }
}



