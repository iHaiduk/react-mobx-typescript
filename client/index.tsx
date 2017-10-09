import * as stores from "_stores";
import {Provider} from "mobx-react";
import * as React from "react";
import {hydrate} from "react-dom";
import {AppContainer} from "react-hot-loader";

import App from "../src";

const renderApplication = (Component: any) => {
    hydrate(
        <AppContainer>
            <Provider {...stores}>
                <Component/>
            </Provider>
        </AppContainer>,
        document.getElementById("application"),
    );
};
renderApplication(App);

if (module.hot) {
    module.hot.accept("../src", () => renderApplication(App));
}
