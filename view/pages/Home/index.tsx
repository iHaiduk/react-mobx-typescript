import LinkComponent from "_component/LinkComponent";
import {IHomePage} from "_page/Home/interface";
import {onlyBrowser} from "_utils/excluded";
import {inject, observer} from "mobx-react";
import * as React from "react";

@inject("counter", "routing")
@observer
export class HomePage extends React.Component<IHomePage, {}> {

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
                    Rename test: {counter.count}
                </button>
                <LinkComponent href={"/test"} title={"Go to test"}/>
            </div>
        );
    }

    @onlyBrowser
    private onClick() {
        const {counter} = this.props;
        counter.setCount(counter.getCount + 2);
    }
}

export default HomePage;
