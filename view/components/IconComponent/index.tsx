// import {component} from "_style";
// import classnames from "_utils/classnames";
// import noob from "_utils/noob";
// import request from "_utils/xhr";
import noob from "_utils/noob";
import axios from "axios";
import * as React from "react";
import {IIconComponent} from "./interface";

export class IconComponent extends React.PureComponent<IIconComponent, {}> {

    public static defaultProps: IIconComponent = {
        name: null,
        spriteName: "sprite",
        viewBox: "0 0 24 24",
    };

    constructor(props: IIconComponent) {
        super(props);
    }

    public componentDidMount() {
        try {
            if (process.env.BROWSER) {
                const {spriteName, onLoaded = noob} = this.props;
                if ((window as any).prom === undefined) {
                    (window as any).prom = new Promise(async (resolve) => {
                        axios({
                            method: "get",
                            url: `/${spriteName}.svg`,
                        }).then((response) => {
                            const svgContainer = document.getElementById("svgContainer");
                            svgContainer.innerHTML = response.data;
                            resolve();
                        });
                    });
                }
                onLoaded((window as any).prom);
            }
        } catch (err) {
            console.error(err);
        }
    }

    public render() {

        const {name} = this.props;

        return !!name && (<span>12345</span>);

        // const {name, viewBox, className, refComponent, spriteName, onLoaded, ...otherProps} = this.props;
        // const classes = classnames(component.icon, className);
        //
        // return !!name && (
        //     <span className={classes} ref={refComponent} {...otherProps}>
        //         <svg viewBox={viewBox}>
        //             <use xlinkHref={`#${name}`}/>
        //         </svg>
        //     </span>
        // );
    }
}

export default IconComponent;
