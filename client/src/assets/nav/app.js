import React, { Component } from 'react';
import './main.css';

import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';

import client from '../../apollo';
import cookieControl from '../../cookieControl';
import links from '../../links';
import { apiPath } from '../../apiPath';
import themeConfig from '../../themeConfig'

function destroySession() {
  cookieControl.delete("userdata");
  window.location.reload();
}

class NavLink extends Component {
  render() {
    return(
      <React.Fragment>
        <Link className={ `mj-nav-navigation-btn${ (this.props.active) ? " active" : "" }` } to={ this.props.href }>
          <div className={ `mj-nav-navigation-btn-notify${ (!this.props.notify) ? "" : " visible" }` } />
          { this.props.icon }
        </Link>
      </React.Fragment>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: false,
      notified: {
        "NOTIFICATIONS_TOPIC": false,
        "MESSAGES_TOPIC": false
      },
      navOpened: false,
      darkMode: false
    }
  }

  componentDidMount() {
    this.fetchAPI();
    this.startSubscriptions();
    this.renderTheme();
  }

  componentDidUpdate() {
    this.clearWarnings();
  }

  clearWarnings = () => { // XXX
    let a = window.location.pathname,
        b = Object.assign({}, this.state.notified),
        c = false;
    if(a.indexOf(links["EVENTS_PAGE"]) !== -1 && b["NOTIFICATIONS_TOPIC"]) {
      b["NOTIFICATIONS_TOPIC"] = false;
      c = true;
    } else if(a.indexOf(links["CHAT_PAGE"]) !== -1 && b["MESSAGES_TOPIC"]) {
      b["MESSAGES_TOPIC"] = false;
      c = true;
    }

    if(!c) return;

    this.setState(() => ({ notified: b }));
  }

  fetchAPI = () => {
    let { id, login, password } = cookieControl.get("userdata");
    client.query({
      query: gql`
        query($id: ID!, $login: String!, $password: String!) {
          user(id: $id, login: $login, password: $password) {
            name,
            id,
            image,
            url,
            subscribedToInt,
            subscribersInt
          }
        }
      `,
      variables: {
        id, login, password
      }
    }).then(({ data: { user } }) => {
      if(user === null) return destroySession();

      this.setState(() => ({ user }));
    })
  }

  getAPI = data => {
    let a = this.state.user;
    return (a) ? a[data] : "";
  }

  startSubscriptions = () => {
    let { id, login, password } = cookieControl.get("userdata");
    client.subscribe({
      query: gql`
        subscription($id: ID!, $login: String!, $password: String!) {
          navigationGotEvent(id: $id, login: $login, password: $password) 
        }
      `,
      variables: { id, login, password }
    }).subscribe({
      next: ({ data: { navigationGotEvent: topic } }) => {
        {
          let b = window.location.pathname;
          if(
            (b === links["EVENTS_PAGE"] && topic === "NOTIFICATIONS_TOPIC") ||
            (b === links["CHAT_PAGE"] && topic === "MESSAGES_TOPIC")
          ) return;
        }
        {
          let notified = Object.assign({}, this.state.notified);
          notified[topic] = true;
          this.setState(() => ({ notified }));
        }
      }
    })
  }

  renderTheme = () => {
    let a = localStorage.getItem("dark_mode") !== "false"; // dark in the priority
    let config = themeConfig( (a) ? "dark" : "light" );

    Object.keys(config).forEach(io => {
      document.documentElement.style.setProperty(io, config[io]);
    });

    this.setState(() => ({
      darkMode: a
    }))
  }

  toggleDarkmode = () => {
    this.setState(({ darkMode }) => {
      let a = !darkMode;

      localStorage.setItem("dark_mode", a);
      return {
        darkMode: a
      }
    }, this.renderTheme);
  }

  render() {
    return(
      <React.Fragment>
        <div
          className={ `mj-navclkbg${ (this.state.navOpened) ? " visible" : "" }` }
          onClick={ () => this.setState({ navOpened: false }) }
        />
        <div className="mj-nav">
          <div className="mj-nav-navigation">
            {
              [
                {
                  icon: <i className="fas fa-home" />,
                  pageName: links["MAIN_PAGE"]
                },
                {
                  icon: <i className="fas fa-search" />,
                  pageName: links["EXPLORE_PAGE"]
                },
                {
                  icon: <i className="fas fa-bell" />,
                  pageName: links["EVENTS_PAGE"],
                  label: "NOTIFICATIONS_TOPIC"
                },
                {
                  icon: <i className="fas fa-envelope" />,
                  pageName: links["CHAT_PAGE"],
                  label: "MESSAGES_TOPIC"
                }
              ].map(({ icon, pageName, label }, index) => {
                return(
                  <NavLink
                    key={ index }
                    href={ pageName }
                    icon={ icon }
                    active={ window.location.pathname === pageName }
                    notify={ this.state.notified[label] || false }
                  />
                );
              })
            }
          </div>
          {/*<Link
            to={ links["ACCOUNT_PAGE"] }>
            <div className="mj-nav-muser">
              <img
                className="mj-nav-muser-mg"
                src={ this.getAPI("image") ? apiPath + this.getAPI("image") : "" }
                alt={ this.getAPI("name") }
              />
              <span className="mj-nav-muser-tit">
                { this.getAPI("name") }
              </span>
            </div>
          </Link>*/}
          <div className="mj-nav-muser">
            <div className="mj-nav-muser-vis" onClick={ () => this.setState({ navOpened: true }) }>
              <img
                className="mj-nav-muser-vis-mg"
                src={ this.getAPI("image") ? apiPath + this.getAPI("image") : "" }
                alt={ this.getAPI("name") }
              />
              <span className="mj-nav-muser-vis-tit">
                { this.getAPI("name") }
              </span>
              <div className="mj-nav-muser-vis-arrow">
                <i className="fas fa-angle-down" />
              </div>
            </div>
            <div className={ `mj-nav-muser-mat${ (!this.state.navOpened) ? "" : " opened" }` }>
              <div className="mj-nav-muser-mat-acc">
                <Link to={ `${ links["ACCOUNT_PAGE"] }/` } onClick={ () => this.setState({ navOpened: false }) }>
                  <div className="mj-nav-muser-mat-acc-mg">
                    <img src={ this.getAPI("image") ? apiPath + this.getAPI("image") : "" } alt={ this.getAPI("name") } />
                  </div>
                  <p className="rn-nav-muser-mat-acc-name">{ this.getAPI("name") }</p>
                  <p className="rn-nav-muser-mat-acc-url">@{ this.getAPI("url") }</p>
                </Link>
                <div className="rn-nav-muser-mat-acc-subs" /* warning -> */ onClick={ () => this.setState({ navOpened: false }) } /* <- warning */>
                  <Link className="rn-nav-muser-mat-acc-subs-sub" to={ `${ links["FOLLOWERS_PAGE"] }/${ this.getAPI("url") }/following` }>
                    <span className="rn-nav-muser-mat-acc-subs-val">{ this.getAPI("subscribedToInt") }</span>
                    <span className="rn-nav-muser-mat-acc-subs-place">Following</span>
                  </Link>
                  <Link className="rn-nav-muser-mat-acc-subs-sub" to={ `${ links["FOLLOWERS_PAGE"] }/${ this.getAPI("url") }/followers` }>
                    <span className="rn-nav-muser-mat-acc-subs-val">{ this.getAPI("subscribersInt") }</span>
                    <span className="rn-nav-muser-mat-acc-subs-place">Followers</span>
                  </Link>
                </div>
              </div>
              <div className="mj-nav-muser-mat-menu">
                <Link className="mj-nav-muser-mat-menu-btn" to={ `${ links["ACCOUNT_PAGE"] }` } onClick={ () => this.setState({ navOpened: false }) }>
                  <div className="mj-nav-muser-mat-menu-btn-icon">
                    <i className="far fa-user" />
                  </div>
                  <span
                    className="mj-nav-muser-mat-menu-btn-txt"
                    style={{ position:"relative", left:"-2px" }}>
                    Account
                  </span>
                </Link>
                <button className="mj-nav-muser-mat-menu-btn" onClick={ destroySession }>
                  <div className="mj-nav-muser-mat-menu-btn-icon">
                    <i className="fas fa-door-closed" />
                  </div>
                  <span className="mj-nav-muser-mat-menu-btn-txt">Log out</span>
                </button>
                <button className={ `mj-nav-muser-mat-menu-btn switch${ (this.state.darkMode) ? " active" : "" }` }>
                  <span className="mj-nav-muser-mat-menu-btn-txt">Dark Mode</span>
                  <div
                    onClick={ this.toggleDarkmode }
                    className="mj-nav-muser-mat-menu-btn-switch"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
