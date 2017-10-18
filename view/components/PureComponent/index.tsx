import {initStyle} from "_utils/rBem";
import * as React from "react";
import {IPureComponent} from "./interface";

export class PureComponent extends React.PureComponent<IPureComponent, {}> {

    public static defaultProps: IPureComponent = {
        tag: "div",
    };

    public render() {
        const {tag: Tag, refOrigin, children, className = null, ...otherProps} = this.props;
        const classes = initStyle(className);
        return <Tag ref={refOrigin} className={classes} {...otherProps}>{children}</Tag>;
    }
}
