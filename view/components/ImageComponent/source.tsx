import {IImageSourceParams} from "_component/ImageComponent/interface";
import * as React from "react";

const mapTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
};

export const SourceSimple: React.SFC<IImageSourceParams> = ({src, media, ext = "jpg", ...otherProps}) => (<source srcSet={src} media={media} type={ext && mapTypes[ext]} {...otherProps} />);
