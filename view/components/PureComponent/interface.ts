import {classNames} from "_style";
import {ReactNode} from "react";

export interface IPureComponent {
    refOrigin?: void;
    children?: ReactNode;
    tag?: string;
    className?: classNames;

    [id: string]: any;
}
