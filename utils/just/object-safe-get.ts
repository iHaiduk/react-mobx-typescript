export let get: any;
if (process.env.BROWSER) {
    get = require("lodash-es/get").default;
} else {
    get = require("lodash-node/modern/object/get");
}

export default get;
