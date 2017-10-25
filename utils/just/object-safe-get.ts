export let set: any;
if (process.env.BROWSER) {
    set = require("lodash-es/get").default;
} else {
    set = require("lodash-node/modern/object/get");
}

export default set;