/**
 *  react-highfive
 *  Copyright (C) 2021 Marvin Schopf
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import PanToolIcon from "@material-ui/icons/PanTool";
import Rewards, { RewardElement } from "rewards-lite";
import CountUp from "react-countup";

type HighFiveState = {
	count: number;
	interval: NodeJS.Timer;
	oldCount: number;
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
		};
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
