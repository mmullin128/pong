export class NoSuchCollectionError extends Error {
    constructor(collectionName) {
        super(` Attempted to find: ${collectionName}`)
    }
}

export class InvalidIDError extends Error {
    constructor(type,id) {
        super(`Attempted to find: type:${type}, id:${id}`);
    }
}

export class UsernameTakenError extends Error {
    constructor(username) {
        super(`${username}`);
    }
}