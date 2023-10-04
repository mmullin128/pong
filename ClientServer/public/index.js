import { render, renderHome, refreshRender, setStorage, getStorage, setButtonEvents, setCookie, getCookies, getCookie } from './docEvents.js'
import { reserveSpot } from './reserveSpot.js';
import { request } from './request.js';
import { Socket, connect } from './socketEvents.js';


export async function connectSocket(doc) {
    const splitURL = window.location.href.split("//");
    const socketURL = "ws://" + splitURL[1]
    const socket = await Socket(socketURL,
    [
        {
            "name": "checkUsername", 
            "handler": (socket,body) => {
                if (body.taken == true) {
                    render(doc,"username-alert");
                    setCookie(doc,"usernameTaken","1");
                    doc.getElementById("enter-username-btn").setAttribute("disabled","");
                } else {
                    setCookie(doc,"usernameTaken","0");
                    doc.getElementById("enter-username-btn").removeAttribute("disabled");
                }
            }
        },
        {
            "name": "disconnect",
            "handler": async (socket,body) => {
                const reserveResponse = await reserveSpot(request);
                setCookie(doc,"id",reserveResponse.id);
                setCookie(doc,"coll",reserveResponse.coll);
                console.log("disconnect",reserveResponse.id,reserveResponse.coll);
            }
        },
        {
            "name": "checkPrivateGame",
            "handler": (socket,body) => {
                console.log("checkPrivateGame", body);
            }
        },
        {
            "name": "success",
            "handler": (socket,body) => {
                console.log("success",body);
            }
        }
    ]);
    console.log('socket connect');
    return socket;
}

export async function authenticate(socket,doc) {
    const id = getCookie(doc,"id");
    const coll = getCookie(doc,"coll");
    console.log(id,coll);
    if (!(id == undefined || coll == undefined)) {
        await connect(socket,id,coll);
        return;
    } else {
        const reserveResponse = await reserveSpot(request);
        setCookie(doc,"id",reserveResponse.id);
        setCookie(doc,"coll",reserveResponse.coll);
        return;
    }
}

export async function start() {
    refreshRender(document);
    const socket = await connectSocket(document);
    await authenticate(socket,document);
    setButtonEvents(document,socket);
    //console.log(document.cookie);
}

start();