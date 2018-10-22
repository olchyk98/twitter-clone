import React, { Component } from 'react';
import './main.css';

import VertificatedStar from '../__forall__/vertificated/app';

const image = "https://pbs.twimg.com/profile_images/1053806505475170305/YtP1fJDv_bigger.jpg";

class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			inFocus: false
		}
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
					/>
				</div>
			</div>
		);
	}
}

class BlockUser extends Component {
	render() {
		return(
			<React.Fragment>
				<div className="rn-search-block-disp-item">
					<div className="rn-search-block-disp-item-image">
						<img src={ image } alt="" />
					</div>
					<div className="rn-search-block-disp-item-content">
						<div className="rn-search-block-disp-item-content-creator">
							<div>
								<div className="rn-search-block-disp-item-content-creator-name">
									<span>Oles Odynets</span>
									<VertificatedStar />
								</div>
								<span className="rn-search-block-disp-item-content-creator-url">@oles</span>
							</div>
							<div>
								<button className="rn-search-block-disp-item-content-creator-flbtn">Follow</button>
							</div>
						</div>
						<p className="rn-search-block-disp-item-content-mat">
							Chill the net Chill the net Chill the net Chill the net Chill the net Chill the net Chill the net Chill the net Chill the net Chill the net 
						</p>
					</div>
				</div>
				<UsersSplit />
			</React.Fragment>
		);
	}
}

class BlockTweet extends Component {
	render() {
		return(
			<React.Fragment>
				<div className="rn-search-block-disp-titem">
					
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
			// opened: true
			opened: this.props.title !== "Users"
		}
	}

	render() {
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
					<BlockTweet />
				</div>
			</div>
		);
	}
}

class App extends Component {
	render() {
		return(
			<div className="rn-search">
				<Search />
				<Block
					title="Users"
				/>
				<Block
					title="Tweets"
				/>
			</div>
		);
	}
}

export default App;