import * as React from "react";
import {Router} from 'react-router';
import {history} from "_store/routing";
import ClientRoute from "./clientRoute";

let AppComponent;

if(process.env.NODE_ENV === "production") {
    AppComponent = (props: Router) => (<Router history={history} {...props}><ClientRoute /></Router>);
} else {
    const DevTools = require("mobx-react-devtools").default;
    AppComponent = (props: Router) => (<Router history={history} {...props}><div><ClientRoute /><DevTools /></div></Router>);
}

export default AppComponent;
