import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { compose, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';

import cookieControl from '../../cookieControl';
import client from '../../apollo';
import links from '../../links';
import { apiPath } from '../../apiPath';

import VertificatedStar from '../__forall__/vertificated/app';

var clearMemory = () => client.clearStore();

 class Comment extends Component {
   constructor(props) {
     super(props);

     this.state = {
       likes: {
        allowed: true,
        fromState: false,
        isLiked: false,
        likes: 0
       },
       deleteInFocus: false,
       isDeleted: false
     }
   }

  convertTime(time) { // clf
    if(!time) return "";
    // minute -- 60
    // hour -- 3600
    // day -- 86400
    // week -- 604800
    // month -- 2419200

    time /= 1000;
    let a = (new Date()).getTime() / 1000,
        // b = b1 => b1.toString(),
        c = c1 => a - time < c1,
        d = Math.round;

    if(c(60)) { // seconds<minute
      return d((a - time)) + "s";
    } else if(c(3600)) { // minutes<hour
      return d((a - time) / 60) + "m";
    } else if(c(86400)) { // hours<day
      return d((a - time) / 3600) + "h";
    } else if(c(604800)) { // days<week
      return d((a - time) / 86400) + "d";
    } else if(c(2419200)) { // weeks<month
      return d((a - time) / 604800) + "w";
    } else if(time < 0) {
      return "";
    } else { // date - Oct 23, 2018 18:32
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

  likeComment = () => {
    if(!this.state.likes.allowed) return;

    let a = cookieControl.get("userdata"),
        b = this.state.likes.fromState,
        c = (!b) ? this.props.likes : this.state.likes.likes,
        d = (!b) ? !this.props.isLiked : !this.state.likes.isLiked;

   this.setState(({ likes }) => {
     return {
       likes: {
         ...likes,
         fromState: true,
         isLiked: d,
         likes: d ? c + 1 : c - 1,
         allowed: false
       }
     }
   });

  this.props.likeMutation({
    variables: {
      id: a.id,
      login: a.login,
      password: a.password,
      targetID: this.props.id
    }
   }).then(({ data: { likeComment: liked } }) => {
    this.setState(({ likes }) => {
      return {
        likes: {
          ...likes,
          isLiked: liked,
          likes: liked ? c + 1 : c - 1,
          allowed: true
        }
      }
    }, clearMemory);
  });
   }

  getLikesSource = () => {
   return (!this.state.likes.fromState) ? this.props : this.state.likes;
  }

  deleteComment = () => {
    this.setState(() => {
      return {
        deleteInFocus: false,
        isDeleted: true
      }
    });

    let { id, login, password } = cookieControl.get("userdata");

    this.props.deleteMutation({
      variables: {
        id, login, password,
        targetID: this.props.id
      }
    });
  }

  render() {
    if(this.state.isDeleted) return null;

    return(
      <React.Fragment>
        <div className="rn-tweet-comments-comment">
          <Link className="rn-tweet-comments-comment-mg" to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.creator.url }` }>
            <img src={ apiPath + this.props.creator.image } alt={ this.props.creator.name } />
          </Link>
          <div className="rn-tweet-comments-comment-content">
            <div className="rn-tweet-comments-comment-content-cri">
              <div className="rn-tweet-comments-comment-content-cri-inf">
                <Link className="rn-tweet-comments-comment-content-cri-inf-name" to={ `${ links["ACCOUNT_PAGE"] }/${ this.props.creator.url }` }>
                  <span>{ this.props.creator.name }</span>
                  {
                    (!this.props.creator.isVertificated) ? null : (
                      <VertificatedStar />
                    )
                  }
                </Link>
                <span className="rn-tweet-comments-comment-content-cri-inf-url">@{ this.props.creator.url }</span>
                <span>•</span>
                <span className="rn-tweet-comments-comment-content-cri-inf-time">{ this.convertTime(this.props.time) }</span>
              </div>
              <span className="rn-tweet-comments-comment-content-cri-repl"></span>
            </div>
            <p className="rn-tweet-comments-comment-content-mat">
              { this.props.content }
            </p>
            <div className="rn-tweet-comments-comment-content-control">
              <button
                className={ `rn-tweet-comments-comment-content-control-btn rn-tweet-controls-btn like ${ (!this.getLikesSource().isLiked) ? "" : " active" }` }
                onClick={ this.likeComment }
                key={ (!this.getLikesSource().isLiked) ? "A":"B" }>
                {
                  (!this.getLikesSource().isLiked) ?
                    <i className="far fa-heart" />
                  :
                    <i className="fas fa-heart" />
                }
                <span>{ this.getLikesSource().likes }</span>
              </button>
              {
                (this.props.creator.id !== cookieControl.get("userdata").id) ? null : (
                  <button
                    className={ `rn-tweet-comments-comment-content-control-btn rn-tweet-controls-btn delete${ (!this.state.deleteInFocus) ? "" : " active" }` }
                    onFocus={ () => this.setState({ deleteInFocus: true }) }
                    onBlur={ () => this.setState({ deleteInFocus: false }) }
                    onDoubleClick={ this.deleteComment }>
                    <i className="fas fa-times" />
                  </button>
                )
              }
             </div>
           </div>
         </div>
         <div className="rn-tweet-brdt big" />
        </React.Fragment>
     );
   }
 }

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tweet: false,
      isLikeAllowed: true,
      isCommenting: false,
      subscriptionAllowed: true,
      deleteInFocus: false
    }

    this.commentRef = React.createRef();
    this.commentsBlockRef = React.createRef();
  }

  componentDidMount() {
    this.fetchAPI();
  }

  componentDidUpdate(a) {
    // updatedTweetLikes
// likesUpdated
    let b = this.props;

    console.log(b.likesUpdated);

    // FIXME: Subscription data was received, but processed in wrong way.
    // TODO: Debug if-validate-statement

    if(b.likesUpdated.updatedTweetLikes) {
      console.log(
        a.likesUpdated.updatedTweetLikes,
        a.likesUpdated.updatedTweetLikes.likes, b.likesUpdated.updatedTweetLikes.likes,
        a.likesUpdated.updatedTweetLikes.id, b.likesUpdated.updatedTweetLikes.id
      );
    }

    { // Subscriptions > likesUpdated
      if(
        (!a.likesUpdated.updatedTweetLikes && b.likesUpdated.updatedTweetLikes) ||
        (
          a.likesUpdated.updatedTweetLikes &&
          (
            (
              a.likesUpdated.updatedTweetLikes.likes !== b.likesUpdated.updatedTweetLikes.likes
            ) ||
            (
              a.likesUpdated.updatedTweetLikes.id !== b.likesUpdated.updatedTweetLikes.id
            )
          )
        )
      ) {
        alert("LIKE was submited!");
      }
    }
  }

  fetchAPI = async () => {
    await this.setState(() => {
      return {
        tweet: false
      }
    });

    client.query({
      query: gql`
        query($id: ID!, $login: String!, $password: String!, $targetID: ID!) {
          tweet(id: $id, login: $login, password: $password, targetID: $targetID) {
            id,
            content,
            time,
            likesInt,
            commentsInt,
            isLiked(id: $id),
            isSubscribedToCreator,
            creator {
              image,
              id,
              url,
              name,
              isVertificated
            },
            comments {
              id,
              content,
              time,
              likesInt,
              isLiked(id: $id, login: $login, password: $password),
              creator {
                image,
                name,
                url,
                id,
                isVertificated
              }
            }
          }
        }
      `,
      variables: {
        id: cookieControl.get("userdata").id,
        login: cookieControl.get("userdata").login,
        password: cookieControl.get("userdata").password,
        targetID: window.location.pathname.split("/")[2] // XXX
      }
    }).then(({ data: { tweet } }) => {
      this.setState(() => {
        return { tweet }
      });
    }).catch(() => this.props.history.push(links["NOT_FOUND_PAGE"]));
  }

  getAPI = (def = []) => {
    if(this.state.tweet === false) return def; // loading
    else if(this.state.tweet) return this.state.tweet;
    else if(this.props.tweet === null) { // unsecure session
      this.props.history.push(links["MAIN_PAGE"]);
      return def;
    }
  }

  convertTime(time, isFull) {
    if(!time) return false;

    let a = new Date(parseInt(time)),
        b = b1 => b1.toString(),
        c = c1 => (b(c1).length === 1) ? "0" + c1 : b(c1);

    if(!isFull) { // 8:32
      return `${ c(a.getHours()) }:${ c(a.getMinutes()) }`;
    } else { // Oct 15, 2018
      let d = [
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
      ][a.getMonth()];
      return `${ d } ${ c(a.getDate()) }, ${ c(a.getFullYear()) }`
    }
  }

  commentFillFocus = () => {
    let a = this.commentRef,
        b = document.getElementById("main"); // XXX ?
    a.focus();
    b.scrollTo({ top: window.scrollY });
    b.scrollTo({
      top: a.getBoundingClientRect().top,
      behavior: "smooth"
    })
  }

  likeTweet = () => {
    if(!this.state.isLikeAllowed) return;

    let a = cookieControl.get("userdata"),
        { likesInt, isLiked } = this.state.tweet;

    this.setState(({ tweet }) => {
      return {
        tweet: {
          ...tweet,
          isLiked: !isLiked,
          likesInt: !isLiked ? likesInt + 1 : likesInt - 1,
        },
        isLikeAllowed: false
      }
    });

    this.props.likeTweet({
      variables: {
        id: a.id,
        login: a.login,
        password: a.password,
        targetID: this.state.tweet.id
      }
    }).then(({ data: { likeTweet } }) => {
      this.setState(({ tweet }) => {
        return {
          tweet: {
            ...tweet,
            isLiked: likeTweet,
            likesInt: likeTweet ? likesInt + 1 : likesInt - 1,
          },
          isLikeAllowed: true
        }
      }, clearMemory);
    });
  }

  commentTweet = e => {
    e.preventDefault();

    let { id, login, password } = cookieControl.get("userdata");
    let a = this.commentRef.value;

    this.commentRef.value = "";

    document.getElementById("main").scrollTo({ top: this.commentsBlockRef.getBoundingClientRect().top, behavior: "smooth" });
    this.props.commentTweet({
      variables: {
        id,
        login,
        password,
        targetID: this.state.tweet.id,
        content: a
      }
    }).then(({ data: { commentTweet: comment } }) => {
      this.setState(({ tweet }) => {
        return {
          tweet: {
            ...tweet,
            comments: [
              comment,
              ...tweet.comments
            ]
          }
        }
      }, clearMemory);
    });
  }

  followCreator = () => {
    if(!this.state.subscriptionAllowed) return;

    let { id, login, password } = cookieControl.get("userdata");

    this.setState(({ tweet }) => {
      return {
        tweet: {
          ...tweet,
          isSubscribedToCreator: !tweet.isSubscribedToCreator
        },
        subscriptionAllowed: false
      }
    })

    this.props.subscribeCreator({
      variables: {
        id,
        login,
        password,
        targetID: this.state.tweet.creator.id
      }
    }).then(({ data: { subscribeUser: subscribed } }) => {
      this.setState(({ tweet }) => {
        return {
          tweet: {
            ...tweet,
            isSubscribedToCreator: subscribed
          },
          subscriptionAllowed: true
        }
      })
    }, clearMemory);
  }

  deleteTweet = () => {
    if(this.getAPI({id:"-1"}) === "-1") return; // page was not loaded

    this.setState(() => {
      return {
        isDeleted: true
      }
    });

    let { id, login, password } = cookieControl.get("userdata");
    this.props.deleteTweet({
      variables: {
        id, login, password,
        targetID: this.getAPI(null).id
      }
    }).then(() => this.props.history.push(links["MAIN_PAGE"]));
  }

  render() {
    if(this.state.tweet === false) {
      return(
        <div className="rn-tweet">
          <div className="rn-tweet-loadingic"></div>
        </div>
      );
    }

    return(
      <div className="rn-tweet">
        <div className="rn-tweet-creator">
          <div className="rn-tweet-creator-bx">
            <Link to={ `${ links["ACCOUNT_PAGE"] }/${ this.getAPI({creator:{url:""}}).creator.url }` }>
              <img
                className="rn-tweet-creator-mg"
                alt={ this.getAPI({creator:{name:""}}).creator.name }
                src={ apiPath + this.getAPI({creator:{image:""}}).creator.image }
              />
            </Link>
            <Link to={ `${ links["ACCOUNT_PAGE"] }/${ this.getAPI({creator:{url:""}}).creator.url }` }>
              <div className="rn-tweet-creator-info">
                <div className="rn-tweet-creator-info-name">
                  <span>{ this.getAPI({creator:{name:""}}).creator.name }</span>
                  {
                    (!this.getAPI({creator:{isVertificated:false}}).creator.isVertificated) ? null: (
                      <VertificatedStar />
                    )
                  }
                </div>
                <span className="rn-tweet-creator-info-url">@{ this.getAPI({creator:{url:""}}).creator.url }</span>
              </div>
            </Link>
          </div>
          <div className="rn-tweet-creator-bx">
            {
              (this.getAPI({creator:{id:""}}).creator.id === cookieControl.get("userdata").id) ? null:(
                <button onClick={ this.followCreator } className={ `rn-tweet-creator-follow${ (this.getAPI().isSubscribedToCreator) ? " active" : "" }` }>{ (this.getAPI().isSubscribedToCreator) ? "Following" : "Follow" }</button>
              )
            }
          </div>
        </div>
        <p className="rn-tweet-content">
          { this.getAPI().content }
        </p>
        <div className="rn-tweet-date">
          <span>{ this.convertTime(this.getAPI({time:null}).time, false) }</span>
          <span>•</span>
          <span>{ this.convertTime(this.getAPI({time:null}).time, true) }</span>
        </div>
        <div className="rn-tweet-brdt" />
        <div className="rn-tweet-stat">
          <div className="rn-tweet-stat-ret">
            <span className="rn-tweet-stat-num">{ this.getAPI().likesInt }</span>
            <span className="rn-tweet-stat-tit">Like{ (this.getAPI().likesInt === 1) ? "" : "s" }</span>
          </div>
          <div className="rn-tweet-stat-ret">
            <span className="rn-tweet-stat-num">{ this.getAPI().commentsInt }</span>
            <span className="rn-tweet-stat-tit">Comment{ (this.getAPI().commentsInt === 1) ? "" : "s" }</span>
          </div>
        </div>
        <div className="rn-tweet-brdt" />
        <div className="rn-tweet-controls">
          <button
            className={ `rn-tweet-controls-btn main like${ (!this.state.tweet.isLiked) ? "" : " active" }` }
            key={ (!this.state.tweet.isLiked) ? "A":"B" }
            onClick={ this.likeTweet }>
            {
              (!this.state.tweet.isLiked) ?
                <i className="far fa-heart" />
              :
                <i className="fas fa-heart" />
            }
          </button>
          <button
            className={ `rn-tweet-controls-btn main comment${ !this.state.isCommenting ? "" : " active" }` }
            onClick={ this.commentFillFocus }>
            <i className="far fa-comment" />
          </button>
          {
            (this.getAPI({creator:{id:""}}).creator.id !== cookieControl.get("userdata").id) ? null : (
              <button
                className={ `rn-tweet-controls-btn main delete${ !this.state.deleteInFocus ? "" : " active" }` }
                onClick={ () => this.setState({ deleteInFocus: true }) }
                onBlur={ () => this.setState({ deleteInFocus: false }) }
                onDoubleClick={ this.deleteTweet }>
                <i className="fas fa-times" />
              </button>
            )
          }
        </div>
        <div className="rn-tweet-brdt big" />
        <div className="rn-tweet-comments" ref={ ref => this.commentsBlockRef = ref }>
          {
            this.getAPI({comments:[]}).comments.map(({ isLiked, id, creator, content, time, likesInt }) => {
              return(
                <Comment
                  key={ id }
                  id={ id }
                  content={ content }
                  time={ time }
                  isLiked={ isLiked }
                  likes={ likesInt }
                  creator={ creator }
                  likeMutation={ this.props.likeComment }
                  deleteMutation={ this.props.deleteComment }
                />
              );
            })
          }
        </div>
        <form
          onSubmit={ this.commentTweet }
          className="rn-tweet-commat">
          <input
            type="text"
            placeholder="Leave your comment here..."
            ref={ ref => this.commentRef = ref }
            onFocus={ () => this.setState({ isCommenting: true }) }
            onBlur={ () => this.setState({ isCommenting: false }) }
          />
          <button type="submit"><i className="far fa-paper-plane" /></button>
        </form>
      </div>
    );
  }
}

export default compose(
  graphql(gql`
    mutation($id: ID!, $login: String!, $password: String!, $targetID: ID!) {
      likeTweet(id: $id, login: $login, password: $password, targetID: $targetID)
    }
  `, { name: "likeTweet" }),
  graphql(gql`
    mutation($id: ID!, $login: String!, $password: String!, $targetID: ID!) {
      likeComment(id: $id, login: $login, password: $password, targetID: $targetID)
    }
  `, { name: "likeComment" }),
  graphql(gql`
    mutation($id: ID!, $login: String!, $password: String!, $targetID: ID!, $content: String!) {
      commentTweet(id: $id, login: $login, password: $password, targetID: $targetID, content: $content) {
        id,
        content,
        time,
        likesInt,
        isLiked(id: $id, login: $login, password: $password),
        creator {
          image,
          name,
          url,
          id
        }
      }
    }
  `, { name: "commentTweet" }),
  graphql(gql`
    mutation($id: ID!, $login: String!, $password: String!, $targetID: ID!) {
      subscribeUser(id: $id, login: $login, password: $password, targetID: $targetID)
    }
  `, { name: "subscribeCreator" }),
  graphql(gql`
    mutation($id: ID!, $login: String!, $password: String!, $targetID: ID!) {
      deleteTweet(id: $id, login: $login, password: $password, targetID: $targetID) {
        id
      }
    }
  `, { name: "deleteTweet" }),
  graphql(gql`
    mutation($id: ID!, $login: String!, $password: String!, $targetID: ID!) {
      deleteComment(id: $id, login: $login, password: $password, targetID: $targetID) {
        id
      }
    }
  `, { name: "deleteComment" }),
  graphql(gql`
    subscription($id: ID!) {
      updatedTweetLikes(
        id: $id
      ) {
        id,
        likesInt
      }
    }
  `, {
    name: "likesUpdated",
    options: {
      variables: {
        id: window.location.pathname.split("/")[2]
      }
    }
  }),
  graphql(gql`
    subscription($id: ID!) {
      updatedTweetComments(
        id: $id
      ) {
        id,
        commentsInt
      }
    }
  `, {
    name: "commentsUpdated",
    options: {
      variables: {
        id: window.location.pathname.split("/")[2]
      }
    }
  })
)(App);
