import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { compose, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';

import client from '../../apollo';
import cookieControl from '../../cookieControl';
import links from '../../links';
import { apiPath } from '../../apiPath';
import { convertTime } from '../../timeConvertor';

import VertificatedStar from '../__forall__/vertificated/app';
import LoadingIcon from '../__forall__/loader/app';

let clearCache = () => client.clearStore();

const searchFrq = 300;

class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			inFocus: false,
			reqValue: ""
		}

		this.searchIN = null;
		this.inpSearch = React.createRef();
	}

	componentDidMount() {
		this.inpSearch.focus();
	}

	validateRequest = ({ target: { value } }) => {
		this.setState({ reqValue: value }, () => {
			clearTimeout(this.searchIN);
			this.searchIN = setTimeout(() => this.props.onRequest(this.state.reqValue), searchFrq);
		});
	}

	render() {
		return(
			<div className="rn-search-mat">
				<div className={ `rn-search-mat-search${ (!this.state.inFocus) ? "" : " focus" }` }>
					<div className="rn-search-mat-search-icon">
						<i className="fas fa-search" />
					</div>
					<input
						className="rn-search-mat-search-mat"
						text="text"
						placeholder="Search"
						onFocus={ () => this.setState({ inFocus: true }) }
						onBlur={ () => this.setState({ inFocus: false }) }
						value={ this.state.reqValue }
						ref={ ref => this.inpSearch = ref }
						onChange={ this.validateRequest }
					/>
				</div>
			</div>
		);
	}
}

class BlockUser extends Component {
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

	subscribeUser = () => {
		if(!this.state.subscriptionAllowed) return;

		let a = this.getSubscription();

		this.setState(() => {
			return {
				isSubscribed: !a,
				subscriptionFromState: true,
				subscriptionAllowed: false
			}
		});

		let { id, login, password } = cookieControl.get("userdata");

		this.props.followUser({
			variables: {
				id, login, password,
				targetID: this.props.id
			}
		}).then(({ data: { subscribeUser: isSubscribed } }) => {
			clearCache();

			this.setState(() => {
				return {
					isSubscribed,
					subscriptionAllowed: true
				}
			});
		});
	}

	render() {
		return(
			<React.Fragment>
				<div className="rn-search-block-disp-item">
					<Link
						className="rn-search-block-disp-item-image"
						to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.url }` }>
						<img src={ apiPath + this.props.image } alt="" />
					</Link>
					<div className="rn-search-block-disp-item-content">
						<div className="rn-search-block-disp-item-content-creator">
							<Link to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.url }` }>
								<div className="rn-search-block-disp-item-content-creator-name">
									<span>{ this.props.name }</span>
									<VertificatedStar />
								</div>
								<span className="rn-search-block-disp-item-content-creator-url">@{ this.props.url }</span>
							</Link>
							<div>
								<button
									className={ `rn-search-block-disp-item-content-creator-flbtn${ (!this.getSubscription()) ? "" : " active" }` }
									onClick={ this.subscribeUser }>
									{ (!this.getSubscription()) ? "Follow" : "Following" }
								</button>
							</div>
						</div>
						{
							(!this.props.description) ? null : (
								<p className="rn-search-block-disp-item-content-mat">
									{ this.props.description }
								</p>
							)
						}
					</div>
				</div>
				<UsersSplit />
			</React.Fragment>
		);
	}
}

class BlockTweet extends Component {
	constructor(props) {
		super(props);

		this.state = {
			likes: {
				fromState: false,
				likable: true,
				likes: 0,
				isLiked: false
			}
		}
	}

	getLikeSource = () => {
		return (!this.state.likes.fromState) ? this.props : this.state.likes;
	}

	likeTweet = () => {
		if(!this.state.likes.likable) return;

		let a = Object.assign({}, this.getLikeSource());
		this.setState(({ likes }) => {
			return {
				likes: {
					...likes,
					fromState: true,
					likes: !a.isLiked ? a.likes + 1 : a.likes - 1,
					isLiked: !a.isLiked,
					likable: false
				}
			}
		});

		let { id, login, password } = cookieControl.get("userdata");
		this.props.likeTweet({
			variables: {
				id, login, password,
				targetID: this.props.id
			}
		}).then(({ data: { likeTweet: isLiked } }) => {
			this.setState(({ likes }) => {
				return {
					likes: {
						...likes,
						isLiked,
						likes: isLiked ? a.likes + 1 : a.likes - 1,
						likable: true
					}
				}
			});
		});
	}

	render() {
		return(
			<React.Fragment>
				<div className="rn-search-block-disp-titem">
					<div className="rn-search-block-disp-titem-mg">
						<img src={ apiPath + this.props.creator.image } alt={ this.props.creator.name } />
					</div>
					<div className="rn-search-block-disp-titem-mg-content">
						<Link
							className="rn-search-block-disp-titem-mg-content-redirect"
							to={ `${ links["TWEET_PAGE"] }/${ this.props.id }` }
						/>
						<div className="rn-search-block-disp-titem-mg-content-creatorinf">
							<div className="rn-search-block-disp-titem-mg-content-creatorinf-name">
								<span>{ this.props.creator.name }</span>
								{
									(!this.props.creator.isVertificated) ? null : (
										<VertificatedStar />
									)
								}
							</div>
							<span>@{ this.props.creator.url }</span>
							<span>•</span>
							<span>{ convertTime(this.props.time) }</span>
						</div>
						<p className="rn-search-block-disp-titem-mg-content-mat">{ this.props.content }</p>
						<div className="rn-search-block-disp-titem-mg-content-controls">
							<Link className="rn-search-block-disp-titem-mg-content-controls-btn" to={ `${ links["TWEET_PAGE"] }/${ this.props.id }` }>
								<i className="far fa-comment" />
								<span>{ this.props.comments }</span>
							</Link>
							<button
								className={ `rn-search-block-disp-titem-mg-content-controls-btn like${ (!this.getLikeSource().isLiked) ? "" : " active" }` }
								key={ (this.getLikeSource().isLiked) ? "A":"B" }
								onClick={ this.likeTweet }>
								<i className={ (!this.getLikeSource().isLiked) ? "far fa-heart" : "fas fa-heart" } />
								<span>{ this.getLikeSource().likes }</span>
							</button>
						</div>
					</div>
				</div>
				<UsersSplit />
			</React.Fragment>
		);
	}
}

class UsersSplit extends Component {
	render() {
		return(
			<div className="rn-search-block-split" />
		);
	}
}

class Block extends Component {
	constructor(props) {
		super(props);

		this.state = {
			opened: true
		}
	}

	convertContent = () => {
		let a = this.props.data;
		switch(this.props.title) {
			case 'Tweets':
				return(
					a.map(({ id, likesInt: likes, commentsInt: comments, time, content, creator, isLiked }) => {
						return(
							<BlockTweet
								key={ id }
								id={ id }
								likes={ likes }
								comments={ comments }
								time={ time }
								content={ content }
								creator={ creator }
								isLiked={ isLiked }
								likeTweet={ this.props.likeTweet }
							/>
						);
					})
				);
			break;
			case 'Users':
				return(
					a.sort((io, ia) => ia - io).map(({ id, name, url, image, isVertificated, requesterIsSubscriber: isSubscribed, profileDescription }) => {
						return(
							<BlockUser
								key={ id }
								id={ id }
								name={ name }
								image={ image }
								url={ url }
								isVertificated={ isVertificated }
								isSubscribed={ isSubscribed }
								description={ profileDescription }
								followUser={ this.props.followUser }
							/>
						);
					})
				);
			break;
		}
	}

	render() {
		if(!this.props.data.length) return null;

		return(
			<div className="rn-search-block">
				<div className="rn-search-block-title" onClick={ () => this.setState(({ opened }) => ({ opened: !opened })) }>
					<span className="rn-search-block-title-mat">{ this.props.title }</span>
					<div className={ `rn-search-block-title-status${ (this.state.opened) ? " opened" : "" }` }>
						<i className="fas fa-angle-up" />
					</div>
				</div>
				<UsersSplit />
				<div className={ `rn-search-block-disp${ (this.state.opened) ? " opened" : "" }` }>
					{ this.convertContent() }
				</div>
			</div>
		);
	}
}

class App extends Component {
	constructor(props) {
		super(props);

		this.initialBlocks = {
			users: false,
			tweets: false
		}

		this.state = {
			blocks: this.initialBlocks,
			isFetching: false
		}
	}

	sendRequest = request => {
		if(!request.replace(/ /g, "").length) {
			return this.setState(() => {
				return {
					blocks: this.initialBlocks
				}
			});
		}

		let { id, login, password } = cookieControl.get("userdata");

		// Clear previous results
		this.setState(() => {
			return {
				blocks: this.initialBlocks,
				isFetching: true
			}
		});

		// Search in tweets
		client.query({
			query: gql`
				query($id: ID, $login: String, $password: String, $request: String) {
				  searchUsers(
				    id: $id,
				    login: $login,
				    password: $password,
				    request: $request
				  ) {
				    id
				    name,
				    url,
				    subscribersInt,
				    requesterIsSubscriber(id: $id, login: $login, password: $password),
				    image,
				    isVertificated,
				    profileDescription
				  }
				}
			`,
			variables: {
				id, login, password, request
			}
		}).then(({ data: { searchUsers: users } }) => {
			this.setState(({ blocks }) => {
				return {
					blocks: {
						...blocks,
						users
					},
					isFetching: false
				}
			})
		});

		// Search in users
		client.query({
			query: gql`
				query($id: ID!, $login: String!, $password: String!, $request: String!) {
				  searchTweets(
				    id: $id,
				    login: $login,
				    password: $password,
				    request: $request
				  ) {
				    id
				    likesInt
				    commentsInt,
				    time,
				    content,
				    isLiked(id: $id),
				    creator {
				    	id,
				    	url,
				    	image,
				    	name,
				    	isVertificated,
				    }
				  }
				}
			`,
			variables: {
				id, login, password, request
			}
		}).then(({ data: { searchTweets: tweets } }) => {
			this.setState(({ blocks }) => {
				return {
					blocks: {
						...blocks,
						tweets
					},
					isFetching: false
				}
			})
		});
	}

	getData = rq => {
		let a = this.state.blocks;
		return (a.users !== false && a.tweets !== false) ? a[rq] : [];
	}

	render() {
		return(
			<div className="rn-search">
				<Search
					onRequest={ this.sendRequest }
				/>
				{
					(!this.state.isFetching) ? null : (
						<LoadingIcon />
					)
				}
				{
					(this.state.blocks.users && this.state.blocks.tweets && !this.getData("users").length && !this.getData("tweets").length) ? (
						<p className="rn-search-err">Sorry. We didn’t find any results.</p>
					) : (
						<React.Fragment>
							<Block
								title="Users"
								data={ this.getData("users") }
								followUser={ this.props.followUser }
							/>
							<Block
								title="Tweets"
								data={ this.getData("tweets") }
								likeTweet={ this.props.likeTweet }
							/>
						</React.Fragment>
					)
				}
			</div>
		);
	}
}

export default compose(
	graphql(gql`
		mutation($id: ID!, $login: String!, $password: String!, $targetID: ID!) {
			subscribeUser(id: $id, login: $login, password: $password, targetID: $targetID)
		}
	`, { name: "followUser" }),
	graphql(gql`
		mutation($id: ID!, $login: String!, $password: String! $targetID: ID!) {
			likeTweet(id: $id, login: $login, password: $password, targetID: $targetID)
		}
	`, { name: "likeTweet" })
)(App);