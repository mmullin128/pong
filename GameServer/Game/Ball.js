import { Vector2 } from "../Vector/Vector.js";
import { Player } from "./Player.js";
export class Ball {
    constructor(size,pos,vel,rotation,rotationVel) {
        this.size = size;
        this.pos = pos;
        this.vel = vel;
        this.rotation = rotation;
        this.rotationVel = rotationVel; //rads per second change of velocity
    }
    static create(size,pos) {
        return new Ball(size,pos,new Vector2(0,0),0,0) 
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
    static collisionPointX(ball,x) {
        let t = 0;
        for (let i=0; i<15; i++) {
            let f = Math.abs(x-Ball.P(ball,t).x);
            if (f < .01) {
                return t;
            }
            let df = Math.abs(Ball.V(ball,t).x);
            if (df == 0) df = Vector2.mod(Ball.V(ball,t));
            let dt = f/df;
            t += dt;
        }
        return null;
    }
    static collisionPointY(ball,y) {
        let t = 0;
        for (let i=0; i<15; i++) {
            let f = Math.abs(y-Ball.P(ball,t).y);
            if (f < .01) {
                return t;
            }
            let df = Math.abs(Ball.V(ball,t).y);
            if (df == 0) df = Vector2.mod(Ball.V(ball,t));
            let dt = f/df;
            t += dt;
        }
        return null;
    }
    static collisionPointP(ball,player,point) { // returns 0 if currently colliding
        let t = 0;
        for (let i=0; i<15; i++) {
            let f = Vector2.distance(Ball.P(ball,t),Player.p(player,point,t)) - ball.size;
            if (f < 0.1) {
                return t;
            }
            let rV = Vector2.subtract(Ball.V(ball,t),Player.v(player,point,t));
            let df = Vector2.mod(rV);
            t += f/df;
        }
        return null;
    }
}

export function test() {
    const ball = Ball.create(5,new Vector2(1,0));
    ball.vel = new Vector2(0,1);
    ball.rotationVel = 2*Math.PI;
    for (let i=0; i<10; i++) {
        Ball.integrate(ball,.1);
        console.log(ball.pos,ball.vel);
        console.log(Vector2.mod(ball.pos));
    }
    
}

export function collisionTest() {
    const ball = Ball.create(5,new Vector2(0,0));
    ball.vel = new Vector2(0,1);
    ball.rotationVel = .1;
    const boundary = -10;
    const tC = Ball.collisionPointY(ball,boundary);
    console.log(tC);
    console.log(Ball.P(ball,tC));
}

export function collisionPTest() {
    const ball = Ball.create(5,new Vector2(0,10));
    ball.vel = new Vector2(0,1);
    ball.rotationVel = -.15;
    ball.size = 3;
    const player = Player.create(0,new Vector2(0,0));
    player.rotationVel = .1;
    player.vel = new Vector2(.7,1);
    console.log(Ball.collisionPointP(ball,player,player.vertices[0]));
}
