export const createPrivateGame = (gameSettings, request) => {return new Promise((resolve,reject) => {
    request('/createPrivateGame','GET',gameSettings)
    .catch(err => reject(err))
    .then(response => {
        resolve(response);
    })
})};