import * as Koa from "koa";
import * as Router from "koa-router";

import {render} from "./document";

const initRoute = (app: Koa, route: Router) => {

    route.get("/", (ctx: Koa.Context) => {
        const location: string = ctx.request.url;

        const data = {
            routing: {location},
        };

        ctx.body = render(ctx, location, data);
    });

    route.get("/test", (ctx: Koa.Context) => {
        const location: string = ctx.request.url;

        const data = {
            routing: {location},
        };

        ctx.body = render(ctx, location, data);
    });

    app
        .use(route.routes())
        .use(route.allowedMethods());

};

export default initRoute;
