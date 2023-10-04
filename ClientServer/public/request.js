
export async function request(path,method,data) {
    const response = await fetch(path,{
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const message = await response.json();
    return message;
}