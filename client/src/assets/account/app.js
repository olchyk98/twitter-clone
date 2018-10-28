import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';

import client from '../../apollo';
import cookieControl from '../../cookieControl';
import { apiPath } from '../../apiPath';
import { convertTime } from '../../timeConvertor';
import links from '../../links';

import VertificatedStar from '../__forall__/vertificated/app';
import LoadingIcon from '../__forall__/loader/app';

const defaultBg = "/files/backgrounds/default.jpeg";

function destroySession() {
  window.location.href = links["NOT_FOUND_PAGE"];
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
        if(subscribeUser === null) destroySession();

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

  convertTime = time => {
    let a = new Date(parseInt(time)),
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

  render() {
    return(
      <div className="rn-account-info">
        <div className="rn-account-bg">
          <img src={ this.props.info.profileBackground ? apiPath + this.props.info.profileBackground : apiPath + defaultBg } alt={ `${ this.props.info.name.split(" ")[0] }'s background` } />
        </div>
        <div className="rn-account-controls">
          <div className="rn-account-controls-avatar">
            <img src={ apiPath + this.props.info.image } alt={ `${ this.props.info.name.split(" ")[0] }'s background` } />
          </div>
          <div className="rn-account-controls-mat">
            {
              (this.props.info.id === cookieControl.get("userdata").id) ? (
                <button
                  className="rn-account-controls-mat-btn icon"
                  onClick={ this.props.openSettings }>
                  <i className="fas fa-cog" />
                </button>
              ) : null
            }
            {
              (this.props.info.id !== cookieControl.get("userdata").id) ? (
                <Link to={ `${ links["CHAT_PAGE"] }/${ this.props.info.url }` }>
                  <button
                    className="rn-account-controls-mat-btn icon">
                    <i className="far fa-envelope" />
                  </button>
                </Link>
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
          <div className="rn-account-info-mat-name">
            <h1>{ this.props.info.name }</h1>
            {
              (!this.props.info.isVertificated) ? null : (
                <VertificatedStar />
              )
            }
          </div>
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
                  <span>Joined { this.convertTime(this.props.info.joinedDate) }</span>
                </div>
              ) : null
            }
          </div>
          <div className="rn-account-info-mat-follows">
            <Link className="rn-account-info-mat-follows-item" to={ `${ links["FOLLOWERS_PAGE"] }/${ this.props.info.url }/following?b=true` }>
              <span className="rn-account-info-mat-follows-item-num">{ this.props.info.subscribedToInt }</span>
              <span className="rn-account-info-mat-follows-hvk">Following</span>
            </Link>
            <Link className="rn-account-info-mat-follows-item" to={ `${ links["FOLLOWERS_PAGE"] }/${ this.props.info.url }/followers?b=true` }>
              <span className="rn-account-info-mat-follows-item-num">{ this.props.info.subscribersInt }</span>
              <span className="rn-account-info-mat-follows-hvk">Followers</span>
            </Link>
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
        isLiked: false,
        deleteInFocus: false,
        isDeleted: false
      }
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
      if(likeTweet === null) destroySession();

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

  deleteTweet = () => {
    this.setState(() => {
      return {
        isDeleted: true
      }
    });

    let { id, login, password } = cookieControl.get("userdata");
    this.props.deleteTweet({
      variables: {
        id, login, password,
        targetID: this.props.id
      }
    });
  }

  render() {
    if(this.state.isDeleted) return null;

    return(
      <div className="rn-account-tweets-mat-item">
        <div className="rn-account-tweets-mat-item-mg">
          <img src={ apiPath + this.props.creator.image } alt={ this.props.creator.name } />
        </div>
        <div className="rn-account-tweets-mat-item-content">
          <Link className="rn-account-tweets-mat-item-redirect" to={ `${ links["TWEET_PAGE"] }/${ this.props.id }` } />
          <div className="rn-account-tweets-mat-item-content-info">
            <span className="rn-account-tweets-mat-item-content-info-name">{ this.props.creator.name }</span>
            <span className="rn-account-tweets-mat-item-content-info-url">@{ this.props.creator.url }</span>
            <span>•</span>
            <span className="rn-account-tweets-mat-item-content-info-time">{ convertTime(this.props.time) }</span>
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
            {
              (this.props.creator.id !== cookieControl.get("userdata").id) ? null : (
                <button
                  className={ `rn-account-tweets-mat-item-content-mat-controls-btn delete${ (!this.state.deleteInFocus) ? "" : " active" }` }
                  onClick={ () => this.setState({ deleteInFocus: true }) }
                  onBlur={ () => this.setState({ deleteInFocus: false }) }
                  onDoubleClick={ this.deleteTweet }>
                  <i className="fas fa-times" />
                </button>
              )
            }
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
                  deleteTweet={ this.props.deleteTweet }
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
            defaultValue={ this.props.defaultValue }
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
            defaultValue={ this.props.defaultValue }
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
        image: null,
        imagePreview: "",
        background: null,
        backgroundPreview: ""
      }
    }
  }

  componentDidMount() {
    this.setState(({ data }) => {
      return {
        data: {
          ...data,
          name: this.props.info.name,
          description: this.props.info.profileDescription,
          location: this.props.info.location,
        }
      }
    });
  }

  setDatValue = (valueName, value, preview = false) => {
    this.setState(({ data }) => {
      let a = {
        ...data,
        [valueName]: value,
      };
      
      if(preview) {
        a[{
          image: "imagePreview",
          background: "backgroundPreview"
        }[valueName]] = URL.createObjectURL(value);
      }
      if(value === "DELETE_CURRENT_IMAGE_ACTION_NO_URL_PROVIDED") {
        a[{
          image: "imagePreview",
          background: "backgroundPreview"
        }[valueName]] = " ";
      }

      return {
        data: a
      }
    });
  }

  submit = () => {
    // Clear URL Cache
    {
      let a = [
        "imagePreview",
        "backgroundPreview"
      ];
      a.forEach(io => window.URL.revokeObjectURL(this.state[io]));
    }

    // Close modal
    this.props.onClose();

    // Upload to server
    {
      let { id, login, password } = cookieControl.get("userdata"),
          { name, description, location, image, background } = this.state.data;
      this.props.saveDocument({
        variables: {
          id,
          login,
          password,
          name,
          description,
          location,
          image,
          background
        }
      }).then(({ data: { updateUserInfo } }) => {
        clearCache();
        this.props.submitNewData(updateUserInfo);
      }).catch(destroySession);
    }
  }

  render() {
    return(
      <React.Fragment>
        <div
          className={ `rn-account-settingsbg${ (!this.props.inFocus) ? "" : " focus" }` }
          onClick={ this.props.onClose }
        />
        <div className={ `rn-account-settings${ (!this.props.inFocus) ? "" : " focus" }` }>
          <div className="rn-account-settings-nav">
            <div>
              <button
                className="rn-account-settings-nav-cltimes"
                onClick={ this.props.onClose }>
                <i className="fas fa-times" />
              </button>
              <span className="rn-account-settings-nav-title">Edit profile</span>
            </div>
            <div>
              <button
                className="rn-account-settings-nav-save"
                onClick={ this.submit }>
                Save
              </button>
            </div>
          </div>
          <div className="rn-account-settings-content">
            <div className="rn-account-settings-content-bg">
              <img
                src={ this.state.data.backgroundPreview ? this.state.data.backgroundPreview : this.props.info.profileBackground ? apiPath + this.props.info.profileBackground : "" }
                alt={ this.props.info.name }
                className="rn-account-settings-content-bg-mg"
              />
              <div className="rn-account-settings-content-bg-controls">
                <input
                  type="file"
                  accept="image/*"
                  id="rn-account-settings-content-bg-controls-upload"
                  className="sett_upload_hidden"
                  onChange={ ({ target: { files } }) => this.setDatValue("background", files[0], true) }
                />
                <label
                  htmlFor="rn-account-settings-content-bg-controls-upload"
                  className="rn-account-settings-content-bg-controls-btn">
                  <i className="fas fa-camera" />
                </label>
                <button
                  className="rn-account-settings-content-bg-controls-btn"
                  onClick={ () => this.setDatValue("background", "DELETE_CURRENT_IMAGE_ACTION_NO_URL_PROVIDED") }>
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>
            <div className="rn-account-settings-content-avatar">
              <div className="rn-account-settings-content-avatar-mat">
                <img
                  src={ this.state.data.imagePreview ? this.state.data.imagePreview : this.props.info.image ? apiPath + this.props.info.image : "" }
                  alt={ this.props.info.name }
                  className="rn-account-settings-content-avatar-mat-mg"
                />
                <div className="rn-account-settings-content-avatar-mat-controls">
                  <input
                    type="file"
                    accept="image/*"
                    id="rn-account-settings-content-avatar-mat-controls-upload"
                    className="sett_upload_hidden"
                    onChange={ ({ target: { files } }) => this.setDatValue("image", files[0], true) }
                  />
                  <label
                    htmlFor="rn-account-settings-content-avatar-mat-controls-upload"
                    className="rn-account-settings-content-avatar-mat-controls-btn">
                    <i className="fas fa-camera" />
                  </label>
                </div>
              </div>
            </div>
            {
              [
                {
                  limit: "30",
                  valueName: "name",
                  name: "Name",
                  type: "text",
                  defaultValue: this.props.info.name
                },
                {
                  limit: "500",
                  valueName: "description",
                  name: "Bio",
                  type: "textarea",
                  defaultValue: this.props.info.profileDescription
                },
                {
                  limit: "30",
                  valueName: "location",
                  name: "Location",
                  type: "text",
                  defaultValue: this.props.info.location
                }
              ].map(({ limit, valueName, type, name, defaultValue }, index) => {
                return(
                  <SettingsField
                    key={ index }
                    type={ type }
                    name={ name }
                    limit={ limit }
                    defaultValue={ defaultValue }
                    submitValue={ value => this.setDatValue(valueName, value) }
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
      userFetched: false,
      settingsModal: false
    }
  }

  componentDidUpdate(pProps) {
    { // Validate page transition
      let a = this.props.match.params.url,
          b = this.state.user;
      if(
        b &&
        ((a && (b.url !== a && b.id !== a)) ||
        (!a && b.id !== cookieControl.get("userdata").id))
      ) { // XXX
        this.setState(() => {
          return {
            user: false
          }
        }, this.fetchUser);
      }

      if(this.state.userFetched && b === null) {
        destroySession();
      }
    }
    { // Subscription > Likes counter was updated
      let a = pProps.tweetUpdatedLikes.updatedAccountTweetLikes,
          b = this.props.tweetUpdatedLikes.updatedAccountTweetLikes;

      if((!a && b) || (a && b && (a.id !== b.id || a.likesInt !== b.likesInt))) {
        let c = Array.from(this.state.user.tweets);
        c.find(({ id }) => id === b.id).likesInt = b.likesInt;
        this.setState(({ user }) => {
          return {
            user: {
              ...user,
              tweets: c
            }
          }
        })
      }
    }
    { // Subscription > Comments counter was updated
      let a = pProps.tweetUpdatedComments.updatedAccountTweetComments,
          b = this.props.tweetUpdatedComments.updatedAccountTweetComments;

      if((!a && b) || (a && b && (a.id !== b.id || a.commentsInt !== b.commentsInt))) {
        let c = Array.from(this.state.user.tweets);
        c.find(({ id }) => id === b.id).commentsInt = b.commentsInt;
        this.setState(({ user }) => {
          return {
            user: {
              ...user,
              tweets: c
            }
          }
        })
      }
    }
    { // Subscription > Account information was updated
      let a = pProps.accountUpdatedInformation.updatedAccountInformation,
          b = this.props.accountUpdatedInformation.updatedAccountInformation;

      if((!a && b) || (a && b && (a.id !== b.id || a.commentsInt !== b.commentsInt))) {
        this.setState(({ user }) => {
          return {
            user: {
              ...user,
              ...b
            }
          }
        });
      }
    }
  }

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser = () => {
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
            isVertificated,
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
        targetUrl: this.props.match.params.url || ""
      }
    }).then(({ data: { user } }) => {
      if(!user) destroySession();

      this.setState(() => {
        return {
          user: user,
          userFetched: true
        }
      });
    }).catch(destroySession);
  }

  editData = a => {
    Object.keys(a).forEach(io => {
      let ia = a[io];
      if(!ia && typeof ia !== "string") delete a[io];
    });

    this.setState(({ user }) => {
      return {
        user: {
          ...user,
          ...a
        }
      }
    });
  }

  render() {
    if(!this.state.userFetched || !this.state.user) {
      return(
        <div className="rn-account">
          <LoadingIcon />
        </div>
      )
    }

    return(
      <div className="rn-account">
        <Info
          info={ this.state.user } // XXX: Receives all tweets also.
          subscribeMutation={ this.props.subscribeMutation }
          openSettings={ () => this.setState({ settingsModal: true }) }
        />
        <Tweets
          tweets={ this.state.user.tweets }
          likeTweetMutation={ this.props.likeTweetMutation }
          deleteTweet={ this.props.deleteTweet }
        />
        <Settings
          inFocus={ this.state.settingsModal }
          info={ this.state.user } // XXX: Receives all tweets also.
          onClose={ () => this.setState({ settingsModal: false }) }
          saveDocument={ this.props.saveDocument }
          submitNewData={ this.editData }
        />
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
  `, { name: "likeTweetMutation" }),
  graphql(gql`
    mutation($id: ID!, $login: String!, $password: String!, $name: String, $description: String, $location: String, $image: Upload, $background: Upload) {
      updateUserInfo(id: $id, login: $login, password: $password, name: $name, description: $description, location: $location, image: $image, background: $background) {
        id,
        name,
        profileDescription,
        profileBackground,
        location,
        image
      }
    }
  `, { name: "saveDocument" }),
  graphql(gql`
    mutation($id: ID!, $login: String!, $password: String!, $targetID: ID!) {
      deleteTweet(id: $id, login: $login, password: $password, targetID: $targetID) {
        id
      }
    }
  `, { name: "deleteTweet" }),
  graphql(gql`
    subscription($id: ID!, $url: String!) {
      updatedAccountTweetLikes(id: $id, url: $url) {
        id,
        likesInt
      }
    }
  `, {
    name: "tweetUpdatedLikes",
    options: {
      variables: {
        url: window.location.pathname.split("/")[2] || "",
        id: cookieControl.get("userdata").id
      }
    }
  }),
  graphql(gql`
    subscription($id: ID!, $url: String!) {
      updatedAccountTweetComments(id: $id, url: $url) {
        id,
        commentsInt
      }
    }
  `, {
    name: "tweetUpdatedComments",
    options: {
      variables: {
        url: window.location.pathname.split("/")[2] || "",
        id: cookieControl.get("userdata").id
      }
    }
  }),
  graphql(gql`
    subscription($id: ID!, $url: String!) {
      updatedAccountInformation(
        url: $url,
        id: $id
      ) {
        name,
        profileDescription,
        location,
        profileBackground,
        image
      }
    }
  `, {
    name: "accountUpdatedInformation",
    options: {
      variables: {
        url: window.location.pathname.split("/")[2] || "",
        id: cookieControl.get("userdata").id
      }
    }
  })
)(App);
