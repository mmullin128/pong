import { Vector2 } from "../Vector/Vector.js";


export class Boundary {
    constructor(id,start, end, velocityFn, integrationFn) {
        this.start = start;
        this.end = end;
        if (!velocityFn) velocityFn = (point,t) => { return {x: 0, y: 0}};
        if (!integrationFn) integrationFn = (point,t) => {return {x: point.x, y: point.y}};
        this.velocityFn = velocityFn;
        this.integrationFn = integrationFn;
        this.id = id;
    }
    interpVelocity(t,c) {
        const v1 = this.velocityFn(this.start,t);
        const v2 = this.velocityFn(this.end,t);
        return Vector2.interp(v1,v2,c);
    }
    integrate(t) {
        const newStart = this.integrationFn(this.start,t);
        const newEnd = this.integrationFn(this.end,t);
        return new Boundary(this.id,newStart,newEnd,this.velocityFn,this.integrationFn);
    }
    getComponent(p) {
        const d = Vector2.subtract(p,this.start);
        const boundaryVector = Vector2.subtract(this.end,this.start);
        const component = Vector2.component(d,boundaryVector);
        return component;
    }
    getRelativeVelocity(p,t) {
        let c = this.getComponent(p) / Vector2.mod(Vector2.subtract(this.end,this.start));
        if (c < 0) c = 0;
        else if (c > 1) c = 1;
        return this.interpVelocity(t,c);
    }
    getClosestPoint(p) {
        const d = Vector2.subtract(p,this.start);
        const boundaryVector = Vector2.subtract(this.end,this.start);
        const boundaryDirection = Vector2.normalize(boundaryVector);
        const component = Vector2.component(d,boundaryVector);
        if (component < 0) return this.start;
        if (component > Vector2.mod(boundaryVector)) return this.end;
        const closest = Vector2.add(this.start,Vector2.scale(boundaryDirection,component));
        return closest;
    }
}