import { action, computed, observable } from "mobx";

interface ICounter {
    count?: number;
}

export class CounterClass implements ICounter {

    @observable count = 0;

    constructor(props?: ICounter) {
        if(typeof props !== "undefined") {
            const {count} = props;
            this.count = count;
        }
    }

    @computed public get getCount(): number {
        return this.count;
    }

    @action public setCount(count: number): void {
        this.count = count;
    }

}

export const Counter = new CounterClass(process.env.BROWSER && (window as any).__initState__.counter || undefined);
export default Counter;