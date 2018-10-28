import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';

import { apiPath } from '../../apiPath';
import { convertTime } from '../../timeConvertor';
import client from '../../apollo';
import cookieControl from '../../cookieControl';
import links from '../../links';

import LoadingIcon from '../__forall__/loader/app';
import VertificationStar from '../__forall__/vertificated/app';

const messageStickers = {
	OOPSSMILE_STICKER: require("./stickers/1f633.svg"),
	HAPPYSMILE_STICKER: require("./stickers/1f603.svg"),
	FUNNYSMILE_STICKER: require("./stickers/1f602.svg"),
	FESTCONFETI_STICKER: require("./stickers/1f389.svg"),
	LIKEHEART_STICKER: require("./stickers/2764.svg")
}

const image = "https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png";

class Br extends Component {
	render() {
		return(
			<div className="rn-chat-brgl" />
		);
	}
}

class Conversation extends Component {
	render() {
		return(
			<React.Fragment>
				<div className="rn-chat-users-user" onClick={ () => this.props.requestConversation(this.props.id) }>
					<Link className="rn-chat-users-user-mg" to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.url }` }>
						<img src={ apiPath + this.props.image } alt="" />
					</Link>
					<div className="rn-chat-users-user-content">
						<div className="rn-chat-users-user-content-inf">
							<Link className="rn-chat-users-user-content-inf-mat" to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.url }` }>
								<div className="rn-chat-users-user-content-name">
									<span>{ this.props.name }</span>
									{
										(!this.props.isVertificated) ? null : (
											<VertificationStar />
										)
									}
								</div>
								<span className="rn-chat-users-user-content-url">@{ this.props.url }</span>
							</Link>
							<span className="rn-chat-users-user-content-time">{ convertTime(this.props.time) }</span>
						</div>
						<p className="rn-chat-users-user-content-mat">
							{ this.props.content }
						</p>
					</div>
				</div>
				<Br />
			</React.Fragment>
		);
	}
}

class Conversations extends Component {
	render() {
		if(this.props.isLoading) return <LoadingIcon />

		return(
			<div className="rn-chat-users">
				{
					this.props.data.map(({ id, lastTime, lastContent, victim: { image, name, url, isVertificated } }) => (
						<Conversation
							key={ id }
							id={ id }
							image={ image }
							name={ name }
							url={ url }
							isVertificated={ isVertificated }
							time={ lastTime }
							content={ lastContent }
							requestConversation={ this.props.setConversation }
						/>
					))
				}
			</div>
		);
	}
}

class ChatNav extends Component {
	moveToMain = () => {
		window.history.pushState(null, null, links["CHAT_PAGE"]);
		this.props.requestMainStage();
	}

	render() {
		return(
			<React.Fragment>
				<Br />
				<div className="rn-chat-mat-nav">
					<div className="rn-chat-mat-nav-mat">
						<div className="rn-chat-mat-nav-mat-inf">
							<button
								className="rn-chat-mat-nav-mat-inf-back"
								onClick={ this.moveToMain }>
								<i className="fas fa-arrow-left" />
							</button>
							<Link className="rn-chat-mat-nav-mat-inf-mat" to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.url }` }>
								<p className="rn-chat-mat-nav-mat-inf-mat-name">{ this.props.data.name || "" }</p>
								<p className="rn-chat-mat-nav-mat-inf-mat-url">{ this.props.data.url ? "@" + this.props.data.url : "" }</p>
							</Link>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

class ChatDisplayMessage extends Component {
	convertTime = t => {
		let time = new Date(t / 1000);

		return `${ time.getHours() }:${ time.getMinutes() }`;
	}

	generateContent = () => {
		let a = this.props.content,
				b = null;

		switch(this.props.contentType) {
			default:
			case 'MESSAGE_TYPE':
				b = <span>{ a }</span>
			break;
			case 'STICKER_TYPE':
				b = <img src={ messageStickers[a] } alt={ this.props.name } />
			break;
		}

		return b;
	}

	render() {
		return(
			<div className={ `rn-chat-mat-display-mat-message ${ (!this.props.isClients) ? "l" : "r" }` }>
				<div className="rn-chat-mat-display-mat-message-content">
					{
						(!this.props.isClients) ? (
							<div className="rn-chat-mat-display-mat-message-content-mg">
								<img src={ apiPath + this.props.image } alt={ this.props.name } />
							</div>
						) : null
					}
					<div className={ `rn-chat-mat-display-mat-message-content-mat${ (this.props.contentType === "STICKER_TYPE") ? " sticker" : ""  }` }>
						{ this.generateContent() }
					</div>
				</div>
				<div className="rn-chat-mat-display-mat-message-info">
					<span>{ this.convertTime(this.props.time) }</span>
					<span>•</span>
					<span>Sent</span>
					{
						(this.props.seen && !this.props.isClients) ? (
							<React.Fragment>
								<span>•</span>
								<span>Seen</span>
							</React.Fragment>
						) : null
					}
				</div>
			</div>
		);
	}
}

class ChatDisplay extends Component {
	constructor(props) {
		super(props);

		this.viewRef = React.createRef();
	}

	componentDidUpdate({ data }) {
		if(data.length !== this.props.data.length) this.viewRef.scrollIntoView();
	}

	getMessages = () => {
		let { id: clientID } = cookieControl.get("userdata");

		return(
			this.props.data.map(({ creator, time, content, contentType, isRequesterViewed: seen }, index) => (
				<ChatDisplayMessage
					key={ index }
					id={ index }
					isClients={ creator.id === clientID }
					image={ creator.image }
					time={ time }
					seen={ seen }
					content={ content }
					contentType={ contentType }
				/>
			))
		);
	}

	render() {
		return(
			<div className="rn-chat-mat-display">
				<div className="rn-chat-mat-display-mat">
					{ this.getMessages() }
					<div ref={ ref => this.viewRef = ref } />
				</div>
			</div>
		);
	}
}

class ChatInputStickersSticker extends Component {
	render() {
		return(
			<button
				type="button"
				className="rn-chat-mat-input-stickers-sticker"
				onClick={ this.props.onChoose }>
				<img src={ this.props.image } alt={ this.props.label } />
			</button>
		);
	}
}

class ChatInputStickers extends Component {
	render() {
		return(
			<div className={ `rn-chat-mat-input-stickers${ (!this.props.visible) ? "" : " visible" }` }>
				{
					Object.keys(messageStickers).map((session, index) => (
						<ChatInputStickersSticker
							key={ index }
							image={ messageStickers[session] }
							label={ session }
							onChoose={ () => this.props.onSendMessage("STICKER_TYPE", session) }
						/>
					))
				}
			</div>
		);
	}
}

class ChatInput extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isStickers: false
		}

		this.aField = React.createRef();
	}

	render() {
		return(
			<React.Fragment>
				<Br />
				<form className="rn-chat-mat-input" onSubmit={ e => this.props.onSendMessage("MESSAGE_TYPE", this.aField.value, e.preventDefault()) }>
					<ChatInputStickers
						visible={ this.state.isStickers }
						onSendMessage={ this.props.onSendMessage }
					/>
					<button
						type="button"
						className="rn-chat-mat-input-btn"
						onClick={ () => this.setState(({ isStickers }) => ({ isStickers: !isStickers })) }
						key={ (!this.state.isStickers) ? "A":"B" }>
						{
							(!this.state.isStickers) ? (
								<i className="far fa-smile" />
							) : (
								<i className="fas fa-times" />
							)
						}
					</button>
					<input
						type="text"
						className="rn-chat-mat-input-mat"
						placeholder="Start a new message"
						ref={ ref => this.aField = ref }
					/>
					<button type="submit" className="rn-chat-mat-input-btn">
						<i className="fas fa-arrow-right" />
					</button>
				</form>
			</React.Fragment>
		);
	}
}

class Chat extends Component {
	render() {
		return(
			<div className="rn-chat-mat">
				<ChatNav
					data={ this.props.data.victim || {} }
					requestMainStage={ this.props.requestMainStage }
				/>
				<ChatDisplay
					data={ this.props.data.messages || [] }
				/>
				<ChatInput
					onSendMessage={ this.props.onSendMessage }
				/>
			</div>
		);
	}
}

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			stage: "CONVERSATIONS_STAGE", // CONVERSATIONS_STAGE, CHAT_STAGE,
			conversations: false,
			conversation: {}
		}

		this.postConvPromise = true;
	}

	componentDidMount() {
		this.fetchAPI();
	}

	componentWillUnmount() {
		this.postConvPromise = false; // XXX: promise.cancel()
	}

	setStage = (stage, callback = null) => {
		this.setState(() => ({
			stage
		}), callback);
	}

	fetchAPI = (forceCon = false) => {
		let a = this.props.match.params.url;
		if(!a || forceCon) {
			this.setStage("CONVERSATIONS_STAGE");

			client.query({
				query: gql`
					query($id: ID!, $login: String!, $password: String!) {
						conversations(id: $id, login: $login, password: $password) {
					    id
					    lastContent
					    lastTime
					    victim(id: $id, login: $login, password: $password) {
					      name
					      image
					      url,
					      isVertificated
					    }
					  }
					}
				`,
				variables: cookieControl.get("userdata")
			}).then(({ data: { conversations } }) => {
				this.setState(() => ({
					conversations
				}));
			});
		} else {
			this.setStage("CHAT_STAGE");

			client.mutate({
				mutation: gql`
					mutation($id: ID!, $login: String!, $password: String!, $victimID: ID!, $victimURL: String!) {
					  createConversation(
					    id: $id,
					    login: $login,
					    password: $password,
					    victimID: $victimID,
					    victimURL: $victimURL
					  ) {
					    id,
					    messages {
					      content,
					      isRequesterViewed,
					      time,
					      content,
					      contentType,
					      creator {
									image,
					        id,
					        name
					      }
					    },
					    victim(
					      id: $id,
					      login: $login,
					      password: $password
					    ) {
					      name,
					      url
					    }
					  }
					}
				`,
				variables: {
					...cookieControl.get("userdata"),
					victimID: "",
					victimURL: a
				}
			}).then(({ data: { createConversation: conversation } }) => {
				if(!conversation) {
					window.history.pushState(null, null, links["CHAT_PAGE"]);
					return this.fetchAPI(true);
				}

				this.setState(() => {
					return {
						conversation
					}
				})
			});
		}
	}

	sendMessage = (type, content) => {
		if(!this.state.conversation || !this.state.conversation.id) return null;

		this.props.sendMessage({
			variables: {
				...cookieControl.get("userdata"),
				content,
				contentType: type,
				conversationID: this.state.conversation.id
			}
		}).then(({ data: { sendMessage: message } }) => {
			this.setState(({ conversation, conversation: { messages } }) => ({
				conversation: {
					...conversation,
					messages: [
						...messages,
						message
					]
				}
			}));
		});
	}

	getStage = () => {
		let a = null;

		switch(this.state.stage) {
			default:
			case 'CONVERSATIONS_STAGE':
				a = <Conversations
					isLoading={ this.state.conversations === false }
					data={ this.state.conversations }
					setConversation={ this.setConversation }
				/>;
			break;
			case 'CHAT_STAGE':
				a = <Chat
					data={ this.state.conversation }
					requestMainStage={ () => this.setStage("CONVERSATIONS_STAGE", this.fetchAPI(true)) }
					onSendMessage={ this.sendMessage }
				/>
			break;
		}

		return a;
	}

	setConversation = conversationID => {
		this.setStage("CHAT_STAGE", () => {
			this.setState(() => {
				return {
					conversation: false
				}
			});
		});

		this.postConvPromise = client.query({
			query: gql`
				query($id: ID!, $login: String!, $password: String!, $conversationID: ID!) {
				  conversation(id: $id, login: $login, password: $password, conversationID: $conversationID) {
				    id,
				    messages {
				      content,
				      isRequesterViewed,
				      time,
				      content,
				      contentType,
				      creator {
								image,
				        id,
				        name
				      }
				    },
				    victim(
				      id: $id,
				      login: $login,
				      password: $password
				    ) {
				      name,
				      url
				    }
				  }
				}
			`,
			variables: {
				...cookieControl.get("userdata"),
				conversationID
			}
		}).then(({ data: { conversation } }) => {
			if(this.postConvPromise === false) return null;

			window.history.pushState(null, null, `${ links["CHAT_PAGE"] }/${ conversation.victim.url }`)

			this.setStage("CHAT_STAGE", () => {
				this.setState(() => ({
					conversation
				}));
			});
		})
	}

	render() {
		return(
			<div className="rn-chat">
				{ this.getStage() }
			</div>
		);
	}
}

export default compose(
	graphql(gql`
		mutation($id: ID!, $login: String!, $password: String!, $content: String!, $contentType: String!, $conversationID: ID!) {
		  sendMessage(
		    id: $id,
		    login: $login,
		    password: $password,
		    content: $content,
		    contentType: $contentType,
		    conversationID: $conversationID
		  ) {
		    content,
	      isRequesterViewed,
	      time,
	      content,
	      contentType,
	      creator {
					image,
	        id,
	        name
	      }
	    }
		}
	`, { name: "sendMessage" })
)(App);