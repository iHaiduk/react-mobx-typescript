import noob from "_utils/noob";
import axios from "axios";
import * as React from "react";
import {IIconComponent} from "./interface";
import {getStyle, initStyle} from "_utils/rBem";

export class IconComponent extends React.PureComponent<IIconComponent, {}> {

    public static defaultProps: IIconComponent = {
        name: null,
        className: getStyle("icon"),
        spritename: "sprite",
        viewBox: "0 0 24 24",
    };

    constructor(props: IIconComponent) {
        super(props);
    }

    public async componentDidMount() {
        try {
            if (process.env.BROWSER) {
                const {spritename, onLoaded = noob} = this.props;
                if ((window as any).prom === undefined) {
                    (window as any).prom = new Promise(async (resolve) => {
                        const response = await axios({
                            method: "get",
                            url: `/${spritename}.svg`,
                        });
                        const svgContainer = document.getElementById("svgContainer");
                        if (svgContainer) {
                            svgContainer.innerHTML = response.data;
                            resolve();
                        }
                    });
                }
                onLoaded((window as any).prom);
            }
        } catch (err) {
            console.error(err);
        }
    }

    public render() {

        const {name, className, refComponent, viewBox, ...otherProps} = this.props;
        const classes = initStyle(getStyle("icon"), className);

        return !!name && (
            <span className={classes} ref={refComponent} {...otherProps}>
                 <svg viewBox={viewBox}>
                    <use xlinkHref={`#${name}`}/>
                </svg>
            </span>
        );
    }
}

export default IconComponent;
