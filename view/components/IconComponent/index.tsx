import {onlyBrowser} from "_utils/excluded";
import noob from "_utils/noob";
import {getStyle, initStyle} from "_utils/rBem";
import {trycatch} from "_utils/trycatch";
import axios from "axios";
import * as React from "react";
import {IIconComponent} from "./interface";

export class IconComponent extends React.PureComponent<IIconComponent, {}> {

    public static defaultProps: IIconComponent = {
        name: null,
        className: getStyle("icon"),
        spritename: "sprite",
        viewBox: "0 0 24 24",
    };

    @trycatch()
    @onlyBrowser
    public async componentDidMount() {
        try {
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
        } catch (err) {
            console.error(err);
        }
    }

    @trycatch()
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
