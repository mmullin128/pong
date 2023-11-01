
export class Vector2 {
    static zeroVector = { x: 0, y: 0};
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    static interp(v1,v2,c) {
        return Vector2.add(Vector2.scale(v1,(1-c)),Vector2.scale(v2,c));
    }
    static dot(v1, v2) {
        return v1.x*v2.x + v1.y*v2.y;
    }
    static negate(v) {return new Vector2(-v.x,-v.y); }
    static component(v1, v2) {
        const mod = Vector2.mod(v2);
        if (mod == 0) return {x: 0, y: 0};
        return Vector2.dot(v1,v2) / Vector2.mod(v2);
    }
    static project(v1, v2) {
        return Vector2.scale(v2,Vector2.component(v1,v2));
    }
    static normalize(v) {
        return Vector2.scale(v,1/Vector2.mod(v));
    }
    static add(v1,v2) {
        return new Vector2(v1.x+v2.x, v1.y+v2.y);
    }
    static subtract(v1,v2) {
        return new Vector2(v1.x-v2.x, v1.y-v2.y);
    }
    static mod(v) {
        return Math.hypot(v.x,v.y);
    }
    static distance(v1,v2) {
        return Math.hypot(v1.x-v2.x,v1.y-v2.y);
    }
    static normal
    static scale(v,s) {
        return new Vector2(v.x*s,v.y*s);
    }
    static rotate(v,a) {
        const x2 = Math.cos(a)*v.x - Math.sin(a)*v.y;
        const y2 = Math.sin(a)*v.x + Math.cos(a)*v.y;
        return new Vector2(x2,y2);
    }
    static F_rotate(v,r,t) {
        const dx = (1/r) * Math.sin(r*t) * v.x + (1/r) * Math.cos(r*t) * v.y;
        const dy = -(1/r) * Math.cos(r*t) * v.x + (1/r) * Math.sin(r*t) * v.y;
        return new Vector2(dx,dy);
    }
    static integrate(v,t) {
        return new Vector2(v.x*t,v.y*t);
    }
    static vFromAngle(a,r) {
        return new Vector2(r*Math.cos(a),r*Math.sin(a));
    }
    static PerpendicularClockwise(v) {
        return new Vector2(v.y,-v.x);
    }
    static PerpendicularCounterClockwise(v) {
        return new Vector2(-v.y,v.x);
    } 
    static perp(v) {
        return this.PerpendicularCounterClockwise(v);
    }
    static mag(v) {
        return Math.hypot(v.x,v.y);
    }
    static random(r) {
        const x = (Math.random()*2-1)*r;
        const y = (Math.random()*2-1)*r;
        return new Vector2(x,y);
    }
}
