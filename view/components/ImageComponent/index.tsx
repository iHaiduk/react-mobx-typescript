import {SourceSimple} from "_component/ImageComponent/source";
import {onlyBrowser} from "_utils/excluded";
import makeId from "_utils/makeid";
import {getStyle, initStyle} from "_utils/rBem";
import {trycatch} from "_utils/trycatch";
import * as React from "react";
import {IImageComponent} from "./interface";

const defaultSizes = [
    {
        size: "2k",
        media: "(min-width: 1921px)",
    }, {
        size: "full",
        media: "(min-width: 1601px) and (max-width: 1920px)",
    }, {
        size: "plus",
        media: "(min-width: 1367px) and (max-width: 1600px)",
    }, {
        size: "hd",
        media: "(min-width: 1025px) and (max-width: 1366px)",
    }, {
        size: "xga",
        media: "(min-width: 769px) and (max-width: 1024px)",
    }, {
        size: "wide",
        media: "(min-width: 481px) and (max-width: 768px)",
    }, {
        size: "half",
        media: "(max-width: 480px)",
    },
];
const countDefaultSizes = defaultSizes.length;

export class ImageComponent extends React.PureComponent<IImageComponent, {}> {

    public static defaultProps: IImageComponent = {
        className: getStyle("image"),
        type: "jpg",
        alt: "",
    };

    @onlyBrowser
    public componentDidMount() {
        const picturefill = require("picturefill");
        picturefill();
    }

    @trycatch()
    public render() {
        const {name, alt, type, src, className} = this.props;
        const classes = initStyle(getStyle("image"), className);

        if (typeof name === "string" && typeof type === "string") {
            const imagesMedia: any[] = new Array(countDefaultSizes);
            defaultSizes.forEach(({media, size}) => {
                imagesMedia.push(<SourceSimple key={makeId()} src={require(`_images/${size}/${name}.${type}`)} ext={type} media={media}/>);
                imagesMedia.push(<SourceSimple key={makeId()} src={require(`_images/${size}/${name}.webp`)} ext={"webp"} media={media}/>);
            });
            const imageName = require(`_images/${name}.${type}`);
            return (
                <picture className={classes}>
                    {imagesMedia}
                    <img srcSet={imageName} src={imageName} alt={alt}/>
                </picture>
            );
        } else if (typeof src !== "undefined") {
            if (typeof src === "string") {
                return (
                    <picture className={classes}>
                        <img srcSet={src} src={src} alt={alt}/>
                    </picture>
                );
            } else if (Array.isArray(src)) {
                return (
                    <picture className={classes}>
                        {src.map((props, key) => <SourceSimple key={key} {...props} />)}
                        <img srcSet={src[0].src} src={src[0].src} alt={alt}/>
                    </picture>
                );
            }
        }

        return false;
    }
}

export default ImageComponent;
