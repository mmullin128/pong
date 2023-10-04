import { checkUsername, setUsername } from "./socketEvents.js";

import { createPrivateGame } from "./createPrivateGame.js";
import { request } from "./request.js";
import { joinWithCode } from "./joinWithCode.js";

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
    const divs = doc.getElementsByTagName('div');
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

export function setButtonEvents(doc,socket) {
    const playBtnElement = doc.getElementById("play-btn");
    const usernameInput = doc.getElementById("username-input");
    const privateGameBtn = doc.getElementById("private-game-btn");
    const createPrivateGameBtn = doc.getElementById("create-private-game-btn");
    const joinGameBtn = doc.getElementById("join-private-game-btn");
    const createGameBtn = doc.getElementById("create-game-btn");
    const usernameBtn = doc.getElementById("enter-username-btn");
    const chooseLoadoutBtn = doc.getElementById("choose-loadout-btn");

    playBtnElement.addEventListener("click", event => {
        render(doc,"username-alert");
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
        console.log(gameSettings);
        const createResponse = await createPrivateGame(gameSettings,request);
        const id = getCookie(doc,"id");
        const coll = getCookie(doc,"coll");
        const gameID = createResponse.id;
        const link = createResponse.link;
        setCookie(doc,"gameID", gameID);
        setCookie("link", link);
        const joinResponse = await joinWithCode(gameID,id,coll,request);
        render(doc, "lobby-menu");

    })

    usernameInput.addEventListener("input", event => {
        const username = usernameInput.value;
        const id = getCookie(doc,"id");
        const coll = getCookie(doc,"coll");
        setCookie(doc,"username",username);
        checkUsername(socket,id,coll,usernameInput.value);
    })
    usernameBtn.addEventListener("click", (event) => {
        const id = getCookie(doc,"id");
        const coll = getCookie(doc,"coll");
        const username = getCookie(doc,"username");
        setUsername(socket,id,coll,username);
        render(doc,"choose-loadout-menu");
    })
    chooseLoadoutBtn.addEventListener("clicl", () => {
        
    })
}