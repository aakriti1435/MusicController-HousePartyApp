import React, { Component } from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

export default class RoomJoinPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			roomCode: "",
			error: "",
		};
		this.handleRoomCode = this.handleRoomCode.bind(this);
		this.roomButtonPressed = this.roomButtonPressed.bind(this);
	}

	handleRoomCode(e) {
		this.setState({
			roomCode: e.target.value,
		});
	}

	roomButtonPressed() {
		console.log(this.state.roomCode);
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				code: this.state.roomCode,
			}),
		};

		fetch("/api/join-room/", requestOptions)
			.then((response) => {
				if (response.ok) {
					this.props.history.push(`/room/${this.state.roomCode}`);
				} else {
					this.setState({ error: "Room not Found" });
				}
			})
			.catch((error) => console.log(error));
	}

	render() {
		return (
			<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<Typography variant="h4" component="h4">
						Join A Room
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<TextField
						error={this.state.error}
						label="Code"
						placeholder="Enter a Room Code"
						value={this.state.roomCode}
						helperText={this.state.error}
						variant="outlined"
						onChange={this.handleRoomCode}
					/>
				</Grid>
				<Grid item xs={12} align="center">
					<Button
						onClick={this.roomButtonPressed}
						color="primary"
						variant="contained"
					>
						Enter Room
					</Button>
				</Grid>
				<Grid item xs={12} align="center">
					<Button
						color="secondary"
						variant="contained"
						to="/"
						component={Link}
					>
						Go Back
					</Button>
				</Grid>
			</Grid>
		);
	}
}
