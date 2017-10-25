export let set: any;
if (process.env.BROWSER) {
    set = require("lodash-es/set").default;
} else {
    set = require("lodash-node/modern/object/set");
}

export default set;
