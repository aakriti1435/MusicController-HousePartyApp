import React, { Component } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

export default class HomePage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Grid container spacing={3}>
				<Grid item xs={12} align="center">
					<Typography variant="h3" component="h3">
						House Party
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<ButtonGroup
						disableElevation
						variant="contained"
						color="primary"
					>
						<Button color="primary" to="/join" component={Link}>
							Join A Room
						</Button>
						<Button color="default" to="/info" component={Link}>
							Info
						</Button>
						<Button color="secondary" to="/create" component={Link}>
							Create A Room
						</Button>
					</ButtonGroup>
				</Grid>
			</Grid>
		);
	}
}
