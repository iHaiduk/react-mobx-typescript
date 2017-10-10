import * as stores from "_stores";
import {Provider} from "mobx-react";
import * as React from "react";
import {hydrate} from "react-dom";

import App from "_view/index";

if (process.env.NODE_ENV != "production") {
    const DevTools = require("mobx-react-devtools").default;
    const {AppContainer} = require("react-hot-loader");

    const renderApplication = (Component: any) => {
        hydrate(
            <AppContainer>
                <Provider {...stores}>
                    <div>
                        <Component/>
                        <DevTools/>
                    </div>
                </Provider>
            </AppContainer>,
            document.getElementById("application"),
        );
    };
    renderApplication(App);

    if (module.hot) {
        module.hot.accept("_view/index", () => {
            const NewApp = require("_view/index").default;
            renderApplication(NewApp);
        });
    }
} else {
    hydrate(
        <Provider {...stores}>
            <App />
        </Provider>,
        document.getElementById("application"),
    );
}
