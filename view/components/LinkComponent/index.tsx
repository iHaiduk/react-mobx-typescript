import {IconComponent} from "_component/IconComponent";
import {PureComponent} from "_component/PureComponent";
import {onlyBrowser} from "_utils/excluded";
import {getStyle, initStyle} from "_utils/rBem";
import {trycatch} from "_utils/trycatch";
import { inject, observer } from "mobx-react";
import * as React from "react";
import {ILinkComponent} from "./interface";

@inject("routing")
@observer
export class LinkComponent extends React.Component<ILinkComponent, {}> {

    public static defaultProps: ILinkComponent = {
        href: "/",
        className: getStyle("link"),
        back: false,
    };

    constructor(props: ILinkComponent) {
        super(props);
        if (process.env.BROWSER) {
            this.onClick = this.onClick.bind(this);
        }
    }

    @trycatch()
    public render() {

        const {href, rel, children, className, icon, iconClass, title, titleClass, routing, back, ...otherProps} = this.props;
        const classes = initStyle(getStyle("link"), className);

        return (
            <a href={href} className={classes} rel={rel} onClick={this.onClick} {...otherProps}>
                    {!!children && children}
                    {!children && !!icon && <IconComponent name={icon} className={iconClass} />}
                    {!children && !!title && <PureComponent tag="span" className={titleClass}>{title}</PureComponent>}
            </a>
        );
    }

    @onlyBrowser
    private onClick(event?: any) {
        event.preventDefault();
        const { href, back, routing} = this.props;
        const { push, goBack } = routing;
        if (back) {
            goBack();
        } else {
            push(href);
        }
    }
}

export default LinkComponent;
