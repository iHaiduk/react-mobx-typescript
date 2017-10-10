import {IHomePage} from "_page/Home/interface";
import { inject, observer } from "mobx-react";
import * as React from "react";

@inject("counter", "routing")
@observer
export class TestPage extends React.Component<IHomePage, {}> {

    constructor(props: IHomePage) {
        super(props);
        if (process.env.BROWSER) {
            this.onClick = this.onClick.bind(this);
        }
    }

    public render() {
        const {counter} = this.props;
        return (
            <div>
                <button onClick={this.onClick}>
                    Seconds passed 2: {counter.count}
                </button>
            </div>
        );
     }

    private onClick() {
         const {counter} = this.props;
         counter.setCount(counter.getCount + 2);
     }
}

export default TestPage;
