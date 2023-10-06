import { render, renderHome, refreshRender, setStorage, getStorage, setButtonEvents, setCookie, getCookies, getCookie } from './docEvents.js'
import { reserveSpot } from './reserveSpot.js';
import { request } from './request.js';
import { Socket, checkPrivateGame, connect } from './socketEvents.js';


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
                setCookie(doc,"status", "Idle");
                console.log("disconnect",reserveResponse.id,reserveResponse.coll);
            }
        },
        {
            "name": "checkPrivateGame",
            "handler": (socket,body) => {
                const teams = {
                    "A": doc.getElementById("side1"),
                    "N": doc.getElementById("side0"),
                    "B": doc.getElementById("side2")
                }
                for (let player of body.players) {
                    let playerElement = doc.getElementById(player.id);
                    if (playerElement == null) {
                        playerElement = doc.createElement("div");
                        playerElement.id = player.id;
                        playerElement.setAttribute("team",player.team);
                        playerElement.innerHTML = `${player.id}`;
                        teams[player.team].appendChild(playerElement);
                    } else {
                        if (playerElement.getAttribute("team") != player.team) {
                            console.log(playerElement.getAttribute("team"), player.team);
                            teams[playerElement.getAttribute("team")].removeChild(playerElement);
                            playerElement.setAttribute("team",player.team);
                            teams[player.team].appendChild(playerElement);
                        }
                    }
                }
                const id = getCookie(doc,"id");
                const gameID = getCookie(doc,"gameID");
                setTimeout(() => {
                    checkPrivateGame(socket,id,gameID);
                }, 50);
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