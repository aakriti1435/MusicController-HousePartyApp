import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default class Room extends Component {
	constructor(props) {
		super(props);
		this.state = {
			votesToSkip: 2,
			guestCanPause: false,
			isHost: false,
			showSettings: false,
			spotifyAuthenticated: false,
			song: {},
		};
		this.roomCode = this.props.match.params.roomCode;
		this.leaveRoom = this.leaveRoom.bind(this);
		this.updateShowSettings = this.updateShowSettings.bind(this);
		this.settingsButton = this.settingsButton.bind(this);
		this.renderSettings = this.renderSettings.bind(this);
		this.getRoomDetails = this.getRoomDetails.bind(this);
		this.authenticateSpotify = this.authenticateSpotify.bind(this);
		this.getCurrentSong = this.getCurrentSong.bind(this);

		this.getRoomDetails();
	}

	componentDidMount() {
		this.interval = setInterval(this.getCurrentSong, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
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
				if (this.state.isHost) {
					this.authenticateSpotify();
				}
			})
			.catch((error) => console.log(error));
	}

	authenticateSpotify() {
		fetch("/spotify/is-authenticated")
			.then((response) => response.json())
			.then((data) => {
				this.setState({
					spotifyAuthenticated: data.status,
				});
				if (!data.status) {
					fetch("/spotify/get-auth-url")
						.then((response) => response.json())
						.then((data) => {
							window.location.replace(data.url);
						})
						.catch((error) => console.log(error.message));
				}
			})
			.catch((error) => console.log(error.message));
	}

	getCurrentSong() {
		fetch("/spotify/current-song")
			.then((response) => {
				if (!response.ok) {
					return {};
				} else {
					return response.json();
				}
			})
			.then((data) => {
				this.setState({ song: data });
				console.log(data);
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
						updateCallBack={this.getRoomDetails}
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

				<MusicPlayer {...this.state.song} />

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
