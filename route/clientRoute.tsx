import ErrorComponent from "_component/ErrorComponent";
import LazyLoadComponent from "_component/LazyLoadComponent";
import LoadingComponent from "_component/LoadingComponent";
import * as React from "react";
import {Route, Switch} from "react-router";
declare const System: { import: (path: string) => Promise<any>; };

const Home = LazyLoadComponent(() => System.import("_page/Home"), LoadingComponent, ErrorComponent);
const Test = LazyLoadComponent(() => System.import("_page/Test"), LoadingComponent, ErrorComponent);

export const Routes = () => (
   <Switch>
        <Route exact={true} path="/" component={Home}/>
        <Route path="/test" component={Test}/>
   </Switch>
);

export default Routes;
