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

	async updateCounter() {
		const response: Response = await fetch(this.props.fetchUrl);
		if (response.status === 200) {
			this.setState({
				count: parseInt(await response.text()),
			});
		} else {
			this.setState({
				count: 0,
			});
		}
	}

	async increaseCounter() {
		const response: Response = await fetch(this.props.updateUrl);
		if (response.status === 200) {
			this.setState({
				count: this.state.count + 1,
			});
		}
	}

	async componentDidMount() {
		await this.updateCounter();
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
						<React.Fragment>
							<IconButton
								aria-label="High Five"
								color="primary"
								onClick={async () => {
									await this.increaseCounter();
								}}
							>
								<PanToolIcon />
							</IconButton>
						</React.Fragment>
					}
				/>
			</div>
		);
	}
}
