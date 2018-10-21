import React, { Component } from 'react';
import './main.css';

import { Link } from 'react-router-dom';

import links from '../../links';

class App extends Component {
	render() {
		return(
			<div className="rn-nfp">
				<Link className="rn-nfp-content" to={ links["MAIN_PAGE"] }>
					<h1 className="rn-nfp-content-title">This page doesn’t exist</h1>
					<p className="rn-nfp-content-tip">Try searching for another.</p>
				</Link>
			</div>
		);
	}
}

export default App;