import BackendRoutes from "_backendRouter";
import {ASSETS} from "_serverConfig";
import * as stores from "_stores";
import {Context} from "koa";
import {Provider} from "mobx-react";
import * as React from "react";
import {renderToStaticMarkup, renderToStaticNodeStream} from "react-dom/server";
import {Helmet} from "react-helmet";
import {StaticRouter} from "react-router";
import * as serialize from "serialize-javascript";

const moize = require("moize");

const HTMLStart = (): string => {
    const helmet = Helmet.renderStatic();
    return renderToStaticMarkup(
        <head>
            {helmet.title.toComponent()}
            {helmet.meta.toComponent()}
            {helmet.link.toComponent()}
        </head>,
    );
};

const ChildrenRender = (props: any): React.ReactElement<any> => {
    return (
        <Provider {...stores}>
            <StaticRouter context={props} location={props.routing.location}>
                <BackendRoutes/>
            </StaticRouter>
        </Provider>);
};

export const render: (ctx: Context, location: string, data: any) => void = (ctx: Context, location: string, data: any = {}) => {

    ctx.status = 200;
    ctx.type = "text/html; charset=utf-8";
    ctx.set("Cache-Control", "no-cache");
    ctx.set("Connection", "keep-alive");
    ctx.set("Transfer-Encoding", "chunked");

    ctx.res.write(`<!doctype html><html lang="en">`);

    ctx.res.write(HTMLStart());
    ctx.res.write(`<body><span id="svgContainer"></span><div id="application">`);

    const stream = renderToStaticNodeStream(<ChildrenRender {...data} />);
    stream.on("end", () => {
        const {routing, ...props} = data;

        ctx.res.write("</div>");

        ctx.res.write(`<script type="text/javascript">window.__initState__=${memoStringify(props, true)};window.__initRoute__=${memoStringify(routing)}</script>`);
        ctx.res.write(`<script type="text/javascript">window.ASSETS=${JSON.stringify(ASSETS)}</script>`);

        ctx.res.write("</body></html>");
        ctx.res.write(`<link href="/${ASSETS["base.css"] || "style/base.css"}" rel="stylesheet" media="none" onload="if(media!='all')media='all'"/>`);
        ctx.res.write(`<link href="/${ASSETS["section.css"] || "style/section.css"}" rel="stylesheet" media="none" onload="if(media!='all')media='all'"/>`);
        ctx.res.write(`<link href="/${ASSETS["block.css"] || "style/block.css"}" rel="stylesheet" media="none" onload="if(media!='all')media='all'"/>`);
        ctx.res.write(`<link href="/${ASSETS["components.css"] || "style/components.css"}" rel="stylesheet" media="none" onload="if(media!='all')media='all'"/>`);
        ctx.res.write(`<script src="/${ASSETS["vendor.js"] || "vendor.js"}" type="text/javascript"></script>`);
        ctx.res.write(`<script src="/${ASSETS["style.js"] || "style.js"}" type="text/javascript"></script>`);
        ctx.res.write(`<script src="/${ASSETS["bundle.js"] || "bundle.js"}" type="text/javascript"></script>`);
    });

    return stream;
};

export const memoStringify = moize((data: any, isSerialize?: boolean): string => {
    return isSerialize && serialize(data) || JSON.stringify(data);
}, {maxArgs: 2, maxAge: 1000 * 3600 * 24});
