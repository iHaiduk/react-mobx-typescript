import config, {logConfig, NODE_ENV} from "_serverConfig";
import * as http from "http";
import * as pino from "pino";
import application from "./server";

const log = pino({...logConfig, name: "Application"}, config.pretty);
const server = http.createServer(application.callback());

server.listen(config.port, config.hostname, () => {
    log.info(`Server running at http://${config.hostname}:${config.port}/`);
});

function clearDump() {
    try {
        global.gc();
    } catch (e) {
        if (NODE_ENV === "production") {
            log.warn("You must run program with 'node --expose-gc' or 'npm start'");
            process.exit();
        }
    }
}

if (NODE_ENV === "production") {
    setInterval(clearDump, 15000);
}
