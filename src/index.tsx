import DevTools from "mobx-react-devtools";
import * as React from "react";

export class TimerView extends React.Component<{}, {}> {
    public render() {
        return (
            <div>
                <button>
                    Seconds passed: 1254
                </button>
                <DevTools />
            </div>
        );
     }
}

export default TimerView;
