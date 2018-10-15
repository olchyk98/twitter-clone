import React, { Component } from 'react';
import './main.css';

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
          <button className="rn-tweet-controls-btn"><i className="far fa-comment" /></button>
          <button className="rn-tweet-controls-btn"><i className="far fa-heart" /></button>
        </div>
        <div className="rn-tweet-brdt big" />
        <div className="rn-tweet-comments">
          <div className="rn-tweet-comment">

          </div>
        </div>
      </div>
    );
  }
}

export default App;
