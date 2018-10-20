import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';

import client from '../../apollo';
import cookieControl from '../../cookieControl';
import apiPath from '../../apiPath';
import links from '../../links';

const defaultBg = `${ apiPath }files/backgrounds/default.jpeg`;

function destroySession() {
  cookieControl.delete("userdata");
  return window.location.href = links["REGISTER_PAGE"];
}

let clearCache = () => client.clearStore();

class Info extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subscriptionFromState: false,
      subscribedToUser: false,
      subscriptionAllowed: true
    }
  }

  convertTime = time => {
    let a = new Date(time),
        b = [
          "Jan",
          "Feb",
          "March",
          "Apr",
          "May",
          "June",
          "July",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ][a.getMonth()]

    return b + " " + a.getFullYear();
  }

  getSubscription = () => (
    (!this.state.subscriptionFromState) ? this.props.info.requesterIsSubscriber : this.state.subscribedToUser
  )

  followUser = () => {
    if(!this.state.subscriptionAllowed) return;

    let a = !this.getSubscription();
    this.setState(() => {
      return {
        subscriptionFromState: true,
        subscribedToUser: a,
        subscriptionAllowed: false
      }
    }, () => {
      let { id, login, password } = cookieControl.get("userdata");
      this.props.subscribeMutation({
        variables: {
          id,
          login,
          password,
          targetID: this.props.info.id
        }
      }).then(({ data: { subscribeUser } }) => {
        clearCache();
        this.setState(() => {
          return {
            subscribedToUser: subscribeUser,
            subscriptionAllowed: true
          }
        });
      }).catch(destroySession);
    });
  }

  render() {
    return(
      <div className="rn-account-info">
        <div className="rn-account-bg">
          <img src={ this.props.info.profileBackground ? this.props.info.profileBackground : defaultBg } alt={ `${ this.props.info.name.split(" ")[0] }'s background` } />
        </div>
        <div className="rn-account-controls">
          <div className="rn-account-controls-avatar">
            <img src={ this.props.info.image } alt={ `${ this.props.info.name.split(" ")[0] }'s background` } />
          </div>
          <div className="rn-account-controls-mat">
            {
              (this.props.info.id === cookieControl.get("userdata").id) ? (
                <button className="rn-account-controls-mat-btn icon">
                  <i className="fas fa-cog" />
                </button>
              ) : null
            }
            {
              (this.props.info.id !== cookieControl.get("userdata").id) ? (
                <button className="rn-account-controls-mat-btn icon">
                  <i className="far fa-envelope" />
                </button>
              ) : null
            }
            {
              (this.props.info.id !== cookieControl.get("userdata").id) ? (
                <button
                  className={ `rn-account-controls-mat-btn rn-account-controls-mat-subscribe${ (!this.getSubscription()) ? "" : " active" }` }
                  onClick={ this.followUser }>
                  { (!this.getSubscription()) ? "Follow" : " Following" }
                </button>
              ) : null
            }
          </div>
        </div>
        <div className="rn-account-info-mat">
          <h1 className="rn-account-info-mat-name">{ this.props.info.name }</h1>
          <p className="rn-account-info-mat-url">@{ this.props.info.url }</p>
          <p className="rn-account-info-mat-desc">{ this.props.info.profileDescription }</p>
          <div className="rn-account-info-mat-addvinfo">
            {
              (!this.props.info.location) ? null:(
                <div className="rn-account-info-mat-addvinfo-item">
                  <i className="fas fa-map-marker-alt" />
                  <span>{ this.props.info.location }</span>
                </div>
              )
            }
            {
              (new Date(parseInt(this.props.info.joinedDate)).getHours()) ? (
                <div className="rn-account-info-mat-addvinfo-item">
                  <i className="fas fa-calendar-alt" />
                  <span>Joined { this.convertTime(parseInt(this.props.info.joinedDate)) }</span>
                </div>
              ) : null
            }
          </div>
          <div className="rn-account-info-mat-follows">
            <div className="rn-account-info-mat-follows-item">
              <span className="rn-account-info-mat-follows-item-num">{ this.props.info.subscribedToInt }</span>
              <span>Following</span>
            </div>
            <div className="rn-account-info-mat-follows-item">
              <span className="rn-account-info-mat-follows-item-num">{ this.props.info.subscribersInt }</span>
              <span>Followers</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class TweetsTweet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      likes: {
        changable: true,
        fromState: false,
        likes: 0,
        isLiked: false
      }
    }
  }

  convertTime(time) { // clf
    if(!time) return "";

    time /= 1000;
    let a = (new Date()).getTime() / 1000,
        c = c1 => a - time < c1,
        d = Math.round;

    if(c(60)) {
      return d((a - time)) + "s";
    } else if(c(3600)) {
      return d((a - time) / 60) + "m";
    } else if(c(86400)) {
      return d((a - time) / 3600) + "h";
    } else if(c(604800)) {
      return d((a - time) / 86400) + "d";
    } else if(c(2419200)) {
      return d((a - time) / 604800) + "w";
    } else if(time < 0) {
      return "";
    } else {
      let e = new Date(time * 1000),
          f = [
            "Jan",
            "Feb",
            "March",
            "Apr",
            "May",
            "June",
            "July",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ][e.getMonth()];
      return `${ f } ${ e.getDate() }, ${ e.getFullYear() } ${ e.getHours() }:${ e.getMinutes() }`;
    }
  }

  likeTweet = () => {
    if(!this.state.likes.changable) return;

    const a = (!this.state.likes.fromState) ? Object.assign({}, this.props) : Object.assign({}, this.state.likes),
          b = cookieControl.get("userdata");
    this.setState(({ likes }) => {
      return {
        likes: {
          ...likes,
          likes: (!a.isLiked) ? a.likes + 1 : a.likes - 1,
          isLiked: !a.isLiked,
          fromState: true,
          changable: false
        }
      }
    });

    this.props.likeTweetMutation({
      variables: {
        id: b.id,
        login: b.login,
        password: b.password,
        targetID: this.props.id
      }
    }).then(({ data: { likeTweet } }) => {
      clearCache();
      this.setState(({ likes }) => {
        return {
          likes: {
            ...likes,
            likes: likeTweet ? a.likes + 1 : a.likes - 1,
            isLiked: likeTweet,
            changable: true
          }
        }
      })
    }).catch(destroySession)
  }

  getLikeSource() {
    return (!this.state.likes.fromState) ? this.props : this.state.likes;
  }

  render() {
    return(
      <div className="rn-account-tweets-mat-item">
        <div className="rn-account-tweets-mat-item-mg">
          <img src={ this.props.creator.image } alt={ this.props.creator.name } />
        </div>
        <div className="rn-account-tweets-mat-item-content">
          <Link className="rn-account-tweets-mat-item-redirect" to={ `${ links["TWEET_PAGE"] }/${ this.props.id }` } />
          <div className="rn-account-tweets-mat-item-content-info">
            <span className="rn-account-tweets-mat-item-content-info-name">{ this.props.creator.name }</span>
            <span className="rn-account-tweets-mat-item-content-info-url">@{ this.props.creator.url }</span>
            <span>•</span>
            <span className="rn-account-tweets-mat-item-content-info-time">{ this.convertTime(parseInt(this.props.time)) }</span>
          </div>
          <p className="rn-account-tweets-mat-item-content-mat">{ this.props.content }</p>
          <div className="rn-account-tweets-mat-item-content-mat-controls">
            <Link to={ `${ links["TWEET_PAGE"] }/${ this.props.id }` }>
              <button className="rn-account-tweets-mat-item-content-mat-controls-btn">
                <i className="far fa-comment" />
                <span>{ this.props.comments }</span>
              </button>
            </Link>
            <button
              className={ `rn-account-tweets-mat-item-content-mat-controls-btn rn-account-tweets-mat-item-content-mat-controls-like${ (this.getLikeSource().isLiked) ? " active" : "" }` }
              onClick={ this.likeTweet }
              key={ (this.getLikeSource().isLiked) ? "A":"B" }>
              <i className={ `${ (!this.getLikeSource().isLiked) ? "far" : "fas" } fa-heart` } />
              <span>{ this.getLikeSource().likes }</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class Tweets extends Component {
  render() {
    return(
      <div className="rn-account-tweets">
        <div className="rn-account-tweets-nav">
          <button className="rn-account-tweets-nav-btn active">Tweets</button>
        </div>
        <div className="rn-account-tweets-mat">
          {
            this.props.tweets.map(({ id, isLiked, content, likesInt, commentsInt, time, creator }) => {
              return(
                <TweetsTweet
                  key={ id }
                  id={ id }
                  content={ content }
                  likes={ likesInt }
                  comments={ commentsInt }
                  time={ time }
                  creator={ creator }
                  isLiked={ isLiked }
                  likeTweetMutation={ this.props.likeTweetMutation }
                />
              );
            })
          }

        </div>
      </div>
    );
  }
}

class SettingsField extends Component {
  constructor(props) {
    super(props);

    this.activeFiel = React.createRef();
  }

  updateValue = ({ target: { value } }) => {
    if(value.length > this.props.limit) {
      value = this.activeFiel.value = this.activeFiel.value.substr(0, this.props.limit);
    }

    this.props.submitValue(value);
  }

  getFieldByType = () => {
    let a = "";
    switch(this.props.type) {
      case 'text':
        a = (
          <input
            className="rn-account-settings-content-avatar-field-input text"
            onChange={ this.updateValue }
            type="text"
            ref={ ref => this.activeFiel = ref }
            maxLength={ this.props.limit }
          />
        );
      break;
      case 'textarea':
        a = (
          <textarea
            className="rn-account-settings-content-avatar-field-input textarea"
            onChange={ this.updateValue }
            ref={ ref => this.activeFiel = ref }
            maxLength={ this.props.limit }
          />
        );
      break;
      default:
        a = null;
      break;
    }

    return a;
  }

  render() {
    return(
      <div className="rn-account-settings-content-avatar-field">
        <div className="rn-account-settings-content-avatar-field-placeholder">
          <span>{ this.props.name }</span>
          <span>{ (this.activeFiel.value) ? this.props.limit - this.activeFiel.value.length : this.props.limit }</span>
        </div>
        { this.getFieldByType() }
      </div>
    );
  }
}

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        name: "",
        description: "",
        location: "",
        image: "",
        background: ""
      }
    }
  }

  render() {
    return(
      <React.Fragment>
        <div className="rn-account-settingsbg" />
        <div className="rn-account-settings">
          <div className="rn-account-settings-nav">
            <div>
              <button className="rn-account-settings-nav-cltimes">
                <i className="fas fa-times" />
              </button>
              <span className="rn-account-settings-nav-title">Edit profile</span>
            </div>
            <div>
              <button className="rn-account-settings-nav-save">Save</button>
            </div>
          </div>
          <div className="rn-account-settings-content">
            <div className="rn-account-settings-content-bg">
              <img
                src={ defaultBg }
                alt=""
                className="rn-account-settings-content-bg-mg"
              />
              <div className="rn-account-settings-content-bg-controls">
                <button className="rn-account-settings-content-bg-controls-btn">
                  <i className="fas fa-camera" />
                </button>
                <button className="rn-account-settings-content-bg-controls-btn">
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>
            <div className="rn-account-settings-content-avatar">
              <div className="rn-account-settings-content-avatar-mat">
                <img
                  src={ defaultBg }
                  alt=""
                  className="rn-account-settings-content-avatar-mat-mg"
                />
                <div className="rn-account-settings-content-avatar-mat-controls">
                  <button className="rn-account-settings-content-avatar-mat-controls-btn">
                    <i className="fas fa-camera" />
                  </button>
                </div>
              </div>
            </div>
            {
              [
                {
                  limit: "30",
                  valueName: "name",
                  name: "Name",
                  type: "text"
                },
                {
                  limit: "500",
                  valueName: "description",
                  name: "Bio",
                  type: "textarea"
                },
                {
                  limit: "30",
                  valueName: "location",
                  name: "Location",
                  type: "text"
                }
              ].map(({ limit, valueName, type, name }, index) => {
                return(
                  <SettingsField
                    key={ index }
                    type={ type }
                    name={ name }
                    limit={ limit }
                    submitValue={ value => this.setState(({ data }) => ({ data: {...data, [valueName]: value} })) }
                  />
                );
              })
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      userFetched: false
    }
  }

  componentDidUpdate() {
    if(this.state.userFetched && this.state.user === null) {
      window.location.href = links["NOT_FOUND_PAGE"];
    }
  }

  componentDidMount() {
    client.query({
      query: gql`
        query($id: ID!, $login: String!, $password: String!, $targetUrl: String!) {
          user(id: $id, login: $login, password: $password, targetUrl: $targetUrl) {
            id,
            image,
            name,
            url,
            profileDescription,
            location,
            joinedDate,
            subscribedToInt,
            subscribersInt,
            requesterIsSubscriber(id: $id, login: $login, password: $password),
            profileBackground,
            tweets {
              id,
              content,
              likesInt,
              commentsInt,
              time,
              isLiked(id: $id),
              creator {
                id,
                url,
                name,
                image
              }
            }
          }
        }
      `,
      variables: {
        id: cookieControl.get("userdata").id,
        login: cookieControl.get("userdata").login,
        password: cookieControl.get("userdata").password,
        targetUrl: window.location.pathname.split("/")[2] || ""
      }
    }).then(({ data: { user } }) => {
      this.setState(() => {
        return {
          user: user,
          userFetched: true
        }
      });
    })
  }

  render() {
    if(!this.state.userFetched || !this.state.user) {
      return(
        <div className="rn-account">
          <div className="rn-account-loader"></div>
        </div>
      )
    }

    return(
      <div className="rn-account">
        <Info
          info={ this.state.user } // XXX: Receives all tweets also.
          subscribeMutation={ this.props.subscribeMutation }
        />
        <Tweets
          tweets={ this.state.user.tweets }
          likeTweetMutation={ this.props.likeTweetMutation }
        />
        <Settings />
      </div>
    );
  }
}

export default compose(
  graphql(gql`
    mutation($id: ID!, $login: String!, $password: String!, $targetID: ID!) {
      subscribeUser(id: $id, login: $login, password: $password, targetID: $targetID)
    }
  `, {
    name: "subscribeMutation"
  }),
  graphql(gql`
    mutation($id: ID!, $login: String!, $password: String!, $targetID: ID!) {
      likeTweet(id: $id, login: $login, password: $password, targetID: $targetID)
    }
  `, { name: "likeTweetMutation" })
)(App);
