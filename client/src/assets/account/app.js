import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';

import cookieControl from '../../cookieControl';

const image = "https://pbs.twimg.com/profile_banners/941023810278625280/1537693349/600x200";
const image2 = "https://pbs.twimg.com/profile_images/1049760543580540932/zIp6Wuz2_200x200.jpg";

class Info extends Component {
  render() {
    return(
      <div className="rn-account-info">
        <div className="rn-account-bg">
          <img src={ image } alt="asd" />
        </div>
        <div className="rn-account-controls">
          <div className="rn-account-controls-avatar">
            <img src={ image2 } alt="" />
          </div>
          <div className="rn-account-controls-mat">
            <button className="rn-account-controls-mat-btn icon">
              <i className="far fa-envelope" />
            </button>
            <button className="rn-account-controls-mat-btn">Follow</button>
          </div>
        </div>
        <div className="rn-account-info-mat">
          <h1 className="rn-account-info-mat-name">Oles Odynets</h1>
          <p className="rn-account-info-mat-url">@oles</p>
          <p className="rn-account-info-mat-desc">
            Чисто чиллю по дефолтуЧисто чиллю по дефолтуЧисто чиллю по дефолтуЧисто чиллю по дефолтуЧисто чиллю по дефолтуЧисто чиллю по дефолтуЧисто чиллю по дефолтуЧисто чиллю по дефолтуЧисто чиллю по дефолтуЧисто чиллю по дефолтуЧисто чиллю по дефолтуЧисто чиллю по дефолтуЧисто чиллю по дефолту
          </p>
          <div className="rn-account-info-mat-addvinfo">
            <div className="rn-account-info-mat-addvinfo-item">
              <i className="fas fa-map-marker-alt" />
              <span className="rn-account-info-mat-follows-item-num">Lviv</span>
            </div>
            <div className="rn-account-info-mat-addvinfo-item">
              <i className="fas fa-calendar-alt" />
              <span>Joined Dec 2008</span>
            </div>
          </div>
          <div className="rn-account-info-mat-follows">
            <div className="rn-account-info-mat-follows-item">
              <span className="rn-account-info-mat-follows-item-num">3</span>
              <span>Following</span>
            </div>
            <div className="rn-account-info-mat-follows-item">
              <span className="rn-account-info-mat-follows-item-num">131</span>
              <span>Followers</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class TweetsTweet extends Component {
  render() {
    return(
      <div className="rn-account-tweets-mat-item">
        <div className="rn-account-tweets-mat-item-mg">
          <img src={ image2 } alt="" />
        </div>
        <div className="rn-account-tweets-mat-item-content">
          <div className="rn-account-tweets-mat-item-content-info">
            <span className="rn-account-tweets-mat-item-content-info-name">oles</span>
            <span className="rn-account-tweets-mat-item-content-info-url">@oles</span>
            <span>•</span>
            <span className="rn-account-tweets-mat-item-content-info-time">12m</span>
          </div>
          <p className="rn-account-tweets-mat-item-content-mat">
            Chill, No Chill without Life Chill, No Chill without Life Chill, No Chill without Life Chill, No Chill without Life Chill, No Chill without Life Chill, No Chill without Life Chill, No Chill without Life Chill, No Chill without Life Chill, No Chill without Life Chill, No Chill without Life
          </p>
          <div className="rn-account-tweets-mat-item-content-mat-controls">
            <button className="rn-account-tweets-mat-item-content-mat-controls-btn">
              <i className="far fa-comment" />
              <span>31</span>
            </button>
            <button className="rn-account-tweets-mat-item-content-mat-controls-btn">
              <i className="far fa-heart" />
              <span>31</span>
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
          <TweetsTweet />
          <TweetsTweet />
          <TweetsTweet />
          <TweetsTweet />
        </div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return(
      <div className="rn-account">
        <Info />
        <Tweets />
      </div>
    );
  }
}

export default compose(
  graphql(gql`
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
          creator {
            id,
            url,
            name,
            image
          }
        }
      }
    }
  `, {
    name: "userInfo",
    options: {
      variables: {
        id: cookieControl.get("userdata").id,
        login: cookieControl.get("userdata").login,
        password: cookieControl.get("userdata").password,
        targetUrl: window.location.pathname.split("/")[2] || ""
      }
    }
  })
)(App);
