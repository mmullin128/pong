import { addPlayerData, checkPrivateGame, checkUsername, chooseTeam, readyUp, setUsername } from "./socketEvents.js";

import { createPrivateGame } from "./createPrivateGame.js";
import { request } from "./request.js";
import { joinWithCode } from "./joinWithCode.js";
import { findMatch } from "./findMatch.js";

export function render(doc,id) {
    //derender currently showing (except id element)
    const showing = doc.getElementsByClassName("showing");
    for (let element of showing) {
        if (element.id == id) continue;
        element.classList.remove("showing");
        element.classList.add("hidden");
    }
    //render element with id
    const renderElement = document.getElementById(id);
    renderElement.classList.add("showing");
    renderElement.classList.remove("hidden");
}
export function refreshRender(doc) {

    const divs = doc.querySelectorAll("body > div"); //child combinator only selects top level divs
    for (let element of divs) {
        if (element.classList.contains("showing")) continue;
        element.classList.add("hidden");
    }
}

export function renderHome(doc) {
    const divs = doc.getElementsByTagName('div');
    for (let element of divs) {
        if (element.id == "main-menu") continue
        element.classList.add("hidden");
    }
    console.log("rendering home");
    render(doc,"main-menu");
}

export function setCookie(doc,key,value) {
    let cookies = getCookies(doc);
    cookies[key] = value;
    writeCookies(doc,cookies);
}

export function getCookie(doc,key) {
    let cookies = getCookies(doc);
    return cookies[key];
}

export function writeCookies(doc,cookies) {
    let cookieString = '';
    for (let key in cookies) {
        cookieString = `${key}=${cookies[key]}; `;
        doc.cookie = cookieString;
    }
}

export function getCookies(doc) {
    let cookies = {};
    //console.log(doc.cookie);
    const lines = doc.cookie.split("; ");
    for (let line of lines) {
        const keyValuePair = line.split('=');
        if (keyValuePair.length > 1) {
            cookies[keyValuePair[0]] = keyValuePair[1];
        }
    }
    return cookies;
}

export function setStorage(key,value) {
    localStorage.setItem(key,value);
}

export function getStorage(key) {
    const value = localStorage.getItem(key);
    if (!value) return undefined;
    return value;
}


export function changeTeam(doc,id,teamO,teamN) {

}

export function addToTeam(doc,id,team) {

}

export function removeFromTeam(doc,id,team) {

}



export function setButtonEvents(doc,socket) {
    const playBtnElement = doc.getElementById("play-btn");
    const usernameInput = doc.getElementById("username-input");
    const privateGameBtn = doc.getElementById("private-game-btn");
    const createPrivateGameBtn = doc.getElementById("create-private-game-btn");
    const joinGameBtn = doc.getElementById("join-private-game-btn");
    const createGameBtn = doc.getElementById("create-game-btn");
    const usernameBtn = doc.getElementById("enter-username-btn");
    const chooseLoadoutBtn = doc.getElementById("choose-loadout-btn");
    const side1 = doc.getElementById("side1");
    const side0 = doc.getElementById("side0");
    const side2 = doc.getElementById("side2");
    const readyBtn = doc.getElementById("ready-btn");

    playBtnElement.addEventListener("click", event => {
        render(doc,"username-alert");
        setCookie(doc,"gameMode","public");
        const savedName = getCookie(doc,"username");
        const id = getCookie(doc,"id");
        const coll = getCookie(doc,"coll");
        if (savedName) {
            if (id != undefined && coll != undefined) {
                usernameInput.value = savedName;
                checkUsername(socket,id,coll,savedName);
            }
        }
    });

    privateGameBtn.addEventListener("click", event => {
        setCookie(doc,"gameMode","private");
        render(doc,"private-game-menu");
    });

    createPrivateGameBtn.addEventListener("click", () => {
        render(doc,"create-game-menu");
    });

    joinGameBtn.addEventListener("click", () => {
        render(doc,"join-game-alert");
    });

    createGameBtn.addEventListener("click", async () => {
        const gameSettings = {
            max: parseInt(document.getElementById("players-num-input").value),
            abilitiesNum: parseInt(doc.getElementById("abilities-num-input").value),
            playerSpeed: parseInt(doc.getElementById("player-speed-input").value),
            playerSize: parseInt(doc.getElementById("player-size-input").value),
            ballSpeed: parseInt(doc.getElementById("ball-speed-input").value),
            ballSize: parseInt(doc.getElementById("ball-size-input").value),
            ballSpin: parseInt(doc.getElementById("ball-spin-input").value),
        }
        const createResponse = await createPrivateGame(gameSettings,request);
        const id = getCookie(doc,"id");
        const coll = getCookie(doc,"coll");
        const gameID = createResponse.id;
        const link = createResponse.link;
        setCookie(doc,"gameID", gameID);
        setCookie(doc,"link", link);
        const joinResponse = await joinWithCode(gameID,id,coll,request);
        setCookie(doc,"status","InLobby");
        render(doc, "choose-loadout-menu");
    })

    usernameInput.addEventListener("input", event => {
        const username = usernameInput.value;
        const id = getCookie(doc,"id");
        const coll = getCookie(doc,"coll");
        setCookie(doc,"username",username);
        checkUsername(socket,id,coll,usernameInput.value);
    });
    usernameBtn.addEventListener("click", (event) => {
        const id = getCookie(doc,"id");
        const coll = getCookie(doc,"coll");
        const username = getCookie(doc,"username");
        setUsername(socket,id,coll,username);
        render(doc,"choose-loadout-menu");
    });
    chooseLoadoutBtn.addEventListener("click", (event) => {
        const gameMode = getCookie(doc,"gameMode");
        const id = getCookie(doc,"id");
        const coll = getCookie(doc,"coll");
        const playerData = {
            speed: parseInt(document.getElementById("speed-input").value),
            length: parseInt(document.getElementById("length-input").value),
            turnSpeed: parseInt(document.getElementById("turn-speed-input").value)
        }
        addPlayerData(socket,id,coll,playerData);
        if (gameMode == "public") {
            render(doc,"loading-alert");
            findMatch(id,coll,request);
        }
        if (gameMode == "private") {
            const gameID = getCookie(doc,"gameID");
            setCookie(doc,"side","N");
            checkPrivateGame(socket,id,gameID);
            render(doc,"lobby-menu");
        }
    });

    side1.addEventListener("click", (event) => {
        const id = getCookie(doc,"id");
        const gameID = getCookie(doc,"gameID");
        //change side animation
        const currentSide = getCookie(doc,"side");
        setCookie(doc,"side","A");
        //
        chooseTeam(socket,id,gameID,"A");
    });
    side0.addEventListener("click", (event) => {
        const id = getCookie(doc,"id");
        const gameID = getCookie(doc,"gameID");
        //change side animation
        setCookie(doc,"side","N");
        //
        chooseTeam(socket,id,gameID,"N");
    });
    side2.addEventListener("click", (event) => {
        const id = getCookie(doc,"id");
        const gameID = getCookie(doc,"gameID");
        //change side animation
        setCookie(doc,"side","B");
        //
        chooseTeam(socket,id,gameID,"B");
    });
    readyBtn.addEventListener("click", (event) => {
        const id = getCookie(doc,"id");
        const coll = getCookie(doc,"coll");
        readyUp(socket,id,coll,1);
    });
}