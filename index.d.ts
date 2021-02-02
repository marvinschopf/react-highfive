/// <reference types="node" />
import { Component } from "react";
import { RewardElement } from "react-rewards";
declare type HighFiveState = {
    count: number;
    interval: NodeJS.Timer;
    refConfetti: RewardElement;
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
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
