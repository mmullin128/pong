export class NoSuchCollectionError extends Error {
    constructor(collectionName) {
        super(` Attempted to find: ${collectionName}`);
        this.name = "NoSuchCollectionError";
    }
}

export class InvalidIDError extends Error {
    constructor(type,id) {
        super(`Attempted to find: type:${type}, id:${id}`);
        this.name = "InvalidIDError";
    }
}

export class UsernameTakenError extends Error {
    constructor(username) {
        super(`${username}`);
        this.name = "UsernameTakenError";
    }
}

export class SocketTimeOutError extends Error {
    constructor(url,time) {
        super(`url: ${url}, timeOut: ${time}`);
        this.name = "SocketTimeOutError";
    }
}