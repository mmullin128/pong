import { Vector2 } from "../Vector/Vector.js";
import { Ball } from "./Ball.js";
import { Boundary } from "./Boundary.js";
export class Player {
    static scale = 10;
    static defaultDim = {
        x: .2,
        y: .2
    }
    constructor(length,width,pos,vel,rotation,rotationVel,id) {
        this.vertices = [
            new Vector2(pos.x+length/2,pos.y+width/2),
            new Vector2(pos.x-length/2,pos.y+width/2),
            new Vector2(pos.x-length/2,pos.y-width/2),
            new Vector2(pos.x+length/2,pos.y-width/2)
        ];
        this.boundaries = [
            new Boundary(this.vertices[0],this.vertices[1],Player.v(this),Player.p(this)),
            new Boundary(this.vertices[1],this.vertices[2],Player.v(this),Player.p(this)),
            new Boundary(this.vertices[2],this.vertices[3],Player.v(this),Player.p(this)),
            new Boundary(this.vertices[3],this.vertices[0],Player.v(this),Player.p(this)),
        ];
        this.length = length;
        this.width = width;
        this.pos = pos;
        this.vel = vel;
        this.rotation = rotation;
        this.rotationVel = rotationVel;
        this.id = id;
    }
    static create(id,dim,pos) {
        if (!dim) dim = this.defaultDim;
        return new Player(dim.x*this.scale,dim.y*this.scale,pos,new Vector2(0,0),0,.1,id); 
    }
    static A(player,t) {
        return player.rotation + player.rotationVel*t
    }
    static P(player,t) {
        return Vector2.add(player.pos,Vector2.scale(player.vel,t));
    }
    static p(player) {
        return (point,t) => {
            const dPv = Vector2.scale(player.vel,t);
            const p0 = Vector2.subtract(point,player.pos);
            const v = Vector2.scale(Vector2.perp(p0),player.rotationVel);
            const dPr = Vector2.subtract(Vector2.F_rotate(v,player.rotationVel,t),Vector2.F_rotate(v,player.rotationVel,0));
            //console.log('p',t);
            if (player.rotationVel == 0) {
                return Vector2.add(point,dPv);
            }
            const dP = Vector2.add(dPv,dPr);
            return Vector2.add(point,dP);

        }
    }
    static v(player){
        return (point,t) => {
            if (player.rotationVel == 0) return new Vector2(0,0);
            const p0 = Vector2.subtract(point,player.pos);
            const v0 = Vector2.scale(Vector2.perp(p0),player.rotationVel);
            const vR = Vector2.rotate(v0,player.rotationVel*t);
            const v = Vector2.add(player.vel,vR);
            return v;
        }
    }
    static integrate(player,dT) {
        player.rotation = Player.A(player,dT);
        player.pos = Player.P(player,dT);
        for (let i=0; i<player.vertices.length; i++) {
            player.vertices[i] = Player.p(player,player.vertices[i],dT);
            player.boundaries[i] = player.boundaries[i].integrate(dT);
        }
    }
}

function test() {
    let t = 0;
    const dT = .1;
    const player = Player.create("p1",0,new Vector2(0,0));
    player.vel = new Vector2(0,1);
    //player.rotationVel = -2*Math.PI;
    player.rotationVel = .1;
    const ball = Ball.create("b1",5,{x: 0,y: 10});
    ball.vel = {x: 0, y: 0};
    ball.rotationVel = .1;
    const coll = ball.getCollision(player.boundaries[0]);
    ball.collide(player.boundaries[0],coll.point);
    console.log(ball);
    /*
    for (let i=0; i<10; i++) {
        const coll = ball.getCollision(player.boundaries[0]);
        console.log("coll",coll.t, coll.point);
        t += dT;
        Player.integrate(player,dT);
        Ball.integrate(ball,dT);
        //console.log(player.pos,player.vel);
        console.log("=========");
        //console.log(t);
        //console.log(player.vertices[0]);
        //console.log(Vector2.mod(player.vertices[0]));
        //console.log(Vector2.mod(player.pos));
    }
    */
}
