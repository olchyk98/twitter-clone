import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { compose, graphql } from 'react-apollo';

import cookieControl from '../../cookieControl';
import client from '../../apollo';
import links from '../../links';

function destroySession() {
  cookieControl.delete("userdata");
  return window.location.href = links["REGISTER_PAGE"];
}

 class Comment extends Component {
   constructor(props) {
     super(props);

     this.state = {
       likes: {
        allowed: false,
        fromState: false,
        isLiked: false,
        likes: 0
       }
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
      let a = cookieControl.get("userdata"),
          b = this.state.likes.fromState,
          c = this.props.likes,
          d = this.state.likes.likes,
          e = (!b) ? !this.props.isLiked : !this.state.likes.isLiked;

     this.setState(({ likes }) => {
       return {
         likes: {
           ...likes,
           fromState: true,
           isLiked: b,
           likes: !b ? e ? c + 1 : c - 1 : e ? d + 1 : d - 1
         }
       }
     })

     this.props.likeMutation({
       variables: {
        id: a.id,
        login: a.login,
        password: a.password,
        targetID: this.props.id
       }
     }).then(console.log);
   }

   getLikesSource = () => {
     return (!this.state.likes.fromState) ? this.props : this.state.likes;
   }

   render() {
     return(
      <React.Fragment>
        <div className="rn-tweet-comments-comment">
           <div className="rn-tweet-comments-comment-mg">
             <img src={ this.props.creator.image } alt={ this.props.creator.name } />
           </div>
           <div className="rn-tweet-comments-comment-content">
             <div className="rn-tweet-comments-comment-content-cri">
               <div className="rn-tweet-comments-comment-content-cri-inf">
                 <span className="rn-tweet-comments-comment-content-cri-inf-name">{ this.props.creator.name }</span>
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
                  className={ `rn-tweet-comments-comment-content-control-btn rn-tweet-controls-btn ${ (!this.getLikesSource().isLiked) ? "" : " active" }` }
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
      isCommenting: false
    }

    this.commentRef = React.createRef();
  }

  componentDidMount() {
    this.fetchAPI();
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
            isLiked,
            isSubscribedToCreator,
            creator {
              image,
              id,
              url,
              name
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
                id
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
    }).catch(destroySession);
  }

  getAPI = (def = []) => {
    if(this.state.tweet === false) return def; // loading
    else if(this.state.tweet) return this.state.tweet;
    else if(this.props.tweet === null) { // unsecure session
      this.props.history.push("/home");
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
      });
    });
  }

  render() {
    return(
      <div className="rn-tweet">
        <div className="rn-tweet-creator">
          <div className="rn-tweet-creator-bx">
            <img
              className="rn-tweet-creator-mg"
              alt={ this.getAPI({creator:{name:""}}).creator.name }
              src={ this.getAPI({creator:{image:""}}).creator.image }
            />
            <div className="rn-tweet-creator-info">
              <p className="rn-tweet-creator-info-name">{ this.getAPI({creator:{name:""}}).creator.name }</p>
              <span className="rn-tweet-creator-info-url">@{ this.getAPI({creator:{url:""}}).creator.url }</span>
            </div>
          </div>
          <div className="rn-tweet-creator-bx">
            {
              (this.getAPI({creator:{id:""}}).creator.id === cookieControl.get("userdata").id) ? null:(
                <button className={ `rn-tweet-creator-follow${ (this.getAPI().isSubscribedToCreator) ? " active" : "" }` }>{ (this.getAPI().isSubscribedToCreator) ? "Following" : "Follow" }</button>
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
            className={ `rn-tweet-controls-btn like${ (!this.state.tweet.isLiked) ? "" : " active" }` }
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
            className={ `rn-tweet-controls-btn${ !this.state.isCommenting ? "" : " active" }` }
            onClick={ this.commentFillFocus }>
            <i className="far fa-comment" />
          </button>
        </div>
        <div className="rn-tweet-brdt big" />
        <div className="rn-tweet-comments">
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
                />
              );
            })
          }
        </div>
        <div
          className="rn-tweet-commat">
          <input
            type="text"
            ref={ ref => this.commentRef = ref }
            onFocus={ () => this.setState({ isCommenting: true }) }
            onBlur={ () => this.setState({ isCommenting: false }) }
          />
          <button><i className="far fa-paper-plane" /></button>
        </div>
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
  `, { name: "likeComment" })
)(App);
