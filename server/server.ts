import logger from "_server/utils/logger";
import config, {logConfig, NODE_ENV} from "_serverConfig";
import * as Koa from "koa";
import * as Router from "koa-router";
import {resolve} from "path";
import * as pino from "pino";
import routing from "./router";

const log = pino({...logConfig, name: "Server"}, config.pretty);
const app = new Koa();

if (NODE_ENV === "production") {
    app.use(logger({logPino: log}));
}

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        log.error(error);
        ctx.body = error;
        return ctx.status = error.status || 500;
    }
});

if (typeof process.env.STATIC_PATH === "string") {
    const serve = require("koa-static");
    const staticPath = resolve(process.env.STATIC_PATH);
    log.info("Public folder:", staticPath);
    app.use(serve(staticPath));
}

routing.call(routing, app, new Router());

export default app;
