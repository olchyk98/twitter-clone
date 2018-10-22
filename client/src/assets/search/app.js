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

class UsersUser extends Component {
	render() {
		return(
			<React.Fragment>
				<div className="rn-search-users-disp-item">
					<div className="rn-search-users-disp-item-image">
						<img src={ image } alt="" />
					</div>
					<div className="rn-search-users-disp-item-content">
						<div className="rn-search-users-disp-item-content-creator">
							<div>
								<div className="rn-search-users-disp-item-content-creator-name">
									<span>Oles Odynets</span>
									<VertificatedStar />
								</div>
								<span className="rn-search-users-disp-item-content-creator-url">@oles</span>
							</div>
							<div>
								<button className="rn-search-users-disp-item-content-creator-flbtn">Follow</button>
							</div>
						</div>
						<p className="rn-search-users-disp-item-content-mat">
							Chill the net Chill the net Chill the net Chill the net Chill the net Chill the net Chill the net Chill the net Chill the net Chill the net 
						</p>
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
			<div className="rn-search-users-split"></div>
		);
	}
}

class Users extends Component {
	render() {
		return(
			<div className="rn-search-users">
				<div className="rn-search-users-title">
					<span>Users</span>
					<div>
						<i className="fas fa-angle-up" />
					</div>
				</div>
				<UsersSplit />
				<div className="rn-search-users-disp">
					<UsersUser />
					<UsersUser />
					<UsersUser />
					<UsersUser />
					<UsersUser />

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
				<Users />
			</div>
		);
	}
}

export default App;