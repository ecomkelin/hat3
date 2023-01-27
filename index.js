require("./bin/env")

const koaServer = require("./bin/server/koaServer");

const SERVER_PORT = process.env.SERVER_PORT || 8000;
koaServer.listen(SERVER_PORT, () => {
    console.info(`[ ======= ${process.env.SERVER_NAME || "HLT"} Start on: http://localhost:${SERVER_PORT} ======= ]`);
});