import * as Koa from "koa";
import * as Router from "koa-router";
import main from "./main";

const initRoute = (app: Koa, route: Router) => {

    main(route);

    app
        .use(route.routes())
        .use(route.allowedMethods());

};

export default initRoute;
