import {SourceSimple} from "_component/ImageComponent/source";
import makeId from "_utils/makeid";
import rBem, {IStyleComponent} from "_utils/rBem";
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

@rBem
export class ImageComponent extends React.PureComponent<IImageComponent & IStyleComponent, {}> {

    public static defaultProps: IImageComponent = {
        className: "",
        type: "jpg",
        alt: "",
    };

    public componentDidMount() {
        if (process.env.BROWSER) {
            const picturefill = require("picturefill");
            picturefill();
        }
    }

    public render() {
        const {name, alt, type, src, getStyle} = this.props;

        if (typeof name === "string" && typeof type === "string") {
            const imagesMedia: any[] = [];
            defaultSizes.forEach(({media, size}) => {
                imagesMedia.push(<SourceSimple key={makeId()} src={require(`_images/${size}/${name}.${type}`)} ext={type} media={media} />);
                imagesMedia.push(<SourceSimple key={makeId()} src={require(`_images/${size}/${name}.webp`)} ext={"webp"} media={media} />);
            });
            const imageName = require(`_images/${name}.${type}`);
            return (
                <picture className={getStyle("image")}>
                    {imagesMedia}
                    <img srcSet={imageName} src={imageName} alt={alt}/>
                </picture>
            );
        } else if (typeof src !== "undefined") {
            if (typeof src === "string") {
                return (
                    <picture className={getStyle("image")}>
                        <img srcSet={src} src={src} alt={alt}/>
                    </picture>
                );
            } else if (Array.isArray(src)) {
                return (
                    <picture className={getStyle("image")}>
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
