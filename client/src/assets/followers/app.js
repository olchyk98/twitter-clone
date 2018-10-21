import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { compose, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';

import client from '../../apollo'
import cookieControl from '../../cookieControl';
import links from '../../links';
import { apiPath } from '../../apiPath';

const clearCache = () => client.clearStore();
function destroySession() {
	cookieControl.delete("userdata");
  return window.location.href = links["REGISTER_PAGE"];
}

class UsersUser extends Component {
	constructor(props) {
		super(props);

		this.state = {
			subscriptionFromState: false,
			isSubscribed: false,
			subscriptionAllowed: true
		}
	}

	getSubscription = () => {
		return (!this.state.subscriptionFromState) ? this.props.isSubscribed : this.state.isSubscribed;
	}

	subscribeTo = () => {
		if(!this.state.subscriptionAllowed) return;

		{
			let a = this.getSubscription();
			this.setState(() => {
				return {
					subscriptionFromState: true,
					isSubscribed: !a,
					subscriptionAllowed: false
				}
			});
		}

		let { id, login, password } = cookieControl.get("userdata")
		this.props.followUser({
			variables: {
				id, login, password,
				targetID: this.props.id
			}
		}).then(({ data: { subscribeUser: subscribed } }) => {
			if(subscribed === null) destroySession();

			clearCache();

			this.setState(() => {
				return {
					isSubscribed: subscribed,
					subscriptionAllowed: true
				}
			}, this.props.onClearCache);
		})
	}

	render() {
		return(
			<div className="rn-followers-users-user">
				<div className="rn-followers-users-user-image">
					<Link to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.url }` }>
						<img
							className="rn-followers-users-user-image-mat"
							src={ apiPath + this.props.image }
							alt={ this.props.name }
						/>
					</Link>
				</div>
				<div className="rn-followers-users-user-content">
					<div className="rn-followers-users-user-content-name">
						<div className="rn-followers-users-user-content-mat">
							<div className="rn-followers-users-user-content-mat-name">
								<Link to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.url }` }>
									<span className="rn-followers-users-user-content-mat-name-mat">{ this.props.name }</span>
								</Link>
								{
									(!this.props.isVertificated) ? null:(
										<svg className="rn-followers-users-user-content-mat-name-verf">
											<g>
												<path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25a3.606 3.606 0 0 0-1.336-.25c-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5a.749.749 0 0 1-1.041.208l-.115-.094-2.415-2.415a.749.749 0 1 1 1.06-1.06l1.77 1.767 3.825-5.74a.75.75 0 0 1 1.25.833z"></path>
											</g>
										</svg>
									)
								}
							</div>
							<span className="rn-followers-users-user-content-mat-url">@{ this.props.url }</span>
						</div>
						<div className="rn-followers-users-user-content-controls">
							<button
								className={ `rn-followers-users-user-content-controls-btn${ (!this.getSubscription()) ? "" : " active" }` }
								onClick={ this.subscribeTo }>
								{ (!this.getSubscription()) ? "Follow" : "Following" }
							</button>
						</div>
					</div>
					<p className="rn-followers-users-user-content-mat">
						Chill the life Chill the life Chill the life Chill the life Chill the life Chill the life Chill the life Chill the life Chill the life Chill the life Chill the life Chill the life 
					</p>
				</div>
			</div>
		);
	}
}

class Split extends Component {
	render() {
		return(
			<div className="rn-followers-split" />
		);
	}
}

class Users extends Component {
	render() {
		return(
			<div className="rn-followers-users">
				{
					this.props.users.map(({ id, url, name, profileDescription, image, isVertificated, requesterIsSubscriber }) => {
						return(
							<UsersUser
								key={ id }
								id={ id }
								url={ url }
								isVertificated={ isVertificated }
								name={ name }
								image={ image }
								isSubscribed={ requesterIsSubscriber }
								profileDescription={ profileDescription.substr(0, 80) + "..." } // XXX
								followUser={ this.props.followUser }
								onClearCache={ this.props.onClearCache }
							/>
						);
					})
				}

				<Split />
			</div>
		);	
	}
}

class TopicButton extends Component {
	render() {
		return(
			<button
				className={ `rn-followers-menu-btn${ (this.props.inFocus) ? " active" : "" }` }
				onClick={ this.props.onChoose }>
				{ this.props.focusName }
			</button>
		);
	}
}

class Topics extends Component {
	render() {
		return(
			<div className="rn-followers-menu">
				{
					[
						{
							focusName: "Followers",
							focusStage: "FOLLOWERS_STAGE"
						},
						{
							focusName: "Following",
							focusStage: "FOLLOWING_STAGE"
						}
					].map(({ focusName, focusStage }, index) => {
						return(
							<TopicButton
								key={ index }
								inFocus={ this.props.reqStage === focusStage }
								focusName={ focusName }
								onChoose={ () => this.props.setStage(focusStage) }
							/>
						);
					})
				}
			</div>
		);
	}
}

class BackNav extends Component {
	render() {
		return(
			<Link className="rn-followers-backnav" to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.url }` }>
				<button className="rn-followers-backnav-btn">
					<i className="fas fa-arrow-left" />
				</button>
				{
					(this.props.requestedImage) ? (
						<img
							className="rn-followers-backnav-mg"
							src={ apiPath + this.props.requestedImage }
							alt={ "back arrow user nav" }
						/>
					) : null
				}
			</Link>
		);
	}
}

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			reqStage: "FOLLOWERS_STAGE",
			following: false,
			followers: false,
			isFetching: true
		}

		this.stages = {
			"FOLLOWERS_STAGE": "followers",
			"FOLLOWING_STAGE": "following"
		}

		this.backUrl = null;
	}

	componentDidMount() {
		{
			let a = this.props.match.params.direct;
			if(a && !this.state[a] && this.state[a] !== false) return this.props.history.push(links["NOT_FOUND_PAGE"]);
			else this.fetchUsers(a || this.stages[this.state.reqStage]);
		}
		
		this.backUrl = (new URL(window.location.href)).searchParams.get("b") === "true";
		if(!this.backUrl) window.history.replaceState(null, null, window.location.pathname);
	}

	fetchUsers = type => {
		let stagesRev = {
			"followers": "FOLLOWERS_STAGE",
			"following": "FOLLOWING_STAGE"
		}

		this.setState(({ reqStage }) => {
			return {
				isFetching: true,
				reqStage: stagesRev[type] || reqStage
			}
		});

		let query = null;
		switch(type) {
			case 'following':
				query = gql`
					query($id: ID!, $login: String!, $password: String!, $targetUrl: String!) {
					  user(id: $id, login: $login, password: $password, targetUrl: $targetUrl) {
					    id,
					    image,
					    subscribedTo {
					    	id,
					    	name
					      image,
					      url,
					      isVertificated,
					      profileDescription,
					      requesterIsSubscriber(id: $id, login: $login, password: $password)
					    }
					  }
					}
				`;
			break;
			case 'followers':
			default:
				query = gql`
					query($id: ID!, $login: String!, $password: String!, $targetUrl: String!) {
					  user(id: $id, login: $login, password: $password, targetUrl: $targetUrl) {
					    id,
					    image,
					    subscribers {
					    	id,
					      image,
					      name
					      url,
					      isVertificated,
					      profileDescription,
					      requesterIsSubscriber(id: $id, login: $login, password: $password)
					    }
					  }
					}
				`;
			break;
		}

		let { id, login, password } = cookieControl.get("userdata");
		client.query({
			query: query,
			variables: {
				id, login, password,
				targetUrl: this.props.match.params.url || ""
			}
		}).then(({ data: { user } }) => {
			this.setState(() => {
				return {
					[type]: user,
					isFetching: false
				}
			});
		})
	}

	getUsers = () => {
		if(this.state.isFetching) return [];

		switch(this.state.reqStage) {
			case 'FOLLOWERS_STAGE':
				if(!this.state.followers) { // unknown user
					this.props.history.push(links["NOT_FOUND_PAGE"]);
					return [];
				} else {
					return this.state.followers.subscribers;
				}
			break;
			case 'FOLLOWING_STAGE':
				if(!this.state.following) { // unknown user
					this.props.history.push(links["NOT_FOUND_PAGE"]);
					return [];
				} else {
					return this.state.following.subscribedTo;
				}
			break;
			default:
				return [];
			break;
		}
	}

	setStage = stage => {
		if(this.state.reqStage === stage) return;

		let a = this.stages[stage];
		this.setState(state => {
			return {
				reqStage: stage,
				isFetching: !state[a] ? false:true
			}
		});

		this.fetchUsers(a);
	}

	clearCache = () => {
		let a = this.stages,
				b = Object.keys(a),
				c = {},
				d = this.state.reqStage;
		b.forEach(io => {
			if(d !== io) c[a[io]] = false;
		});

		this.setState(() => {
			return c;
		});
	}

	render() {
		if(this.state[this.stages[this.state.reqStage]] === false) { // loading
			return(
				<div className={ `rn-followers${ (this.backUrl) ? " backable" : "" }` }>
					{ (this.backUrl) ? <BackNav /> : null }
					<Topics 
						reqStage={ this.state.reqStage }
						setStage={ this.setStage }
					/>
					<div className="rn-followers-loader" />
				</div>
			);
		}

		return(
			<div className={ `rn-followers${ (this.backUrl) ? " backable" : "" }` }>
				{
					(this.backUrl) ? (
						<BackNav
							requestedImage={ this.state.followers.image || this.state.following.image }
							url={ this.props.match.params.url }
						/>
					) : null
				}
				<Topics 
					reqStage={ this.state.reqStage }
					setStage={ this.setStage }
				/>
				<Users
					users={ this.getUsers() }
					followUser={ this.props.followUser }
					onClearCache={ this.clearCache }
				/>
			</div>
		);
	}
}

export default compose(
	graphql(gql`
		mutation($id: ID!, $login: String!, $password: String!, $targetID: ID!) {
			subscribeUser(id: $id, login: $login, password: $password, targetID: $targetID)
		}
	`, { name: "followUser" })
)(App);