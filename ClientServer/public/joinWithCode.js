export const joinWithCode = (gameID, playerID, coll, request) => {return new Promise((resolve,reject) => {
    request('/joinPrivateGame','POST', {gameID: gameID, id: playerID, coll: coll})
    .catch(err => reject(err))
    .then(response => {
        resolve(response);
    })
})};