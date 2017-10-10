import {HomePage} from "_page/Home";
import TestPage from "_page/Test";
import * as React from "react";
import {Route, Switch} from "react-router";

export const BackendRoutes = () => (
    <Switch>
        <Route exact={true} path="/" component={HomePage}/>
        <Route path="/test" component={TestPage}/>
   </Switch>);

export default BackendRoutes;
