import createBrowserHistory from "history/createBrowserHistory";
import createMemoryHistory from "history/createMemoryHistory";
import { RouterStore, syncHistoryWithStore } from "mobx-react-router";

let browserHistory;
if (process.env.BROWSER) {
    browserHistory = createBrowserHistory();
} else {
    browserHistory = createMemoryHistory();
}

export const routingStore = new RouterStore();

export const history = syncHistoryWithStore(browserHistory, routingStore);

export default routingStore;
