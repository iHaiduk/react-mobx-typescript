import {getStyle, initStyle} from "_utils/rBem";
import * as React from "react";
import * as Select from "react-select";
import {ISelectComponent} from "./interface";

export class SelectComponent extends React.Component<ISelectComponent, {}> {

    public static defaultProps: ISelectComponent = {
        className: getStyle("select"),
        creatable: false,
    };

    public render() {

        const {className, creatable, options, ...otherProps} = this.props;
        const classes = initStyle(getStyle("select"), className);

        const SelectElement: Select.Creatable | any = creatable === true ? Select.Creatable : (Select as any).default;

        return (
            <SelectElement
                className={classes}
                options={options}
                {...otherProps}
            />
        );

    }
}

export default SelectComponent;
