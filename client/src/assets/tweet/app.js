import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';
import cookieControl from '../../cookieControl';
import client from '../../apollo';

const image = "https://pbs.twimg.com/profile_images/710038421436170240/apTtjpa4_bigger.jpg";

 class Comment extends Component {
   render() {
     return(
      <React.Fragment>
        <div className="rn-tweet-comments-comment">
           <div className="rn-tweet-comments-comment-mg">
             <img src={ this.props.creator.image } alt="" />
           </div>
           <div className="rn-tweet-comments-comment-content">
             <div className="rn-tweet-comments-comment-content-cri">
               <div className="rn-tweet-comments-comment-content-cri-inf">
                 <span className="rn-tweet-comments-comment-content-cri-inf-name">{ this.props.creator.name }</span>
                 <span className="rn-tweet-comments-comment-content-cri-inf-url">@{ this.props.creator.url }</span>
                 <span>•</span>
                 <span className="rn-tweet-comments-comment-content-cri-inf-time">8h</span>
               </div>
               <span className="rn-tweet-comments-comment-content-cri-repl"></span>
             </div>
             <p className="rn-tweet-comments-comment-content-mat">
               { this.props.content }
             </p>
             <div className="rn-tweet-comments-comment-content-control">
               <button className="rn-tweet-comments-comment-content-control-btn">
                 <i className="far fa-heart" />
                 <span>{ this.props.likes }</span>
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
      tweet: false
    }
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
    });
  }

  getAPI = (def = []) => {
    if(this.state.tweet === false) return def; // loading
    else if(this.state.tweet) return this.state.tweet;
    else if(this.props.tweet === null) { // unsecure session
      this.props.history.push("/home");
      return def;
    }
  }

  convertTime = (time, isFull) => {
    if(!time) return false;

    let a = new Date(parseInt(time)),
        b = b1 => b1.toString(),
        c = c1 => (b(c1).length === 1) ? "0" + c1 : b(c1);
    console.log(a, time);

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

  render() {
    return(
      <div className="rn-tweet">
        <div className="rn-tweet-creator">
          <div className="rn-tweet-creator-bx">
            <img className="rn-tweet-creator-mg" alt="" src={ this.getAPI({creator:{image:""}}).creator.image } />
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
          <button className="rn-tweet-controls-btn"><i className="far fa-heart" />{ this.getA }</button>
          <button className="rn-tweet-controls-btn"><i className="far fa-comment" /></button>
        </div>
        <div className="rn-tweet-brdt big" />
        <div className="rn-tweet-comments">
          {
            this.getAPI({comments:[]}).comments.map(({ id, creator, content, time, likesInt }) => {
              return(
                <Comment
                  key={ id }
                  id={ id }
                  content={ content }
                  time={ time }
                  likes={ likesInt }
                  creator={ creator }
                />
              );
            })
          }
        </div>
        <div
          className="rn-tweet-commat">
          <input type="text" />
          <button><i className="far fa-paper-plane" /></button>
        </div>
      </div>
    );
  }
}

export default App;
