export const reserveSpot = (request) => {return new Promise((resolve,reject) => {
    request('/reserveSpot','GET')
    .catch(err => reject(err))
    .then(response => {
        resolve(response);
    })
})};