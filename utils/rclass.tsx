/*
 class Component extends React.Component<Iomponent & IStyleComponent, {}> {
    /// ....
    public render() {
        const {initStyle, getStyle, ...} = this.props;

        return (
            <div className={getStyle("image")} />
            <div className={initStyle(getStyle("image"), getStyle("image", "element"))} />
            <div className={initStyle({
                [getStyle("image")]: true,
                [getStyle("section")]: false,
            })} />
        );
    }
 }
*/
import {block, component, section} from "_style";
import {IValueBlocks, IValueElements, IValueMods} from "_stylesLoad/interface";
import get from "_utils/just/object-safe-get";
import set from "_utils/just/object-safe-set";
import * as classnames from "classnames/dedupe";
import {Component, createElement} from "react";

const styles = {...block, ...component, ...section};
const isString = (value: any): boolean => typeof value === "string";
const elePrefix = "__";
const modPrefix = "--";

const getStyle = (styleBlock: IValueBlocks, element?: IValueElements, modifier?: IValueMods): string => {
    let genPath: string = styleBlock;

    if (isString(element)) {
        genPath += elePrefix + element;
    }
    if (isString(modifier)) {
        genPath += modPrefix + modifier;
    }

    return get(styles, genPath);
};

const initStyle = (...value: any[]): string => {
    if (Array.isArray(value)) {
        if (typeof value[0] === "object") {
            return classnames(value[0]);
        } else {
            return classnames(value);
        }
    }
    return "";
};

export interface IStyleComponent {
    getStyle?: (styleBlock: IValueBlocks, element?: IValueElements, modifier?: IValueMods) => string;
    initStyle?: (value: any[] | any) => string;
}

const rclass = (Child: any): any => {
    return class extends Component<any, {}> {
        public render() {
            const newProps: any = {};
            for (const key in this.props) {
                if (this.props.hasOwnProperty(key)) {
                    newProps[key] = this.props[key];
                }
            }
            set(newProps, "getStyle", getStyle);
            set(newProps, "initStyle", initStyle);
            return createElement(Child, newProps);
        }
    };

};

export default rclass;
