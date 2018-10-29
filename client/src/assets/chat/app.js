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
							{ this.props.contentType !== "STICKER_TYPE" ? this.props.content : "*STICKER*" }
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
					this.props.data.map(({ id, lastTime, lastContent, lastContentType, victim: { image, name, url, isVertificated } }) => (
						<Conversation
							key={ id }
							id={ id }
							image={ image }
							name={ name }
							url={ url }
							isVertificated={ isVertificated }
							time={ lastTime }
							content={ lastContent }
							contentType={ lastContentType }
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
		let a = new Date(t),
				b = "",
				c = c1 => (c1.toString().length === 1) ? "0" + c1 : c1;

		if((new Date()).getTime() - t < 86400000) { // less than day -> 27:32
			b = `${ c(a.getHours()) }:${ c(a.getMinutes()) }`;
		} else { // -> 27 June, 23:32
			let d = [
				"Jan",
				"Feb",
				"March",
				"April",
				"May",
				"June",
				"July",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec"
			][a.getMonths()];
			b = `${ c(a.getDate()) } ${ d }, ${ c(a.getHours()) }:${ c(a.getMinutes()) }`;
		}

		return b;
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
					<span>{ this.convertTime(parseInt(this.props.time)) }</span>
					{
						(this.props.isClients) ? (
							<React.Fragment>
								<span>•</span>
								<span>Sent</span>
							</React.Fragment>
						) : null
					}
					{
						(this.props.seen && this.props.isClients) ? (
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

class ChatDisplayTyping extends Component {
	render() {
		return(
			<div className="rn-chat-mat-display-mat-typing">
				<div /><div /><div />
			</div>
		);
	}
}

class ChatDisplay extends Component {
	constructor(props) {
		super(props);

		this.viewRef = React.createRef();
	}

	componentDidUpdate(pProps) {
		if((pProps.data && pProps.data.length !== this.props.data.length && this.viewRef) || (pProps.isTyping !== this.props.isTyping)) this.viewRef.scrollIntoView();
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
		if(this.props.isLoading) return(
			<div className="rn-chat-mat-display"><LoadingIcon /></div>
		);

		return(
			<div className="rn-chat-mat-display">
				<div className="rn-chat-mat-display-mat">
					{ this.getMessages() }
					{
						(!this.props.isTyping) ? null : (
							<ChatDisplayTyping />
						)
					}
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
		this.aInt = null;
	}

	updateTypeStatus = () => {
		if(!this.props.dataLoaded) return;

		// if(this.aInt) return;
		/* Performance VS Smoothness (because i have no idea how to do that correctly) */

		let a = cookieControl.get("userdata");

		clearTimeout(this.aInt);

		this.props.startMessageMutation({
			variables: {
				...a,
				conversationID: this.props.conversationID
			}
		});
		this.aInt = setTimeout(() => {
			this.aInt = null;
			this.props.stopMessageMutation({
				variables: {
					...a,
					conversationID: this.props.conversationID
				}
			});
		}, 1000);
	}

	sendMessage = e => {
		e.preventDefault();
		this.props.onSendMessage("MESSAGE_TYPE", this.aField.value);
		this.aField.value = "";
	}

	render() {
		return(
			<React.Fragment>
				<Br />
				<form className="rn-chat-mat-input" onSubmit={ this.sendMessage }>
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
						onChange={ this.updateTypeStatus }
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
					isLoading={ this.props.data === false }
					data={ this.props.data.messages || [] }
					isTyping={ (this.props.data.isTyping) ? true:false } // undefined || false || true
				/>
				<ChatInput
					dataLoaded={ this.props.data !== false }
					onSendMessage={ this.props.onSendMessage }
					startMessageMutation={ this.props.startMessageMutation }
					stopMessageMutation={ this.props.stopMessageMutation }
					conversationID={ this.props.data.id }
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
			conversation: false,
			viewSended: false
		}

		this.postConvPromise = true;
		this.newMesSub = this.seenStatSub = this.typingStatSub;
	}

	componentDidMount() {
		this.fetchAPI();
	}

	componentWillUnmount() {
		this.postConvPromise = false; // XXX: promise.cancel()

		if(this.props.conversation) {
			this.props.stopMessageMutation({
				variables: {
					...cookieControl.get("userdata"),
					conversationID: this.props.conversation.id
				}
			});
		}
	}

	componentDidUpdate(pProps) {
		{
			let a = this.state;
			if(
				!a.viewSended &&
				a.stage === "CHAT_STAGE" &&
				a.conversation &&
				a.conversation.id &&
				a.conversation.messages.length
			) this.viewMessagesMutation();
		}
		{ // Subscripton > Conversation on gate was updated
			let a = pProps.gateContentUpdated.conversationsContentUpdated,
					b = this.props.gateContentUpdated.conversationsContentUpdated;
			if((!a && b) || (a && b && (a.id !== b.id || a.lastTime !== b.lastTime || a.lastContent !== b.lastContent))) {
				let c = this.state.conversations;
				if(!c) return;

				let d = Array.from(c),
						e = d.find(({ id }) => id === b.id);

				e.lastContent = b.lastContent;
				e.lastContentType = b.lastContentType;
				e.lastTime = b.lastTime;

				this.setState(() => {
					return {
						conversations: d
					}
				});
			}
		}
	}

	setStage = (stage, callback = null) => {
		this.stopSubscription();

		this.setState(() => ({
			stage
		}), callback);
	}

	viewMessagesMutation = () => {
		this.props.viewMessages({
			variables: {
				...cookieControl.get("userdata"),
				conversationID: this.state.conversation.id
			}
		});
		this.setState(() => ({
			viewSended: true
		}));
	}

	fetchAPI = (forceCon = false) => {
		let a = this.props.match.params.url;
		if(!a || forceCon) {
			this.setStage("CONVERSATIONS_STAGE");

			client.query({
				query: gql`
					query($id: ID!, $login: String!, $password: String!) {
						conversations(id: $id, login: $login, password: $password) {
					    id,
					    lastContent,
					    lastTime,
					    lastContentType,
					    victim(id: $id, login: $login, password: $password) {
					      name,
					      image,
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
				}, this.startSubscription);
			});
		}
	}

	sendMessage = (type, content) => {
		if(
			!this.state.conversation ||
			!this.state.conversation.id ||
			!content ||
			!content.replace(/ /g, "").length
		) return;

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
					startMessageMutation={ this.props.startMessage }
					stopMessageMutation={ this.props.stopMessage }
				/>
			break;
		}

		return a;
	}

	startSubscription = () => {
		if(!this.state.conversation) return;

		// New message
		this.newMesSub = client.subscribe({
			query: gql`
				subscription($id: ID!, $login: String!, $password: String!, $conversationID: ID!) {
				  conversationGotMessage(
				    id: $id,
				    login: $login,
				    password: $password,
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
			`,
			variables: {
				...cookieControl.get("userdata"),
				conversationID: this.state.conversation.id // this.props.match.params.url
			}
		}).subscribe({
			next: ({ data: { conversationGotMessage: message } }) => {
				if(!message) return;

				this.setState(({ conversation, conversation: { messages } }) => ({
					viewSended: false,
					conversation: {
						...conversation,
						messages: [
							...messages,
							message
						]
					}
				}));
			}
		});

		// Messages seen status
		this.seenStatSub = client.subscribe({
			query: gql`
			subscription($id: ID!, $login: String!, $password: String!, $conversationID: ID!) {
			  conversationSeenMessages(
			    id: $id,
			    login: $login,
			    password: $password,
			    conversationID: $conversationID
			  ) {
			    id,
			    lastContent,
			    members {
			      name
			    }
			  }
			}
			`,
			variables: {
				...cookieControl.get("userdata"),
				conversationID: this.state.conversation.id
			}
		}).subscribe({
			next: ({ data: { conversationSeenMessages: conversation } }) => {
				let a = Array.from(this.state.conversation.messages);
				a.forEach(io => io.isRequesterViewed = true);

				this.setState(({ conversation }) => {
					return {
						conversation: {
							...conversation,
							messages: a
						}
					}
				});
			}
		});

		// Typing status
		this.typingStatSub = client.subscribe({
			query: gql`
				subscription($id: ID!, $login: String!, $password: String!, $conversationID: ID!) {
				  conversationNewTypingStatus(
				    id: $id,
				    login: $login,
				    password: $password,
				    conversationID: $conversationID
				  )
				}
			`,
			variables: {
				...cookieControl.get("userdata"),
				conversationID: this.state.conversation.id
			}
		}).subscribe({
			next: ({ data: { conversationNewTypingStatus: isTyping } }) => {
				this.setState(({ conversation }) => ({
					conversation: {
						...conversation,
						isTyping
					}
				}));
			}
		});
	}

	stopSubscription = () => {
		if(this.newMesSub) this.newMesSub.unsubscribe();
		if(this.seenStatSub) this.seenStatSub.unsubscribe();
		if(this.typingStatSub) this.typingStatSub.unsubscribe();
	}

	setConversation = conversationID => {
		this.setStage("CHAT_STAGE", () => {
			this.setState(() => {
				return {
					conversation: false,
					viewSended: false
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
			if(this.postConvPromise === false) return;

			window.history.pushState(null, null, `${ links["CHAT_PAGE"] }/${ conversation.victim.url }`)

			this.setStage("CHAT_STAGE", () => {
				this.setState(() => ({
					conversation
				}), this.startSubscription);
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
	`, { name: "sendMessage" }),
	graphql(gql`
		mutation($id: ID!, $login: String!, $password: String!, $conversationID: ID!) {
		  viewMessages(
		    id: $id,
		    login: $login,
		    password: $password,
		    conversationID: $conversationID
		  )
		}
	`, { name: "viewMessages" }),
	graphql(gql`
		mutation($id: ID!, $login: String!, $password: String!, $conversationID: ID!) {
		  startMessage(
		    id: $id,
		    login: $login,
		    password: $password,
		    conversationID: $conversationID
		  )
		}
	`, { name: "startMessage" }),
	graphql(gql`
		mutation($id: ID!, $login: String!, $password: String!, $conversationID: ID!) {
		  stopMessage(
		    id: $id,
		    login: $login,
		    password: $password,
		    conversationID: $conversationID
		  )
		}
	`, { name: "stopMessage" }),
	graphql(gql`
		subscription($id: ID!, $login: String!, $password: String!) {
		  conversationsContentUpdated(
		    id: $id,
		    login: $login,
		    password: $password
		  ) {
		    id
		    lastTime
		    lastContent
		    lastContentType
		  }
		}
	`, {
		name: "gateContentUpdated",
		options: {
			variables: cookieControl.get("userdata")
		}
	})
)(App);