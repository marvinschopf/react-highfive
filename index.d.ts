import { Component } from "react";
declare type HighFiveState = {
    count: number;
};
declare type HighFiveProps = {
    fetchUrl: string;
    updateUrl: string;
};
export default class HighFive extends Component<HighFiveProps, HighFiveState> {
    constructor(props: HighFiveProps);
    componentWillMount(): void;
    updateCounter(): Promise<void>;
    increaseCounter(): Promise<void>;
    componentDidMount(): Promise<void>;
    render(): JSX.Element;
}
export {};
