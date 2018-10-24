import React, { Component } from 'react';
import './main.css';

import { Link } from 'react-router-dom';
import cookieControl from '../../cookieControl';

import links from '../../links';

class App extends Component {
	destroySession = () => {
		cookieControl.delete("userdata");
		window.location.href = links["REGISTER_PAGE"];
	}

	render() {
		return(
			<div className="rn-nfp">
				<Link className="rn-nfp-content" to={ links["MAIN_PAGE"] }>
					<h1 className="rn-nfp-content-title">Something wrong.</h1>
					<p className="rn-nfp-content-tip">Try open something else.</p>
					<button className="rn-nfp-content-tip-logout" onClick={ this.destroySession }>Logout</button>
				</Link>
			</div>
		);
	}
}

export default App;