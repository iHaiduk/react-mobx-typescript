import {CounterClass} from "_store/counter";
import {RouterStore} from "mobx-react-router";
import {ReactNode} from "react";

export interface IHomePage {
    counter?: CounterClass;
    routing?: RouterStore;
    children?: ReactNode;
}
