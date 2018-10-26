import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';

import client from '../../apollo';
import cookieControl from '../../cookieControl';
import { apiPath } from '../../apiPath';
import { convertTime } from '../../timeConvertor';
import links from '../../links';

import LoadingIcon from '../__forall__/loader/app';

let clearCache = () => client.clearStore();

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
	generateContent = () => {
		let a = this.props.contributor.name,
				b = "";

		switch(this.props.eventType) {
			case 'CREATED_TWEET_EVENT':
				b = (
					<React.Fragment>
						<span className="rn-notifications-mat-notification-content-mat-content">Recent tweet from</span>
						<Link className="rn-notifications-mat-notification-content-mat-name" to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.contributor.url }` }>{ a }</Link>
					</React.Fragment>
				);
			break;
			case 'SUBSCRIBED_USER_EVENT':
				b = (
					<React.Fragment>
						<Link className="rn-notifications-mat-notification-content-mat-name" to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.contributor.url }` }>{ a }</Link>
						<span className="rn-notifications-mat-notification-content-mat-content">subscribed to you</span>
					</React.Fragment>
				);
			break;
			case 'LIKED_TWEET_EVENT':
				b = (
					<React.Fragment>
						<Link className="rn-notifications-mat-notification-content-mat-name" to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.contributor.url }` }>{ a }</Link>
						<span className="rn-notifications-mat-notification-content-mat-content">liked your tweet</span>
					</React.Fragment>
				);
			break;
			case 'COMMENTED_TWEET_EVENT':
				b = (
					<React.Fragment>
						<Link className="rn-notifications-mat-notification-content-mat-name" to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.contributor.url }` }>{ a }</Link>
						<span className="rn-notifications-mat-notification-content-mat-content">commented your tweet</span>
					</React.Fragment>
				);
			break;
			case 'LIKED_COMMENT_EVENT':
				b = (
					<React.Fragment>
						<Link className="rn-notifications-mat-notification-content-mat-name" to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.contributor.url }` }>{ a }</Link>
						<span className="rn-notifications-mat-notification-content-mat-content">liked your comment</span>
					</React.Fragment>
				);
			break;
			default:
				b = null;
			break;
		}

		return b;
	}

	generateTargetRedirect = () => {
		let a = this.props.eventType,
				b = "";

		switch(a) {
			case 'CREATED_TWEET_EVENT':
			case 'COMMENTED_TWEET_EVENT':
			case 'LIKED_TWEET_EVENT':
			case 'LIKED_COMMENT_EVENT':
				b = `${ links["TWEET_PAGE"] }/${ this.props.redirectID }`;
			break;
			case 'SUBSCRIBED_USER_EVENT':
				b = `${ links["ACCOUNT_PAGE"] }/${ this.props.redirectID }`;
			break;
			default:
				b = "#";
			break;
		}

		return b;
	}

	render() {
		return(
			<React.Fragment>
				<div className="rn-notifications-mat-notification">
					<div className="rn-notifications-mat-notification-sizer">{ /* icon here */ }</div>
					<div className="rn-notifications-mat-notification-content">
						<Link
							className="rn-notifications-mat-notification-content-redirect"
							to={ this.generateTargetRedirect() }
						/>
						<div className="rn-notifications-mat-notification-content-creators">
							<Link className="rn-notifications-mat-notification-content-creators-creator" to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.contributor.url }` }>
								<img src={ this.props.contributor.image ? apiPath + this.props.contributor.image : "" } alt="" />
							</Link>
						</div>
						<div className="rn-notifications-mat-notification-content-mat">
							{ this.generateContent() }
						</div>
						{
							(this.props.content) ? (
								<p className="rn-notifications-mat-notification-content-twpreview">
									{ this.props.content }
								</p>
							) : null
						}
						<p className="rn-notifications-mat-notification-content-twpreview">
							{ convertTime(this.props.time, " ago") }
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
		if(this.props.isLoading) return <LoadingIcon />;
		if(this.props.data && !this.props.data.length) return(
			<span className="rn-notifications-inf">Hmm. I haven't found anything here</span>
		);

		return(
			<div className="rn-notifications-mat">
			{
				this.props.data.map(({ id, contributor, eventType, shortContent, redirectID, time }) => (
					<Notification
						key={ id }
						id={ id }
						contributor={ contributor }
						eventType={ eventType }
						redirectID={ redirectID }
						content={ shortContent }
						time={ time }
					/>
				))
			}
			</div>
		);
	}
}

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			stage: "ALL_STAGE",
			notifications: false
		}
	}

	componentDidMount() {
		this.fetchAPI();
	}

	componentDidUpdate(a) {
		let b = this.props;

		{ // Subscription > New notification
			let c = a.addedNotification.receivedNotification,
					d = b.addedNotification.receivedNotification;
			if((!c && d) || (c && d && c.id !== d.id )) {
				let a = Array.from(this.state.notifications);
				a.unshift(d);
				this.setState(() => ({
					notifications: a
				}));
			}
		}
	}

	fetchAPI = () => {
		let variables = cookieControl.get("userdata");

		client.query({
      query: gql`
				query($id: ID!, $login: String!, $password: String!) {
					user(id: $id, login: $login, password: $password) {
						id,
						notifications {
							id,
							eventType,
							redirectID,
							time,
							shortContent,
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
		}).then(({ data: { user: { notifications } } }) => {
			if(notifications === null) return;

			this.setState(() => {
				return {
					notifications: notifications
				}
			})
		});
	}

	destroyNotifications = () => {
		let variables = cookieControl.get("userdata");
		this.props.destroyNotifications(
			{ variables }
		).then(({ data: { destroyNotifications } }) => {
			if(destroyNotifications) {
				this.setState(() => {
					return {
						notifications: []
					}
				}, clearCache);
			} else {
				this.props.history.push(links["NOT_FOUND_PAGE"]);
			}
		});
	}

	render() {
		return(
			<div className="rn-notifications">
				<div className="rn-notifications-title">
					<h1 className="rn-notifications-title-mat">Notifications</h1>
					<button
						className="rn-notifications-title-dsthis"
						onClick={ this.destroyNotifications }>
						<i className="fas fa-trash" />
					</button>
				</div>
				<Br />
				<Nav
					currStage={ this.state.stage }
				/>
				<Br />
				<Notifications
					isLoading={ this.state.notifications === false }
					data={ this.state.notifications || [] }
				/>
			</div>
		);
	}
}

export default compose(
	graphql(gql`
		mutation($id: ID!, $login: String!, $password: String!) {
			destroyNotifications(id: $id, login: $login, password: $password)
		}
	`, { name: "destroyNotifications" }),
	graphql(gql`
		subscription($id: ID!) {
			receivedNotification(id: $id) {
		    id,
				eventType,
				redirectID,
				time,
				shortContent,
				contributor {
					image,
					name,
					url
				}
		  }
		}
	`, {
		name: "addedNotification",
		options: {
			variables: {
				id: cookieControl.get("userdata").id
			}
		}
	})
)(App);