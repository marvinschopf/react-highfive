import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import PanToolIcon from "@material-ui/icons/PanTool";
import Rewards, { RewardElement } from "react-rewards";

type HighFiveState = {
	count: number;
	interval: NodeJS.Timer;
};

type HighFiveProps = {
	fetchUrl?: string;
	updateUrl?: string;
};

export default class HighFive extends Component<HighFiveProps, HighFiveState> {
	refConfetti: RewardElement;
	fetchUrl: string;
	updateUrl: string;
	constructor(props: HighFiveProps) {
		super(props);
		if (props.fetchUrl && props.updateUrl) {
			this.fetchUrl = props.fetchUrl;
			this.updateUrl = props.updateUrl;
		} else {
			this.fetchUrl = `https://highfive.js.org/srv/get?hostname=${window.location.hostname}`;
			this.updateUrl = `https://highfive.js.org/srv/update?hostname=${window.location.hostname}`;
		}
		this.state = {
			count: 0,
			interval: null,
		};
	}

	updateCounter() {
		fetch(this.props.fetchUrl)
			.then((response: Response) => {
				return response.text();
			})
			.then((counter: string) => {
				this.setState({
					count: parseInt(counter),
				});
			});
	}

	increaseCounter() {
		this.refConfetti.rewardMe();
		fetch(this.props.updateUrl).then((response: Response) => {
			this.setState({
				count: this.state.count + 1,
			});
		});
	}

	componentDidMount() {
		this.setState({
			interval: setInterval(() => {
				this.updateCounter();
			}, 1000),
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
						vertical: "bottom",
						horizontal: "left",
					}}
					message={<b>{this.state.count} high fives given!</b>}
					open={true}
					action={
						<Rewards
							ref={(ref: RewardElement) => {
								this.refConfetti = ref;
							}}
							type="confetti"
							config={{
								elementCount: 200,
								spread: 159,
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
