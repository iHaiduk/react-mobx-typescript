import {classNames} from "_style";
import {ReactNode} from "react";

interface ISelectOption {
    label: string;
    value: string;
}

export interface ISelectComponent {
    className?: classNames;
    options?: ISelectOption[];
    creatable?: boolean;
    children?: ReactNode;

    [id: string]: any;
}
