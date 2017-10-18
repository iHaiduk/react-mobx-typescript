/*
 @rBem
 class Component extends React.Component<IComponent & IStyleComponent, {}> {
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

 OR

 import {getStyle, initStyle} from "";

 class Component extends React.Component<IComponent, {}> {
    /// ....
    public render() {
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
import memo from "_utils/memo";
import {Component, createElement} from "react";

const classnames = require("classnames/dedupe");

const styles = {...block, ...component, ...section};
const isString = (value: any): boolean => typeof value === "string";
const elePrefix = "__";
const modPrefix = "--";

export const getStyle = memo((styleBlock: IValueBlocks, element?: IValueElements, modifier?: IValueMods): string => {
    let genPath: string = styleBlock;

    if (isString(element)) {
        genPath += elePrefix + element;
    }
    if (isString(modifier)) {
        genPath += modPrefix + modifier;
    }

    return get(styles, genPath);
});

export const initStyle = (...value: any[]): string => {
    if (Array.isArray(value)) {
        if (typeof value[0] === "object") {
            return classnames(value[0]);
        } else {
            return classnames(...Array.prototype.concat.apply([], value));
        }
    }
    return "";
};

export interface IStyleComponent {
    getStyle?: (styleBlock: IValueBlocks, element?: IValueElements, modifier?: IValueMods) => string;
    initStyle?: (value: any[] | any) => string;
}

const rBem = (Child: any): any => {
    return class extends Component<any, {}> {
        public render() {
            const newProps: any = {};
            const keys: any[] = Object.keys(this.props);
            keys.forEach((key) => {
                newProps[key] = this.props[key];
            });
            set(newProps, "getStyle", getStyle);
            set(newProps, "initStyle", initStyle);
            return createElement(Child, newProps);
        }
    };

};

export default rBem;
