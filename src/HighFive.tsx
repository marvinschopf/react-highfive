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
 *  @copyright 2021 Marvin Schopf
 *  @license Apache-2.0
 *
 **/

import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import PanToolIcon from "@material-ui/icons/PanTool";
import Rewards, { RewardElement } from "rewards-lite";
import CountUp from "react-countup";

// Define URLs of the hosted service
const HOSTED_FETCH_URL: string = "https://api.highfivejs.org/v1/get";
const HOSTED_UPDATE_URL: string = "https://api.highfivejs.org/v1/update";

// Define type of component state
type HighFiveState = {
	count: number;
	interval: NodeJS.Timer;
	oldCount: number;
	fetchUrl: string | false;
	updateUrl: string | false;
	hosted: boolean;
};

// Define type of properties
type HighFiveProps = {
	refreshRate?: number;
	fetchUrl?: string | false;
	updateUrl?: string | false;
	position?: {
		horizontal: "right" | "left" | "center";
		vertical: "bottom" | "top";
	};
	prefix?: string;
	suffix?: string;
	countDuration?: number;
	hosted?: boolean;
};

export default class HighFive extends Component<HighFiveProps, HighFiveState> {
	// Define default properties
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
			hosted: this.props.hosted,
		};

		// Build URLs to the hosted service based on the previously specified service URLs
		this.setState({
			fetchUrl: this.props.hosted ? HOSTED_FETCH_URL : this.props.fetchUrl,
			updateUrl: this.props.hosted ? HOSTED_UPDATE_URL : this.props.updateUrl,
		});
	}

	updateCounter() {
		// Check whether a server has been specified, if so, request the current count from the server.
		if (this.state.fetchUrl != false) {
			fetch(this.state.fetchUrl, {
				headers: {
					"X-Resource-ID": window.location.hostname,
				},
			})
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
		// In any case, show an animation when "a high-five has been given".
		this.refConfetti.rewardMe();

		// Check again whether a server has been specified. If so, update the counter via a simple HTTP GET ping.
		if (this.state.updateUrl != false) {
			fetch(this.state.updateUrl, {
				headers: {
					"X-Resource-ID": window.location.hostname,
				},
			}).then((response: Response) => {
				this.setState({
					oldCount: this.state.count,
					count: this.state.count + 1,
				});
			});
		} else {
			// Even if no server has been specified, update the local counter anyway
			this.setState({
				oldCount: this.state.count,
				count: this.state.count + 1,
			});
		}
	}

	componentDidMount() {
		// Start timer only if a $fetchUrl is set
		if (this.state.fetchUrl != false) {
			// If component is mounted, start timer that updates counter every $refreshRate miliseconds.
			this.setState({
				interval: setInterval(() => {
					this.updateCounter();
				}, this.props.refreshRate),
			});
			this.updateCounter();
		}
	}

	componentWillUnmount() {
		// Delete timer if set
		if (this.props.fetchUrl != false) {
			clearInterval(this.state.interval);
		}
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
						// Animate increasing the number
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
