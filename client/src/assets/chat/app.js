import React, { Component } from 'react';
import './main.css';

import VertificationStar from '../__forall__/vertificated/app';

const messageStickers = {
	oops: {
		label: "OOPSSMILE_STICKER",
		url: "https://abs-0.twimg.com/emoji/v2/svg/1f633.svg"
	},
	happy: {
		label: "HAPPYSMILE_STICKER",
		url: "https://abs-0.twimg.com/emoji/v2/svg/1f603.svg"
	},
	funny: {
		label: "FUNNYSMILE_STICKER",
		url: "https://abs-0.twimg.com/emoji/v2/svg/1f602.svg"
	},
	fest: {
		label: "FESTCONFETI_STICKER",
		url: "https://abs-0.twimg.com/emoji/v2/svg/1f389.svg"
	},
	like: {
		label: "LIKEHEART_STICKER",
		url: "https://abs-0.twimg.com/emoji/v2/svg/2764.svg"
	}
}

const image = "https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png";

class Br extends Component {
	render() {
		return(
			<div className="rn-chat-brgl" />
		);
	}
}

class User extends Component {
	render() {
		return(
			<React.Fragment>
				<div className="rn-chat-users-user">
					<div className="rn-chat-users-user-mg">
						<img src={ image } alt="" />
					</div>
					<div className="rn-chat-users-user-content">
						<div className="rn-chat-users-user-content-inf">
							<div className="rn-chat-users-user-content-inf-mat">
								<div className="rn-chat-users-user-content-name">
									<span>Oles Odynets</span>
									<VertificationStar />
								</div>
								<span className="rn-chat-users-user-content-url">@oles</span>
							</div>
							<span className="rn-chat-users-user-content-time">2h</span>
						</div>
						<p className="rn-chat-users-user-content-mat">
							Chill the life Chill the life Chill the life Chill the life Chill the life Chill the life Chill the life 
						</p>
					</div>
				</div>
				<Br />
			</React.Fragment>
		);
	}
}

class Users extends Component {
	render() {
		return(
			<div className="rn-chat-users">
				<User />
			</div>
		);
	}
}

class ChatNav extends Component {
	render() {
		return(
			<React.Fragment>
				<Br />
				<div className="rn-chat-mat-nav">
					<div className="rn-chat-mat-nav-mat">
						<div className="rn-chat-mat-nav-mat-inf">
							<button className="rn-chat-mat-nav-mat-inf-back"><i className="fas fa-arrow-left" /></button>
							<div className="rn-chat-mat-nav-mat-inf-mat">
								<p className="rn-chat-mat-nav-mat-inf-mat-name">Oles Odynets</p>
								<p className="rn-chat-mat-nav-mat-inf-mat-url">@oles</p>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

class ChatDisplayMessage extends Component {
	render() {
		return(
			<div className={ `rn-chat-mat-display-mat-message ${ (!this.props.isClients) ? "l" : "r" }` }>
				<div className="rn-chat-mat-display-mat-message-content">
					{
						(!this.props.isClients) ? (
							<div className="rn-chat-mat-display-mat-message-content-mg">
								<img src={ image } alt="" />
							</div>
						) : null
					}
					<div className="rn-chat-mat-display-mat-message-content-mat">
						<span>
							Hello
						</span>
					</div>
				</div>
				<div className="rn-chat-mat-display-mat-message-info">
					<span>23:32</span>
					<span>•</span>
					<span>Sent</span>
					<span>•</span>
					<span>Seen</span>
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

	componentDidMount() {
		this.viewRef.scrollIntoView();
	}

	render() {
		return(
			<div className="rn-chat-mat-display">
				<div className="rn-chat-mat-display-mat">
					<ChatDisplayMessage
						isClients={ true }
					/>
					<ChatDisplayMessage
						isClients={ true }
					/>
					<ChatDisplayMessage
						isClients={ false }
					/>
					<ChatDisplayMessage
						isClients={ true }
					/>
					<ChatDisplayMessage
						isClients={ true }
					/>
					<ChatDisplayMessage
						isClients={ false }
					/>
					<ChatDisplayMessage
						isClients={ true }
					/>
					<ChatDisplayMessage
						isClients={ false }
					/>
					<ChatDisplayMessage
						isClients={ true }
					/>
					<ChatDisplayMessage
						isClients={ true }
					/>
					<ChatDisplayMessage
						isClients={ true }
					/>
					<div ref={ ref => this.viewRef = ref } />
				</div>
			</div>
		);
	}
}

class ChatInputStickersSticker extends Component {
	render() {
		return(
			<button type="button" className="rn-chat-mat-input-stickers-sticker">
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
							image={ messageStickers[session].url }
							label={ messageStickers[session].label }
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
	}

	render() {
		return(
			<React.Fragment>
				<Br />
				<form className="rn-chat-mat-input" onSubmit={ e => alert(e.preventDefault()) }>
					<ChatInputStickers
						visible={ this.state.isStickers }
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
				<ChatNav />
				<ChatDisplay />
				<ChatInput />
			</div>
		);
	}
}

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			stage: "CHAT_STAGE" // USERS_STAGE, CHAT_STAGE
		}
	}

	getStage = () => {
		let a = null;

		switch(this.state.stage) {
			default:
			case 'USERS_STAGE':
				a = <Users />;
			break;
			case 'CHAT_STAGE':
				a = <Chat />
			break;
		}

		return a;
	}

	setStage = stage => {
		this.setState(() => ({
			stage
		}));
	}

	render() {
		return(
			<div className="rn-chat">
				{ this.getStage() }
			</div>
		);
	}
}

export default App;