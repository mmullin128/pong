
export const request = (path,method,data) => { 
    return new Promise((resolve,reject) => {
        fetch(path,
            {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        )
        .catch(err => reject(err))
        .then(response => {
            resolve(response.data);
        })
    })
}