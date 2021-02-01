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
    updateCounter(): void;
    increaseCounter(): void;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
