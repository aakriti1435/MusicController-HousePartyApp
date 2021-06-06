import React, { Component } from "react";
import { render } from "react-dom";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect,
} from "react-router-dom";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import HomePage from "./HomePage";

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			roomCode: null,
		};
	}

	async componentDidMount() {
		fetch("/api/user-room")
			.then((response) => response.json())
			.then((data) => {
				this.setState({
					roomCode: data.code,
				});
			});
	}

	render() {
		return (
			<div className="center">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => {
								return this.state.roomCode ? (
									<Redirect
										to={`/room/${this.state.roomCode}`}
									/>
								) : (
									<HomePage />
								);
							}}
						/>
						<Route path="/join" component={RoomJoinPage} />
						<Route path="/create" component={CreateRoomPage} />
						<Route path="/room/:roomCode" component={Room} />
					</Switch>
				</Router>
			</div>
		);
	}
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
