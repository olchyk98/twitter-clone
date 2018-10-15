import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './libs/fontawesome';
import registerServiceWorker from './registerServiceWorker';
import cookieControl from './cookieControl';

import Nav from './assets/nav/app';
import Main from './assets/main/app';
import Register from './assets/register/app';
import Tweet from './assets/tweet/app';

import { BrowserRouter, Redirect, Switch } from 'react-router-dom';
import { Route } from 'react-router';

import { ApolloProvider } from 'react-apollo';
import apolloClient from './apollo';

// Get URL Path
import links from './links';

const pagesInfo = {
  [links["REGISTER_PAGE"]]: {
    id: links["REGISTER_PAGE"],
    loginRequired: false,
    menu: false
  },
  [links["MAIN_PAGE"]]: {
    id: links["MAIN_PAGE"],
    loginRequired: true,
    menu: true
  },
  [links["TWEET_PAGE"]]: {
    id: links["TWEET_PAGE"],
    loginRequired: true,
    menu: true
  }
}

let pageSession = pagesInfo[window.location.pathname];
if(!pageSession) pageSession = pagesInfo[links["MAIN_PAGE"]]

const QuaRoute = ({ component: Component, aif, redirect, ...settings }) => (
  <Route
    { ...settings }
    render={ props => {
      if(aif) {
        return <Component { ...props } />
      } else {
        return <Redirect to={ redirect } />
      }
    } }
  />
);

ReactDOM.render(
  <ApolloProvider client={ apolloClient }>
    <BrowserRouter>
      <React.Fragment>
        {
          (cookieControl.get("userdata")) ?
            <Nav />
          : null
        }
        <div id="main">
          <Switch>
            <QuaRoute
              exact
              path={ links["REGISTER_PAGE"] }
              component={ Register }
              aif={ !cookieControl.get("userdata") }
              redirect="/home"
            />
            <QuaRoute
              exact
              path={ links["MAIN_PAGE"] }
              component={ Main }
              aif={ cookieControl.get("userdata") }
              redirect="/register"
            />
            <QuaRoute
              exact
              path={ `${ links["TWEET_PAGE"] }/:id` }
              component={ Tweet }
              aif={ cookieControl.get("userdata") }
              redirect="/register"
            />
            <Redirect to="/home" />
          </Switch>
        </div>
      </React.Fragment>
    </BrowserRouter>
  </ApolloProvider>, document.getElementById('root'));
registerServiceWorker();
