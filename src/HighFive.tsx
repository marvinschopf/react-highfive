import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import PanToolIcon from "@material-ui/icons/PanTool";
import Confetti from "react-canvas-confetti";

type HighFiveState = {
	count: number;
	interval: NodeJS.Timer;
	refConfetti: any;
};

type HighFiveProps = {
	fetchUrl: string;
	updateUrl: string;
};

export default class HighFive extends Component<HighFiveProps, HighFiveState> {
	constructor(props: HighFiveProps) {
		super(props);
		this.state = {
			count: 0,
			interval: null,
			refConfetti: null,
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
		this.state.refConfetti();
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
				<Confetti
					refConfetti={(ref) => this.setState({ refConfetti: ref })}
					style={{
						position: "absolute",
						left: "80px",
						bottom: "30px",
						height: "auto",
						minHeight: "600px"
					}}
				/>
				<Snackbar
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
					message={this.state.count}
					open={true}
					action={
						<IconButton
							aria-label="High Five"
							color="primary"
							onClick={() => {
								this.increaseCounter();
							}}
						>
							<PanToolIcon />
						</IconButton>
					}
				/>
			</div>
		);
	}
}
