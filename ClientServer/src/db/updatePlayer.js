import { getCollectionMeta } from "./getCollectionMeta.js";
export async function updatePlayer(mongoClient,collectionCode,id,playerData) {
    const collectionData = await getCollectionMeta(mongoClient,'Players',0,collectionCode);
    const playersCollection = mongoClient.db("DB1").collection(collectionData.name);
    await playersCollection.updateOne(
        {
            "id": id
        },
        {
            $set: {
                playerData: playerData
            }
        }
    )
}