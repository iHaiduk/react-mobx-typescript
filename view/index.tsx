import * as React from "react";
import { observer, inject } from 'mobx-react';
import {CounterClass} from "_store/counter";
import {ReactNode} from "react";

@inject('counter')
@observer
export class TimerView extends React.Component<{counter?: CounterClass, children?: ReactNode}, {}> {

    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    public render() {
        const {counter} = this.props;
        return (
            <div>
                <button onClick={this.onClick}>
                    Seconds passed: {counter.count}
                </button>
            </div>
        );
     }

     private onClick() {
         const {counter} = this.props;
         counter.setCount(counter.getCount + 2);
     }
}

export default TimerView;
