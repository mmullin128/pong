import { Vector2 } from "../Vector/Vector.js";
export class Player {
    static scale = 10;
    static defaultDim = {
        x: .2,
        y: .2
    }
    constructor(length,width,pos,vel,rotation,rotationVel) {
        this.vertices = [
            new Vector2(pos.x+length/2,pos.y+width/2),
            new Vector2(pos.x-length/2,pos.y+width/2),
            new Vector2(pos.x-length/2,pos.y-width/2),
            new Vector2(pos.x+length/2,pos.y-width/2)
        ];
        this.length = length;
        this.width = width;
        this.pos = pos;
        this.vel = vel;
        this.rotation = rotation;
        this.rotationVel = rotationVel;
    }
    static create(dim,pos) {
        if (!dim) dim = this.defaultDim;
        return new Player(dim.x*this.scale,dim.y*this.scale,pos,new Vector2(0,0),0,0) 
    }
    static A(player,t) {
        return player.rotation + player.rotationVel*t
    }
    static P(player,t) {
        return Vector2.add(player.pos,Vector2.scale(player.vel,t));
    }
    static p(player,point,t) {
        const dPv = Vector2.scale(player.vel,t);
        const p0 = Vector2.subtract(point,player.pos);
        const v = Vector2.scale(Vector2.perp(p0),player.rotationVel);
        const dPr = Vector2.subtract(Vector2.F_rotate(v,player.rotationVel,t),Vector2.F_rotate(v,player.rotationVel,0));
        if (player.rotationVel == 0) {
            return Vector2.add(point,dPv);
        }
        const dP = Vector2.add(dPv,dPr);
        return Vector2.add(point,dP);
    }
    static v(player,point,t) {
        if (player.rotationVel == 0) return new Vector2(0,0);
        const p0 = Vector2.subtract(point,player.pos);
        const v0 = Vector2.scale(Vector2.perp(p0),player.rotationVel);
        const vR = Vector2.rotate(v0,player.rotationVel*t);
        const v = Vector2.add(player.vel,vR);
        return v;
    }
    static integrate(player,dT) {
        player.rotation = Player.A(player,dT);
        player.pos = Player.P(player,dT);
        for (let i=0; i<player.vertices.length; i++) {
            player.vertices[i] = Player.p(player,player.vertices[i],dT);
        }
    }
}

export function test() {
    let t = 0;
    const dT = .1;
    const player = Player.create(0,new Vector2(0,0));
    player.vel = new Vector2(0,1);
    player.rotationVel = -2*Math.PI;
    for (let i=0; i<10; i++) {
        t += dT;
        Player.integrate(player,dT);
        //console.log(player.pos,player.vel);
        console.log("=========");
        console.log(t);
        console.log(player.vertices[0]);
        console.log(Vector2.mod(player.vertices[0]));
        //console.log(Vector2.mod(player.pos));
    }
    
}

//test();