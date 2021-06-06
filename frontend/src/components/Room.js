import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";

export default class Room extends Component {
	constructor(props) {
		super(props);
		this.state = {
			votesToSkip: 2,
			guestCanPause: false,
			isHost: false,
		};
		this.roomCode = this.props.match.params.roomCode;
		this.leaveRoom = this.leaveRoom.bind(this);
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

	render() {
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
