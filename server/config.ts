import * as Koa from "koa";
import * as pino from "pino";

const pretty = pino.pretty();
pretty.pipe(process.stdout);

export const ASSETS: any = process.env.ASSETS || {};
export const NODE_ENV: string = process.env.NODE_ENV || "development";
export const PORT: string | number = process.env.PORT || "1337";

interface IConfig {
    hostname: string;
    logLevel: "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";
    logSafe: boolean;
    port: number;
    pretty: any;
    database: {
        config?: {
            db?: {
                native_parser: boolean;
            },
            pass: string;
            replset?: {
                rs_name: string;
            },
            server?: {
                poolSize: number;
                reconnectTries: number;
                reconnectInterval: number;
            },
            user: string;
        },
        development: string,
        production: string,
    };
    redis: {
        family?: number;
        password?: string;
        port: number;
        host: string;
    } | string;
    elastic: {
        host: string
        maxSockets: number;
        sniffOnStart: boolean;
        sniffInterval: number;
    };
}

interface IKoaBodyFormidableOptions {
    /**
     * {Integer} The expected number of bytes in this form, default null
     */
    bytesExpected?: number;

    /**
     * {Integer} Limits the number of fields that the querystring parser will decode, default 1000
     */
    maxFields?: number;

    /**
     * {Integer} Limits the amount of memory all fields together (except files) can allocate in bytes.
     * If this value is exceeded, an 'error' event is emitted, default 2mb (2 * 1024 * 1024)
     */
    maxFieldsSize?: number;

    /**
     * {String} Sets the directory for placing file uploads in, default os.tmpDir()
     */
    uploadDir?: string;

    /**
     * {Boolean} Files written to uploadDir will include the extensions of the original files, default false
     */
    keepExtensions?: boolean;

    /**
     * {String} If you want checksums calculated for incoming files, set this to either 'sha1' or 'md5', default false
     */
    hash?: string;

    /**
     * {Boolean} Multiple file uploads or no, default true
     */
    multiples?: boolean;
    /**
     * {Function} Special callback on file begin. The function is executed directly by formidable.
     * It can be used to rename files before saving them to disk. See https://github.com/felixge/node-formidable#filebegin
     */
    onFileBegin?: (name: string, file: any) => void;
}
interface IKoaBodyOptions {
    /**
     * {Boolean} Patch request body to Node's ctx.req, default false
     *
     * Note: You can patch request body to Node or Koa in same time if you want.
     */
    patchNode?: boolean;

    /**
     * {Boolean} Patch request body to Koa's ctx.request, default true
     *
     * Note: You can patch request body to Node or Koa in same time if you want.
     */
    patchKoa?: boolean;

    /**
     * {String|Integer} The byte (if integer) limit of the JSON body, default 1mb
     */
    jsonLimit?: string | number;

    /**
     * {String|Integer} The byte (if integer) limit of the form body, default 56kb
     */
    formLimit?: string | number;

    /**
     * {String|Integer} The byte (if integer) limit of the text body, default 56kb
     */
    textLimit?: string | number;

    /**
     * {String} Sets encoding for incoming form fields, default utf-8
     */
    encoding?: string;

    /**
     * {Boolean} Parse multipart bodies, default false
     */
    multipart?: boolean;

    /**
     * {Boolean} Parse urlencoded bodies, default true
     */
    urlencoded?: boolean;

    /**
     * {Boolean} Parse text bodies, default true
     */
    text?: boolean;

    /**
     * {Boolean} Parse json bodies, default true
     */
    json?: boolean;

    /**
     * {Object} Options to pass to the formidable multipart parser
     */
    formidable?: IKoaBodyFormidableOptions;

    /**
     * {Function} Custom error handle, if throw an error, you can customize the response - onError(error, context), default will throw
     */
    onError?: (err: Error, ctx: Koa.Context) => void;

    /**
     * {Boolean} If enabled, don't parse GET, HEAD, DELETE requests, default true
     *
     * GET, HEAD, and DELETE requests have no defined semantics for the request body,
     * but this doesn't mean they may not be valid in certain use cases.
     * koa-body is strict by default
     *
     * see http://tools.ietf.org/html/draft-ietf-httpbis-p2-semantics-19#section-6.3
     */
    strict?: boolean;
}

export const database = {
    config: {
        db: { native_parser: true },
        pass: "",
        replset: { rs_name: "rs0" },
        server: { poolSize: 5, reconnectTries: Number.MAX_VALUE, reconnectInterval: 5000 },
        user: "",
    },
    development: "mongodb://localhost/database",
    production: "mongodb://localhost/database",
};

export const redisConfig = {
    family: 4,
    host: "localhost",   // Redis host
    port: 6379,          // Redis port
};

export const elasticConfig = {
    host: "https://x6jwb649fk:airn4dms7l@first-cluster-9518594759.eu-central-1.bonsaisearch.net",
    maxSockets: 2,
    sniffInterval: 60000,
    sniffOnStart: true,
};

const config: IConfig = {
    database,
    elastic: elasticConfig,
    hostname: "0.0.0.0",
    logLevel: "debug",
    logSafe: true,
    port: PORT && parseInt(PORT, 10),
    pretty,
    redis: redisConfig,
};

export const logConfig = {level: config.logLevel, safe: true};

export const bodyParseConfig: IKoaBodyFormidableOptions & IKoaBodyOptions = {
    formLimit: "200kb",
    textLimit: "200kb",
    jsonLimit: "4mb",
    multipart: true,
};

export default config;
