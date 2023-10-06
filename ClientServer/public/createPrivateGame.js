export const createPrivateGame = (gameSettings, request) => {return new Promise((resolve,reject) => {
    request('/createPrivateGame','POST',{ gameSettings: gameSettings })
    .catch(err => reject(err))
    .then(response => {
        resolve(response);
    })
})};