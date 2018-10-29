import React, { Component } from 'react';
import './main.css';

import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';

import client from '../../apollo';
import cookieControl from '../../cookieControl';
import links from '../../links';
import { apiPath } from '../../apiPath';

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
      }
    }
  }

  componentDidMount() {
    this.fetchAPI();
    this.startSubscriptions();
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
    client.query({
      query: gql`
        query($id: ID!, $login: String!, $password: String!) {
          user(id: $id, login: $login, password: $password) {
            name,
            id,
            image
          }
        }
      `,
      variables: {
        id: cookieControl.get("userdata").id,
        login: cookieControl.get("userdata").login,
        password: cookieControl.get("userdata").password
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

  render() {
    return(
      <React.Fragment>
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
          <Link
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
          </Link>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
