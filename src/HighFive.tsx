import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import PanToolIcon from "@material-ui/icons/PanTool";

type HighFiveState = {
	count: number;
};

type HighFiveProps = {
	fetchUrl: string;
	updateUrl: string;
};

export default class HighFive extends Component<HighFiveProps, HighFiveState> {
	constructor(props: HighFiveProps) {
		super(props);
	}

	componentWillMount() {
		this.setState({
			count: 0,
		});
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
		fetch(this.props.updateUrl).then((response: Response) => {
			this.setState({
				count: this.state.count + 1,
			});
		});
	}

	componentDidMount() {
		this.updateCounter();
	}

	render() {
		return (
			<div>
				<Snackbar
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
					message={this.state.count}
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
