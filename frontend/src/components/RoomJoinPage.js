import React, { Component } from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

export default class RoomJoinPage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Grid container spacing={1} alignItems="center">
				<Grid item xs={12}>
					<Typography variant="h4" component="h4">
						Join A Room
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<TextField
						error="error"
						label="Code"
						placeholder="Enter a Room Code"
						value={}
						helperText={}
						variant="outlined"
					/>
				</Grid>
			</Grid>
		);
	}
}
