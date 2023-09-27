export class NoSuchCollectionError extends Error {
    constructor(collectionName) {
        super(` Attempted to find: ${collectionName}`)
    }
}