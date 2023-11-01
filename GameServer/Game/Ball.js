import { Vector2 } from "../Vector/Vector.js";
import { Boundary } from "./Boundary.js";
import { Player } from "./Player.js";
export class Ball {
    constructor(size,pos,vel,rotation,rotationVel,id) {
        this.size = size;
        this.pos = pos;
        this.vel = vel;
        this.rotation = rotation;
        this.rotationVel = rotationVel; //rads per second change of velocity
        this.id = id;
    }
    getCollision(boundary) {
        let t = 0;
        let dt;
        for (let i=0; i<8; i++) {
            const currentPos = Ball.P(this,t);
            const currentVel = Ball.V(this,t);
            const closest = boundary.integrate(t).getClosestPoint(currentPos);
            const boundaryVel = boundary.getRelativeVelocity(currentPos,t);
            const d = Vector2.subtract(closest,currentPos);
            const df = Vector2.component(currentVel,d) - Vector2.component(boundaryVel,d);
            const f = Vector2.mod(d)-this.size;
            //console.log(i, f, df);
            //console.log(i,currentVel,boundaryVel,d);
            //console.log(i,closest);
            if (f < .01 && f > -.01) {
                if (t < 0) return {t: 100, point: null}; //return max time if ball must go back in time to collide
                return {t: t, point: closest};
            }
            dt = f/df;
            t += dt;
        }
        return {t: 100, point: null}; //return max if couldn't resolve
    }
    collide(boundary,point) {
        const d = Vector2.subtract(this.pos,point);
        const impDirection = Vector2.normalize(d);
        const posCorrection = this.size - Vector2.mod(d) + 1;
        console.log('c', posCorrection);
        const dP = Vector2.scale(impDirection,posCorrection);
        this.pos = Vector2.add(this.pos,dP);
        const velComponent = -Vector2.component(this.vel,impDirection);
        const velCorrection = Vector2.scale(impDirection,2*velComponent);
        this.vel = Vector2.add(this.vel,velCorrection);
        this.vel = Vector2.add(this.vel,boundary.getRelativeVelocity(point,0));
    } 
    static create(id,size,pos) {
        return new Ball(size,pos,new Vector2(0,0),0,0,id); 
    }
    static V(ball,t) {
        return Vector2.rotate(ball.vel,ball.rotationVel*t);
    }
    static P(ball,t) {
        if (ball.rotationVel == 0) {
            return Vector2.add(ball.pos,Vector2.scale(ball.vel,t));
        }
        const dP = Vector2.subtract(Vector2.F_rotate(ball.vel,ball.rotationVel,t),Vector2.F_rotate(ball.vel,ball.rotationVel,0));
        return Vector2.add(ball.pos,dP);
    }
    static integrate(ball,dT) {
        ball.vel = Ball.V(ball,dT);
        ball.pos = Ball.P(ball,dT);
    }
}


function collisionTest() {
    const ball = Ball.create("b1",5,new Vector2(0,10));
    ball.vel = new Vector2(0,0);
    ball.rotationVel = .1;
    const boundary = new Boundary({x: -10, y: 0},{x: 10, y: 0},
        (point,t) => {
            return {x: 1, y: 1};
        }, 
        (t) => {
            return {x: 1*t, y: 1*t};
        });
    const tC = ball.getCollision(boundary);
    console.log(tC);
}

//collisionTest();