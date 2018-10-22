import React, { Component } from 'react';
import './main.css';
import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';

import links from '../../links';
import cookieControl from '../../cookieControl';
import client from '../../apollo';
import { apiPath } from '../../apiPath';
import { convertTime } from '../../timeConvertor';

import VertificatedStar from '../__forall__/vertificated/app';

function destroySession() {
  cookieControl.delete("userdata");
  return window.location.reload();
}

var clearMemory = () => client.clearStore();

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
      clearMemory();
    }).catch(destroySession);
  }

  render() {
    return(
      <form className="rn-main-news-field rn-field" onSubmit={ this.post }>
        <div className="rn-main-news-field-mat">
          <Link to={ `${ links["ACCOUNT_PAGE"] }` }>
            <img className="rn-main-news-field-mat-mg" src={ this.props.userdata ? apiPath + this.props.userdata.image : "" } alt="" />
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
      isLikeChangeable: true,
      deleteInFocus: false,
      isDeleted: false
    }
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
      }, clearMemory);
    }).catch(destroySession);
  }

  getLikeState = () => (this.state.isLikeFetched) ? this.state : this.props;

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
      <div className="rn-main-news-mat-item rn-field">
        <Link to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.creatorUrl }` } className="rn-main-news-mat-item-mg">
          <img src={ apiPath + this.props.creatorImage } alt={ this.props.creatorName } />
        </Link>
        <div className="rn-main-news-mat-item-mat">
          <Link className="rn-main-news-mat-item-rft" to={ `${ links["TWEET_PAGE"] }/${ this.props.id }` } />
          <div className="rn-main-news-mat-item-mat-tit">
            <Link className="rn-main-news-mat-item-mat-tit-mninfo" to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.creatorUrl }` }>
              <div className="rn-main-news-mat-item-mat-name">
                <span>{ this.props.creatorName }</span>
                {
                  (!this.props.creatorVertificated) ? null : (
                    <VertificatedStar />
                  )
                }
              </div>
              <span className="rn-main-news-mat-item-mat-url">@{ this.props.creatorUrl }</span>
            </Link>
            <span className="rn-main-news-mat-item-mat-splitdot"> • </span>
            <span className="rn-main-news-mat-item-mat-time">{ convertTime(this.props.time) }</span>
          </div>
          <p className="rn-main-news-mat-item-content">
            { this.props.content }
          </p>
          <div className="rn-main-news-mat-item-control">
            <Link to={ `${ links["TWEET_PAGE"] }/${ this.props.id }` }>
              <button className="rn-main-news-mat-item-control-btn">
                <i className="far fa-comment" />
                <span>{ this.props.comments }</span>
              </button>
            </Link>
            <button
              className={ `rn-main-news-mat-item-control-btn${ (!this.getLikeState().isLiked) ? "" : " liked" }` }
              onClick={ this.likeTweet }
              key={ !this.getLikeState().isLiked ? "A" : "B" }>
              <i className={ `${ !this.getLikeState().isLiked ? "far" : "fas" } fa-heart` } />
              <span>{ this.getLikeState().likes }</span>
            </button>
            {
              (this.props.creatorID === cookieControl.get("userdata").id) ? (
                <button
                  className={ `rn-main-news-mat-item-control-btn delete${ (!this.state.deleteInFocus) ? "" : " active" }` }
                  onClick={ () => this.setState({ deleteInFocus: true }) }
                  onBlur={ () => this.setState({ deleteInFocus: false }) }
                  onDoubleClick={ this.deleteTweet }>
                  <i className="fas fa-times" />
                </button>
              ) : null
            }
          </div>
        </div>
      </div>
    );
  }
}

class MainNews extends Component {
  render() {
    return(
      <div className="rn-main-news">
        <MainNewsNew
          userdata={ this.props.userdata }
          tweetMutation={ this.props.tweetMutation }
          onNewTweet={ this.props.addCTweet }
        />
        <div className={ `loading-icon${ (this.props.loading) ? " visible" : "" }` }></div>
        <div className={ `rn-main-news-mat${ (this.props.loading) ? " hidden" : "" }` }>
          {
            this.props.data.map(({ id, time, isLiked, content, creator, likesInt: likes, commentsInt: comments }) => {
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
                  creatorVertificated={ creator.isVertificated }
                  likePost={ this.props.likePostMut }
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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feed: false,
      feedFetching: true
    }
  }

  componentDidMount() {
    this.fetchFeed();
  }

  fetchFeed = () => {
    this.setState(() => {
      return {
        feedFetching: true
      }
    });

    client.query({
      query: gql`
        query($id: ID!, $login: String!, $password: String!) {
          fetchFeed(id: $id, login: $login, password: $password) {
            commentsInt,
            likesInt,
            content,
            id,
            time,
            isLiked(id: $id),
            creator {
              id,
              image,
              url,
              name,
              isVertificated
            }
          }
        }
      `,
      variables: {
        id: cookieControl.get("userdata").id,
        login: cookieControl.get("userdata").login,
        password: cookieControl.get("userdata").password
      }
    }).then(({ data: { fetchFeed } }) => {
      if(fetchFeed === null) return destroySession();

      this.setState(() => {
        return {
          feed: fetchFeed,
          feedFetching: false
        }
      });
    });
  }

  addCTweet = ({ addTweet }) => {
    let a = Array.from(this.state.feed);
    a.unshift(addTweet);

    this.setState(() => {
      return {
        feed: a
      }
    }, clearMemory);
  }

  render() {
    return(
      <div className="rn-main">
        <MainNews
          loading={ this.state.feedFetching }
          data={ this.state.feed || [] }
          userdata={ this.props.useracc.user }
          likePostMut={ this.props.likePost }
          tweetMutation={ this.props.tweetMutation }
          deleteTweet={ this.props.deleteTweet }
          addCTweet={ this.addCTweet }
        />
      </div>
    );
  }
}

export default compose(
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
        isLiked(id: $id),
        creator {
          id,
          image,
          url,
          name,
          isVertificated
        }
      }
    }
  `, { name: "tweetMutation" }),
  graphql(gql`
    mutation($id: ID!, $login: String!, $password: String!, $targetID: ID!) {
      deleteTweet(id: $id, login: $login, password: $password, targetID: $targetID) {
        id
      }
    }
  `, { name: "deleteTweet" })
)(App);
