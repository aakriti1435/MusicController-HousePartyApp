import React, { Component } from "react";
import {
	Button,
	Grid,
	Typography,
	TextField,
	FormHelperText,
	FormControl,
	Radio,
	RadioGroup,
	FormControlLabel,
	Collapse,
} from "@material-ui/core";
import { Link } from "react-router-dom";

export default class CreateRoomPage extends Component {
	static defaultProps = {
		votesToSkip: 2,
		guestCanPause: true,
		update: false,
		roomCode: null,
		updateCallBack: () => {},
	};
	constructor(props) {
		super(props);
		this.state = {
			guestCanPause: this.props.guestCanPause,
			votesToSkip: this.props.votesToSkip,
			errorMsg: "",
			successMsg: "",
		};

		this.handleCreateRoom = this.handleCreateRoom.bind(this);
		this.handleGuestCanPause = this.handleGuestCanPause.bind(this);
		this.handleVotes = this.handleVotes.bind(this);
		this.handleUpdateRoom = this.handleUpdateRoom.bind(this);
	}

	handleVotes(e) {
		this.setState({
			votesToSkip: e.target.value,
		});
	}

	handleGuestCanPause(e) {
		this.setState({
			guestCanPause: e.target.value === "true" ? true : false,
		});
	}

	handleCreateRoom() {
		console.log(this.state);
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				votesToSkip: this.state.votesToSkip,
				guestCanPause: this.state.guestCanPause,
			}),
		};
		fetch("/api/create-room/", requestOptions)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				this.props.history.push("/room/" + data.code);
			})
			.catch((error) => console.log(error));
	}

	handleUpdateRoom() {
		console.log(this.state);
		const requestOptions = {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				votesToSkip: this.state.votesToSkip,
				guestCanPause: this.state.guestCanPause,
				code: this.props.roomCode,
			}),
		};
		fetch("/api/update-room/", requestOptions)
			.then((response) => {
				if (response.ok) {
					this.setState({
						successMsg: "Room Settings updated Successfully!",
					});
				} else {
					this.setState({
						errorMsg: "Error Updating Room Settings",
					});
				}
			})
			.catch((error) => console.log(error));
	}

	renderCreateRoomButtons() {
		return (
			<>
				<Grid item xs={12} align="center">
					<Button
						onClick={this.handleCreateRoom}
						color="primary"
						variant="contained"
					>
						Create A Room
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
			</>
		);
	}

	renderUpdateRoomButtons() {
		return (
			<Grid item xs={12} align="center">
				<Button
					onClick={this.handleUpdateRoom}
					color="primary"
					variant="contained"
				>
					Update Room Settings
				</Button>
			</Grid>
		);
	}

	render() {
		return (
			<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<Collapse
						in={
							this.state.errorMsg != "" ||
							this.state.successMsg != ""
						}
					>
						{this.state.successMsg}
					</Collapse>
				</Grid>
				<Grid item xs={12} align="center">
					<Typography component="h4" variant="h4">
						{this.props.update ? "Room Settings" : "Create a Room"}
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<FormControl component="fieldset">
						<FormHelperText>
							<div align="center">
								Guest Control of Playback State
							</div>
						</FormHelperText>
						<RadioGroup
							onChange={this.handleGuestCanPause}
							row
							defaultValue={this.state.guestCanPause.toString()}
						>
							<FormControlLabel
								value="true"
								control={<Radio color="primary" />}
								label="Play/Pause"
								labelPlacement="bottom"
							/>
							<FormControlLabel
								value="false"
								control={<Radio color="secondary" />}
								label="No Control"
								labelPlacement="bottom"
							/>
						</RadioGroup>
					</FormControl>
				</Grid>
				<Grid item xs={12} align="center">
					<FormControl>
						<TextField
							onChange={this.handleVotes}
							required={true}
							type="number"
							defaultValue={this.state.votesToSkip}
							inputProps={{
								min: 1,
								style: { textAlign: "center" },
							}}
						/>
						<FormHelperText>
							<div align="center">
								Votes Required to Skip Song
							</div>
						</FormHelperText>
					</FormControl>
				</Grid>
				{this.props.update
					? this.renderUpdateRoomButtons()
					: this.renderCreateRoomButtons()}
			</Grid>
		);
	}
}
