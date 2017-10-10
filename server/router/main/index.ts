import {bodyParseConfig} from "_serverConfig";
import {memoStringify, render} from "_serverRoute/document";
import * as Koa from "koa";
import * as koaBody from "koa-body";
import * as Router from "koa-router";

export default (route: Router) => {

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

    route.get("/json", koaBody(bodyParseConfig), (ctx: Koa.Context) => {
        ctx.body = memoStringify({data: 12});
    });
};
