export const getServers = (request) => {return new Promise((resolve,reject) => {
    request('/getServers','GET')
    .catch(err => reject(err))
    .then(response => {
        resolve(response);
    })
})};