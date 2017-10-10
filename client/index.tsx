import App from "_clientRouter";
import * as stores from "_stores";
import {Provider} from "mobx-react";
import * as React from "react";
import {hydrate} from "react-dom";

if (process.env.NODE_ENV !== "production") {
    const {AppContainer} = require("react-hot-loader");

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
        module.hot.accept("_clientRouter", () => {
            const NewApp = require("_clientRouter").default;
            renderApplication(NewApp);
        });
    }
} else {
    hydrate(
        <Provider {...stores}>
            <App/>
        </Provider>,
        document.getElementById("application"),
    );
}
