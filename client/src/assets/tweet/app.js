import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';
import cookieControl from '../../cookieControl';

const image = "https://pbs.twimg.com/profile_images/710038421436170240/apTtjpa4_bigger.jpg";

class App extends Component {
  render() {
    return(
      <div className="rn-tweet">
        <div className="rn-tweet-creator">
          <div className="rn-tweet-creator-bx">
            <img className="rn-tweet-creator-mg" alt="" src={ image } />
            <div className="rn-tweet-creator-info">
              <p className="rn-tweet-creator-info-name">oles</p>
              <span className="rn-tweet-creator-info-url">@oles</span>
            </div>
          </div>
          <div className="rn-tweet-creator-bx">
            <button className="rn-tweet-creator-follow">Follow</button>
          </div>
        </div>
        <p className="rn-tweet-content">
          I'm from Ukraine. How are you?
        </p>
        <div className="rn-tweet-date">
          <span>8:10</span>
          <span>•</span>
          <span>Oct 15, 2018</span>
        </div>
        <div className="rn-tweet-brdt" />
        <div className="rn-tweet-stat">
          <div className="rn-tweet-stat-ret">
            <span className="rn-tweet-stat-num">2</span>
            <span className="rn-tweet-stat-tit">Likes</span>
          </div>
          <div className="rn-tweet-stat-ret">
            <span className="rn-tweet-stat-num">2</span>
            <span className="rn-tweet-stat-tit">Comments</span>
          </div>
        </div>
        <div className="rn-tweet-brdt" />
        <div className="rn-tweet-controls">
          <button className="rn-tweet-controls-btn"><i className="far fa-heart" /></button>
          <button className="rn-tweet-controls-btn"><i className="far fa-comment" /></button>
        </div>
        <div className="rn-tweet-brdt big" />
        <div className="rn-tweet-comments">
          <div className="rn-tweet-comments-comment">
            <div className="rn-tweet-comments-comment-mg">
              <img src={ image } alt="" />
            </div>
            <div className="rn-tweet-comments-comment-content">
              <div className="rn-tweet-comments-comment-content-cri">
                <div className="rn-tweet-comments-comment-content-cri-inf">
                  <span className="rn-tweet-comments-comment-content-cri-inf-name">Oles</span>
                  <span className="rn-tweet-comments-comment-content-cri-inf-url">@oles</span>
                  <span>•</span>
                  <span className="rn-tweet-comments-comment-content-cri-inf-time">8h</span>
                </div>
                <span className="rn-tweet-comments-comment-content-cri-repl"></span>
              </div>
              <p className="rn-tweet-comments-comment-content-mat">
                В школе на родительском собрании учительницы говорили моим родителям "он конечно долбоеб, но швей будет хороших нанимать"
              </p>
              <div className="rn-tweet-comments-comment-content-control">
                <button className="rn-tweet-comments-comment-content-control-btn">
                  <i className="far fa-heart" />
                  <span>3</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="rn-tweet-brdt big" />
        <div
          className="rn-tweet-commat">
          <input type="text" />
          <button><i className="far fa-paper-plane" /></button>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(gql`
    query($id: ID!, $login: String!, $password: String!, $targetID: ID!) {
      tweet(id: $id, login: $login, password: $password, targetID: $targetID) {
        id
      }
    }
  `, {
    name: "tweet",
    options: {
      variables: {
        id: cookieControl.get("userdata").id,
        login: cookieControl.get("userdata").login,
        password: cookieControl.get("userdata").password,
        targetID: window.location.pathname.split("/")[2] // XXX
      }
    }
  })
)(App);
