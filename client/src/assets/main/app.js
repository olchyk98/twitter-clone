import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';

import links from '../../links';
import cookieControl from '../../cookieControl';
import client from '../../apollo';

function destroySession() {
  return;
  cookieControl.delete("userdata");
  return window.location.reload();
}

class MainNewsNew extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contentVal: ""
    }

    this.mainInput = React.createRef();
  }

  post = e => {
    e.preventDefault();
    this.mainInput.value = "";

    let a = cookieControl.get("userdata");
    this.props.tweetMutation({
      variables: {
        id: a.id,
        login: a.login,
        password: a.password,
        content: this.state.contentVal
      }
    }).then(({ data: addTweet }) => {
      if(addTweet === null) { // unsecure session
        return destroySession();
      }

      this.props.onNewTweet(Object.assign({}, addTweet));
    }).catch(destroySession);
  }

  render() {
    return(
      <form className="rn-main-news-field rn-field" onSubmit={ this.post }>
        <div className="rn-main-news-field-mat">
          <Link to="/account">
            <img className="rn-main-news-field-mat-mg" src={ this.props.userdata ? this.props.userdata.image : "" } alt="" />
          </Link>
          <input
            type="text"
            placeholder={ `How is your day going,${ this.props.userdata ? " " + this.props.userdata.name.split(" ")[0] : "" }?` }
            className="rn-main-news-field-mat-inp"
            ref={ ref => this.mainInput = ref }
            onChange={ ({ target: { value } }) => this.setState({ contentVal: value }) }
            required
          />
        </div>
        <button type="submit" className="rn-main-news-field-submit"><i className="far fa-paper-plane" /></button>
      </form>
    );
  }
}

class MainNewsItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLiked: false,
      likes: 0,
      isLikeFetched: false,
      isLikeChangeable: true
    }
  }

  convertTime = unxtime => {
    let a = new Date(unxtime),
        b = b1 => b1.toString(),
        c = c1 => b(c1).length === 1 ? "0" + c1 : b(c1);

    // Date type in mongoDB Schema provides String.
    // String -> Integer => new Date(Integer);

    // 86400000 - one unix day

    let months = [
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
    ];

    return (
      (new Date().getTime() - unxtime >= 86400000) ? ( // more than one day
        `${ c(a.getDate()) } ${ months[a.getMonth() + 1] } ${ c(a.getHours()) }:${ c(a.getMinutes()) }`
      ) : (
        `${ c(a.getHours()) }:${ c(a.getMinutes()) }`
      )
    );
  }

  likeTweet = () => {
    if(!this.state.isLikeChangeable) return;

    let { id, login, password } = cookieControl.get("userdata");

    // ex-IDEA: Change state instantly, but validate it later. - done

    let likes = !this.state.isLikeFetched ? this.props.likes : this.state.likes,
        a = (!this.state.isLikeFetched) ? !this.props.isLiked : !this.state.isLiked;

    this.setState(() => {
      return {
        isLiked: a,
        likes: a ? likes + 1 : likes - 1,
        isLikeFetched: true,
        isLikeChangeable: false
      }
    });

    this.props.likePost({
      variables: {
        id: id,
        login: login,
        password: password,
        targetID: this.props.id
      }
    }).then(({ data: { likeTweet } }) => {
      this.setState(() => {
        return {
          isLiked: likeTweet,
          likes: likeTweet ? likes + 1 : likes - 1,
          isLikeChangeable: true
        }
      });
    }).catch(destroySession);
  }

  getLikeState = () => (this.state.isLikeFetched) ? this.state : this.props;

  render() {
    return(
      <div className="rn-main-news-mat-item rn-field">
        <Link to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.creatorUrl }` } className="rn-main-news-mat-item-mg">
          <img src={ this.props.creatorImage } alt={ this.props.creatorName } />
        </Link>
        <div className="rn-main-news-mat-item-mat">
          <Link className="rn-main-news-mat-item-rft" to={ `${ links["TWEET_PAGE"] }/${ this.props.id }` } />
          <div className="rn-main-news-mat-item-mat-tit">
            <Link to="/account">
              <span className="rn-main-news-mat-item-mat-name">{ this.props.creatorName }</span>
              <span className="rn-main-news-mat-item-mat-url">@{ this.props.creatorUrl }</span>
            </Link>
            <span className="rn-main-news-mat-item-mat-splitdot"> • </span>
            <span className="rn-main-news-mat-item-mat-time">{ this.convertTime(parseInt(this.props.time)) }</span>
          </div>
          <p className="rn-main-news-mat-item-content">
            { this.props.content }
          </p>
          <div className="rn-main-news-mat-item-control">
            <button className="rn-main-news-mat-item-control-btn">
              <i className="far fa-comment" />
              <span>{ this.props.comments }</span>
            </button>
            <button
              className={ `rn-main-news-mat-item-control-btn${ (!this.getLikeState().isLiked) ? "" : " liked" }` }
              onClick={ this.likeTweet }
              key={ !this.getLikeState().isLiked ? "A" : "B" }>
              <i className={ `${ !this.getLikeState().isLiked ? "far" : "fas" } fa-heart` } />
              <span>{ this.getLikeState().likes }</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class MainNews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetchedTweets: false,
      tweets: []
    }
  }

  getTweetsSource = () => {
    let a = this.props.data;
    return !this.state.isFetchedTweets ? (a) ? a : [] : this.state.tweets;
  }

  addCTweet = ({ addTweet }) => {
    let a = Array.from(this.getTweetsSource());
    a.unshift(addTweet);

    this.setState(() => {
      return {
        isFetchedTweets: true,
        tweets: a
      }
    })
  }

  render() {
    return(
      <div className="rn-main-news">
        <MainNewsNew
          userdata={ this.props.userdata }
          tweetMutation={ this.props.tweetMutation }
          onNewTweet={ this.addCTweet }
        />
        <div className={ `loading-icon${ (this.props.loading) ? " visible" : "" }` }></div>
        <div className={ `rn-main-news-mat${ (this.props.loading) ? " hidden" : "" }` }>
          {
            this.getTweetsSource().map(({ id, time, isLiked, content, creator, likesInt: likes, commentsInt: comments }) => {
              return(
                <MainNewsItem
                  key={ id }
                  id={ id }
                  content={ content }
                  likes={ likes }
                  time={ time }
                  comments={ comments }
                  isLiked={ isLiked }
                  creatorImage={ creator.image }
                  creatorName={ creator.name }
                  creatorUrl={ creator.url }
                  creatorID={ creator.id }
                  likePost={ this.props.likePostMut }
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}

class Main extends Component {
  componentDidUpdate() {
    if(!this.props.feed.loading && this.props.feed.error) client.resetStore();
  }

  getFeedData = () => {
    let a = this.props.feed;
    if(a.loading) return [];

    if(!a.loading && a.fetchFeed) {
      return a.fetchFeed;
    } else if(!a.loading && !a.fetchFeed) { // unsecure session
      destroySession();
    }
  }

  render() {
    return(
      <div className="rn-main">
        <MainNews
          loading={ this.props.feed.loading }
          data={ this.getFeedData() }
          userdata={ this.props.useracc.user }
          likePostMut={ this.props.likePost }
          tweetMutation={ this.props.tweetMutation }
        />
      </div>
    );
  }
}

export default compose(
  graphql(gql`
    query($id: ID!, $login: String!, $password: String!) {
      fetchFeed(id: $id, login: $login, password: $password) {
        commentsInt,
        likesInt,
        content,
        id,
        time,
        isLiked,
        creator {
          image,
          url,
          name
        }
      }
    }
  `, {
      name: "feed",
      options: {
        variables: {
          id: cookieControl.get("userdata").id,
          login: cookieControl.get("userdata").login,
          password: cookieControl.get("userdata").password
        }
      }
    }
  ),
  graphql(gql`
    query($id: ID!, $login: String!, $password: String!) {
      user(id: $id, login: $login, password: $password) {
        id,
        image,
        name
      }
    }
    `, {
      name: "useracc",
      options: {
        variables: {
          id: cookieControl.get("userdata").id,
          login: cookieControl.get("userdata").login,
          password: cookieControl.get("userdata").password
        }
      }
    }
  ),
  graphql(gql`
    mutation($id: ID!, $login: String!, $password: String!, $targetID: ID!) {
      likeTweet(id: $id, login: $login, password: $password, targetID: $targetID)
    }
  `, { name: "likePost" }),
  graphql(gql`
    mutation($id: ID!, $login: String!, $password: String!, $content: String!) {
      addTweet(id: $id, login: $login, password: $password, content: $content) {
        id,
        commentsInt,
        likesInt,
        content,
        time,
        isLiked,
        creator {
          image,
          url,
          name
        }
      }
    }
  `, { name: "tweetMutation" })
)(Main);
