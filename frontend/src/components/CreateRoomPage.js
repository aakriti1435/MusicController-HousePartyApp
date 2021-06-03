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
} from "@material-ui/core";
import { Link } from "react-router-dom";

export default class CreateRoomPage extends Component {
	defaultVotes = 2;
	constructor(props) {
		super(props);
		this.state = {
			guestsCanPause: true,
			votesToSkip: this.defaultVotes,
		};

		this.handleCreateRoom = this.handleCreateRoom.bind(this);
		this.handleGuestCanPause = this.handleGuestCanPause.bind(this);
		this.handleVotes = this.handleVotes.bind(this);
	}

	handleVotes(e) {
		this.setState({
			votesToSkip: e.target.value,
		});
	}

	handleGuestCanPause(e) {
		this.setState({
			guestsCanPause: e.target.value === "true" ? true : false,
		});
	}

	handleCreateRoom() {
		console.log(this.state);
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				votesToSkip: this.state.votesToSkip,
				guestCanPause: this.state.guestsCanPause,
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

	render() {
		return (
			<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<Typography component="h4" variant="h4">
						Create A Room
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
							defaultValue="true"
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
							defaultValue={this.defaultVotes}
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
			</Grid>
		);
	}
}
