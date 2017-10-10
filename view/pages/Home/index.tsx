import * as React from "react";
import { observer, inject } from 'mobx-react';
import {IHomePage} from "_page/Home/interface";

@inject('counter', 'routing')
@observer
export class HomePage extends React.Component<IHomePage, {}> {

    constructor(props: IHomePage){
        super(props);
        if(process.env.BROWSER) {
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
            </div>
        );
     }

     private onClick() {
         const {counter} = this.props;
         counter.setCount(counter.getCount + 2);
     }
}

export default HomePage;
