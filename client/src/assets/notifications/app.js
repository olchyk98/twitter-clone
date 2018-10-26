import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';

import client from '../../apollo';
import cookieControl from '../../cookieControl';

const image = "https://pbs.twimg.com/profile_images/1040133177279434753/_0WCrXJp_normal.jpg";

class Br extends Component {
	render() {
		return(
			<div className="rn-notifications-br" />
		);
	}
}

class NavButton extends Component {
	render() {
		return(
			<button className="rn-notifications-nav-btn active">{ this.props.text }</button>
		);
	}
}

class Nav extends Component {
	render() {
		return(
			<div className="rn-notifications-nav">
				{
					[
						{
							text: "All",
							stageName: "ALL_STAGE"
						}
					].map(({ text, stageName }, index) => (
						<NavButton
							key={ index }
							active={ stageName === this.props.currStage }
							text={ text }
						/>
					))
				}
			</div>
		);
	}
}

class Notification extends Component {
	render() {
		return(
			<React.Fragment>
				<div className="rn-notifications-mat-notification">
					<div className="rn-notifications-mat-notification-sizer">{ /* some star or icon here */ }</div>
					<div className="rn-notifications-mat-notification-content">
						<div className="rn-notifications-mat-notification-content-redirect" />
						<div className="rn-notifications-mat-notification-content-creators">
							<div className="rn-notifications-mat-notification-content-creators-creator">
								<img src={ image } alt="" />
							</div>
						</div>
						<div className="rn-notifications-mat-notification-content-mat">
							<div className="rn-notifications-mat-notification-content-mat-name">
								<span>Oles Odynets</span>
							</div>
							<span className="rn-notifications-mat-notification-content-mat-content">Something hello</span>
						</div>
						<p className="rn-notifications-mat-notification-content-twpreview">
							Chill the life Chill the life Chill the life Chill the life Chill the life Chill the life Chill the life 
						</p>
					</div>
				</div>
				<Br />
			</React.Fragment>
		);
	}
}

class Notifications extends Component {
	render() {
		return(
			<div className="rn-notifications-mat">
				<Notification />
				<Notification />
				<Notification />
				<Notification />
				<Notification />
				<Notification />
				<Notification />
				<Notification />
				<Notification />
				<Notification />
			</div>
		);
	}
}

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			stage: "ALL_STAGE",
			notifications: []
		}
	}

	componentDidMount() {
		this.fetchAPI();
	}

	fetchAPI = () => {
		let variables = cookieControl.get("userdata");

		client.query({
      query: gql`
				query($id: ID!, $login: String!, $password: String!) {
					user(id: $id, login: $login, password: $password) {
						notifications {
							id,
							contributorID,
							eventType,
							redirectID,
							contributor {
								image,
								name,
								url
							}
						}
					}
				}
			`,
			variables
		})
	}

	render() {
		return(
			<div className="rn-notifications">
				<div className="rn-notifications-title">
					<h1 className="rn-notifications-title-mat">Notifications</h1>
				</div>
				<Br />
				<Nav
					currStage={ this.state.stage }
				/>
				<Br />
				<Notifications />
			</div>
		);
	}
}

export default App;