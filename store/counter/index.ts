import { action, computed, observable } from "mobx";

interface ICounter {
    count: number;
}

export class CounterClass implements ICounter {

    @observable count = 0;

    @computed public get getCount(): number {
        return this.count;
    }

    @action public setCount(count: number): void {
        this.count = count;
    }

}

export const Counter = new CounterClass();
export default Counter;