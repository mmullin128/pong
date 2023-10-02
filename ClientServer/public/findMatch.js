export const findMatch = (id, coll, request) => {return new Promise((resolve,reject) => {
    request('/findMatch','POST', {id: id, coll: coll})
    .catch(err => reject(err))
    .then(response => {
        resolve(response);
    })
})};