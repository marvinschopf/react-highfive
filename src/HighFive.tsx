/**
 *
 *  react-highfive
 *  Copyright (C) 2021 Marvin Schopf
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *		https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *  @copyright Marvin Schopf 2021
 *  @license Apache-2.0
 *
 **/

import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import PanToolIcon from "@material-ui/icons/PanTool";
import Rewards, { RewardElement } from "rewards-lite";
import CountUp from "react-countup";

const HOSTED_FETCH_URL: string = "https://api.highfivejs.org/v1/get";
const HOSTED_UPDATE_URL: string = "https://api.highfivejs.org/v1/update";

type HighFiveState = {
	count: number;
	interval: NodeJS.Timer;
	oldCount: number;
	fetchUrl: string | false;
	updateUrl: string | false;
	hostedIdentifier: string | false;
	hosted: boolean;
};

type HighFiveProps = {
	refreshRate: number;
	fetchUrl: string | false;
	updateUrl: string | false;
	position: {
		horizontal: "right" | "left" | "center";
		vertical: "bottom" | "top";
	};
	prefix: string;
	suffix: string;
	countDuration: number;
	hosted: boolean;
	hostedIdentifier: string;
};

export default class HighFive extends Component<HighFiveProps, HighFiveState> {
	public static defaultProps = {
		refreshRate: 5000,
		fetchUrl: false,
		updateUrl: false,
		position: {
			horizontal: "right",
			vertical: "bottom",
		},
		prefix: "",
		suffix: " high fives given!",
		countDuration: 3,
		hosted: false,
		hostedIdentifier: "",
	};

	refConfetti: RewardElement;
	fetchUrl: string;
	updateUrl: string;
	constructor(props: HighFiveProps) {
		super(props);
		this.state = {
			count: 0,
			interval: null,
			oldCount: 0,
			fetchUrl: false,
			updateUrl: false,
			hostedIdentifier: this.props.hosted ? this.props.hostedIdentifier : false,
			hosted: this.props.hosted,
		};
		if (
			this.props.hosted &&
			(!this.state.hostedIdentifier || this.state.hostedIdentifier.length == 0)
		) {
			this.setState({
				hosted: false,
			});
		}
		this.setState({
			fetchUrl: this.props.hosted
				? `${HOSTED_FETCH_URL}?id=${this.state.hostedIdentifier}`
				: this.props.fetchUrl,
			updateUrl: this.props.hosted
				? `${HOSTED_UPDATE_URL}?id=${this.state.hostedIdentifier}`
				: this.props.updateUrl,
		});
	}

	updateCounter() {
		if (this.props.fetchUrl != false) {
			fetch(this.props.fetchUrl)
				.then((response: Response) => {
					return response.text();
				})
				.then((counter: string) => {
					this.setState({
						oldCount: this.state.count,
						count: parseInt(counter),
					});
				});
		}
	}

	increaseCounter() {
		this.refConfetti.rewardMe();
		if (this.props.updateUrl != false) {
			fetch(this.props.updateUrl).then((response: Response) => {
				this.setState({
					oldCount: this.state.count,
					count: this.state.count + 1,
				});
			});
		} else {
			this.setState({
				oldCount: this.state.count,
				count: this.state.count + 1,
			});
		}
	}

	componentDidMount() {
		this.setState({
			interval: setInterval(() => {
				this.updateCounter();
			}, this.props.refreshRate),
		});
		this.updateCounter();
	}

	componentWillUnmount() {
		clearInterval(this.state.interval);
	}

	render() {
		return (
			<div>
				<Snackbar
					anchorOrigin={{
						vertical: this.props.position.vertical,
						horizontal: this.props.position.horizontal,
					}}
					message={
						<CountUp
							start={this.state.oldCount}
							end={this.state.count}
							separator={"."}
							duration={this.props.countDuration}
							prefix={this.props.prefix}
							suffix={this.props.suffix}
						/>
					}
					open={true}
					action={
						<Rewards
							ref={(ref: RewardElement) => {
								this.refConfetti = ref;
							}}
							type="confetti"
							config={{
								elementCount: 200,
								spread: 160,
							}}
						>
							<IconButton
								aria-label="High Five"
								color="primary"
								onClick={() => {
									this.increaseCounter();
								}}
							>
								<PanToolIcon />
							</IconButton>
						</Rewards>
					}
				/>
			</div>
		);
	}
}
