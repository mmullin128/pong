
const chars = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
export function generateID(n,first) {
    let id = '';
    let rIndex;
    if (first) {
        id = first;
        n -= 1;
    }
    for (let i=0;i<n;i++) {
        rIndex = Math.floor(Math.random()*26);
        id = id + chars[rIndex];
    }
    return id;
}