import Home from "_page/Home";
import Test from "_page/Test";
import * as React from "react";
import {Route, Switch} from "react-router";

export const BackendRoutes = () => (
    <Switch>
        <Route exact={true} path="/" component={Home}/>
        <Route path="/test" component={Test}/>
   </Switch>
);

export default BackendRoutes;
