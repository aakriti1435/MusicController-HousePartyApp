import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";

export default class Room extends Component {
	constructor(props) {
		super(props);
		this.state = {
			votesToSkip: 2,
			guestCanPause: false,
			isHost: false,
			showSettings: false,
		};
		this.roomCode = this.props.match.params.roomCode;
		this.leaveRoom = this.leaveRoom.bind(this);
		this.updateShowSettings = this.updateShowSettings.bind(this);
		this.settingsButton = this.settingsButton.bind(this);
		this.renderSettings = this.renderSettings.bind(this);

		this.getRoomDetails();
	}

	getRoomDetails() {
		fetch("/api/get-room" + "?code=" + this.roomCode)
			.then((response) => {
				if (!response.ok) {
					this.props.leaveRoomCallBack();
					this.props.history.push("/");
				}
				return response.json();
			})
			.then((data) => {
				this.setState({
					votesToSkip: data.votesToSkip,
					guestCanPause: data.guestCanPause,
					isHost: data.isHost,
				});
			})
			.catch((error) => console.log(error));
	}

	leaveRoom() {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
		};

		fetch("/api/leave-room/", requestOptions)
			.then((_response) => {
				this.props.leaveRoomCallBack();
				this.props.history.push("/");
			})
			.catch((error) => console.log(error));
	}

	updateShowSettings(value) {
		this.setState({
			showSettings: value,
		});
	}

	settingsButton() {
		return (
			<Grid item xs={12} align="center">
				<Button
					variant="contained"
					color="primary"
					onClick={() => this.updateShowSettings(true)}
				>
					Settings
				</Button>
			</Grid>
		);
	}

	renderSettings() {
		return (
			<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<CreateRoomPage
						update={true}
						votesToSkip={this.state.votesToSkip}
						guestCanPause={this.state.guestCanPause}
						roomCode={this.roomCode}
						updateCallBack={() => {}}
					/>
				</Grid>
				<Grid item xs={12} align="center">
					<Button
						variant="contained"
						color="secondary"
						onClick={() => this.updateShowSettings(false)}
					>
						Close Settings
					</Button>
				</Grid>
				<Grid item xs={12} align="center"></Grid>
			</Grid>
		);
	}

	render() {
		if (this.state.showSettings) {
			return this.renderSettings();
		}
		return (
			<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<Typography variant="h6" component="h6">
						Code: {this.roomCode}
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<Typography variant="h6" component="h6">
						Votes To Skip Song : {this.state.votesToSkip}
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<Typography variant="h6" component="h6">
						Guests Can Pause: {this.state.guestCanPause.toString()}
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<Typography variant="h6" component="h6">
						Host: {this.state.isHost.toString()}
					</Typography>
				</Grid>

				{this.state.isHost ? this.settingsButton() : null}

				<Grid item xs={12} align="center">
					<Button
						variant="contained"
						color="secondary"
						onClick={this.leaveRoom}
					>
						Leave Room
					</Button>
				</Grid>
			</Grid>
		);
	}
}
