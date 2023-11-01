import { Ball } from "./Ball.js";
import { Boundary } from "./Boundary.js";
import { Player } from "./Player.js";

export class FrameBuffer extends Array {
    constructor(startTime,objects) {
        super();
        this.workingFrame = new Frame(startTime,objects);
        this.push(this.workingFrame);
    };
    clear(t) {
        if (this.length == 1) {
            this.workingFrame.integrate(t-this[0].time);
            return;
        }
        let i = 1;
        while (i<this.length && this[i].time < t) {
            const dt = (this[i].time - this[i-1].time);
            this.workingFrame.integrate(dt);
            if (this[i] instanceof EventFrame) {
                this.workingFrame.objects[this[i].objectId].vel = this[i].velocity;
                this.workingFrame.objects[this[i].objectId].rotationVel = this[i].rotationVel;
            }
            this.splice(i,1);
        }
        this.workingFrame.integrate(t-this[0].time);
    }
    integrate(t) {
        console.log(this.length);
        const { objectId, collisionTime, collisionBoundary, collisionPoint } = this.workingFrame.getNextCollision();
        //console.log(t, collisionTime, this.workingFrame.time);
        //console.log('i',this.workingFrame);
        const dt = t-this.workingFrame.time;
        if (collisionTime < dt) {
            console.log('collision');
            this.clear(this.workingFrame.time+collisionTime);
            this.workingFrame.objects[objectId].collide(collisionBoundary,collisionPoint);
            this.integrate(t);
            return;
        }
        this.clear(t);
    }
    add(frame) {
        let l;
        for (let i=0; i<this.length; i++) {
            const existingFrame = this[i];
            if (frame.time < existingFrame.time) {
                l = i;
                break;
            }
        }
        if (l == undefined) l = this.length;
        this.splice(l,0,frame);
        return;
    }
}

export class Frame {
    constructor(time,objects) {
        this.time = time;
        this.objects = objects;
    }
    getNextCollision() {
        let objectId = null;
        let collisionTime = 100;
        let collisionPoint = null;
        let collisionBoundary = null;
        for (let obj1 of Object.values(this.objects)) {
            for (let obj2 of Object.values(this.objects)) {
                if (obj1.id == obj2.id) continue;
                if (obj1 instanceof Ball && obj2 instanceof Player) {
                    let leastTime = 100;
                    let boundaryPoint = null;
                    let playerBoundary = null
                    for (let boundary of obj2.boundaries) {
                        const {t, point} = obj1.getCollision(boundary);
                        if (t < leastTime) {
                            leastTime = t;
                            boundaryPoint = point;
                            playerBoundary = boundary
                        }
                    }
                    if (leastTime < collisionTime) {
                        objectId = obj1.id;
                        collisionPoint = boundaryPoint;
                        collisionTime = leastTime;
                        collisionBoundary = playerBoundary;
                    }
                }
                if (obj1 instanceof Ball && obj2 instanceof Boundary) {
                    const {t, point} = obj1.getCollision(obj2);
                    if (t < collisionTime) {
                        objectId = obj1.id;
                        collisionPoint = point;
                        collisionTime = t;
                        collisionBoundary = obj2;
                    }
                }
            }
        }
        return { objectId: objectId, collisionTime: collisionTime, collisionBoundary: collisionBoundary, collisionPoint: collisionPoint};
    }
    integrate(dTSeconds) {
        for (let obj of Object.values(this.objects)) {
            if (obj instanceof Ball) {
                Ball.integrate(obj,dTSeconds);
            } else if (obj instanceof Player) {
                Player.integrate(obj,dTSeconds);
            }
        }
        this.time += dTSeconds;
    }
}

export class EventFrame {
    constructor(time,objectId,velocity,rotationVel) {
        this.time = time;
        this.objectId = objectId;
        this.velocity = velocity;
        this.rotationVel = rotationVel;
    }
}


export async function test() {
    const buffer = new FrameBuffer();
    for (let i=0; i<100; i++) {
        const r = (Math.random())*100;
        const f = new Frame(r,{});
        buffer.add(f);
    }
    console.log(await buffer.get());
}
