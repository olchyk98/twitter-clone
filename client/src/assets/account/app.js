import React, { Component } from 'react';
import './main.css';

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
              <span>Lviv</span>
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
      <div className="rn-account-tweets-tweet">
        
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

export default App;
