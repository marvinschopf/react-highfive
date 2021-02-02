/// <reference types="node" />
import { Component } from "react";
import { RewardElement } from "react-rewards";
declare type HighFiveState = {
    count: number;
    interval: NodeJS.Timer;
};
declare type HighFiveProps = {
    refreshRate: number;
    fetchUrl: string | false;
    updateUrl: string | false;
    position: {
        horizontal: "right" | "left" | "center";
        vertical: "bottom" | "top";
    };
};
export default class HighFive extends Component<HighFiveProps, HighFiveState> {
    static defaultProps: {
        refreshRate: number;
        fetchUrl: boolean;
        updateUrl: boolean;
        position: {
            horizontal: string;
            vertical: string;
        };
    };
    refConfetti: RewardElement;
    fetchUrl: string;
    updateUrl: string;
    constructor(props: HighFiveProps);
    updateCounter(): void;
    increaseCounter(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
