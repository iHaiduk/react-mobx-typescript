import {CounterClass} from "_store/counter";
import {ReactNode} from "react";
import {RouterStore} from "mobx-react-router";

export interface IHomePage {
    counter?: CounterClass,
    routing?: RouterStore,
    children?: ReactNode
}