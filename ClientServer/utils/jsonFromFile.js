import  fs from 'fs';

const jsonFromFile = (pathToFile) => new Promise((resolve,reject) => {
    fs.readFile(pathToFile, "utf8", (err, jsonString) => {
        if (err) reject(err);
        else resolve(JSON.parse(jsonString));
    })
});

export default jsonFromFile;