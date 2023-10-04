import { startServer, closeServer } from "./server.js";

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;


startServer(PORT,URI)
.catch(err => {
    console.error(err);
    process.exit(1);
})
.then(() => {});