import {classNames} from "_style";
import {ReactNode} from "react";

type imageExt = "jpg" | "jpeg" | "png" | "gif" | "webp";

export interface IImageSourceParams {
    src: string; // default Image
    media: string; // (min-width: 1367px) and (max-width: 1920px)
    ext?: imageExt;
    key?: string | number;
}

export interface IImageComponent {
    children?: ReactNode;
    className?: classNames;

    alt: string;
    type?: imageExt;

    name?: string;
    src?: IImageSourceParams[] | string;

    [id: string]: any;
}
