import {ReactNode} from "react";
import {classNames} from "_style";

export interface IIconComponent {
    viewBox?: string;
    name: string;
    spriteName?: string;
    className?: classNames;
    children?: ReactNode;
    refComponent?: (elem: HTMLElement) => void;
    onLoaded?: (promise: Promise<{}>) => void;

    [id: string]: any;
}
