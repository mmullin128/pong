import { generateID } from "../../utils/idGenerators.js";
import { getCollectionMeta } from "./getCollectionMeta.js";
import { increment } from "./metaActions.js";
import { removePlayer } from "./removePlayer.js";

export async function addPlayer(mongoClient,collectionNum) {
    //adds player to appropriate collection recursively
    //add player to collection and increment meta
    const collectionData = await getCollectionMeta(mongoClient,"Players",collectionNum);
    if (collectionData.current < collectionData.max) {
        const id = generateID(4);
        const player = { id: id };
        const playersCollection = mongoClient.db("DB1").collection(collectionData.name);
        await playersCollection.insertOne(player);
        await increment(mongoClient,"Players",collectionData.name);
        const updatedCollectionData = await getCollectionMeta(mongoClient,"Players",collectionNum);
        if (updatedCollectionData.current > updatedCollectionData.max) {
            console.log('overflow', collectionData.name,id);
            await removePlayer(mongoClient,collectionData.name,id);
            return addPlayer(mongoClient,collectionNum+1);
        } else {
            return { id: id, collectionCode: collectionData.collectionCode};
        }
    } else {
        return addPlayer(mongoClient,collectionNum+1);
    }
}