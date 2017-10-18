import IconComponent from "_component/IconComponent";
import ImageComponent from "_component/ImageComponent";
import LinkComponent from "_component/LinkComponent";
import SelectComponent from "_component/SelectComponent";
import * as React from "react";

export class TestPage extends React.Component<{}, {}> {

    public render() {
        return (
            <div>
                <h1>List of components:</h1>
                <ImageComponent alt={"text"} name={"sea-bg"} type={"jpg"}/>
                <ImageComponent alt={"text"} src={"http://via.placeholder.com/350x150?text=test"}/>
                <ImageComponent
                    alt={"text"}
                    src={[
                        {
                            src: "http://via.placeholder.com/350x150?text=2560",
                            media: "(min-width: 1921px)",
                        },
                        {
                            src: "http://via.placeholder.com/350x150?text=1920",
                            media: "(min-width: 1601px) and (max-width: 1920px)",
                        },
                        {
                            src: "http://via.placeholder.com/350x150?text=1600",
                            media: "(min-width: 1367px) and (max-width: 1600px)",
                        },
                        {
                            src: "http://via.placeholder.com/350x150?text=1366",
                            media: "(min-width: 1025px) and (max-width: 1366px)",
                        },
                        {
                            src: "http://via.placeholder.com/350x150?text=1024",
                            media: "(min-width: 769px) and (max-width: 1024px)",
                        },
                        {
                            src: "http://via.placeholder.com/350x150?text=768",
                            media: "(min-width: 481px) and (max-width: 768px)",
                        },
                        {
                            src: "http://via.placeholder.com/350x150?text=480",
                            media: "(max-width: 480px)",
                        },
                    ]}
                />
                <IconComponent name={"download"}/>
                <SelectComponent/>
                <LinkComponent href={"/"} title={"Go Home"}/>
                <LinkComponent href={"/"} back={true} title={"Go Back"}/>
            </div>
        );
    }
}

export default TestPage;
