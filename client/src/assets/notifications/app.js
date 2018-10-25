import React, { Component } from 'react';
import './main.css';

class Br extends Component {
	render() {
		return(
			<div className="rn-notifications-br" />
		);
	}
}

class Notification extends Component {
	render() {
		return(
			<h1>A</h1>
		);
	}
}

class Notifications extends Component {
	render() {
		return(
			<div className="rn-notifications-mat">
				<Notification />
			</div>
		);
	}
}

class App extends Component {
	render() {
		return(
			<div className="rn-notifications">
				<div className="rn-notifications-title">
					<h1 className="rn-notifications-title-mat">Notifications</h1>
				</div>
				<Br />
				<div className="rn-notifications-nav">
					<button className="rn-notifications-nav-btn active">All</button>
				</div>
			</div>
		);
	}
}

export default App;