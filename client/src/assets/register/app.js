import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';

import client from '../../apollo';
import cookieControl from '../../cookieControl';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stage: "LOGIN",
      error: {
        visible: false,
        message: ""
      },
      data: {
        login: {
          login: "",
          password: ""
        },
        register: {
          name: "",
          login: "",
          password: "",
          image: null,
          url: ""
        }
      }
    }
  }

  setStage = stageName => {
    this.setState(({ stage}) => {
      return {
        error: {
          visible: false,
          mesasge: ""
        },
        stage: [
          "LOGIN",
          "REGISTER"
        ].indexOf(stageName) !== -1 ? stageName : stage
      }
    })
  }

  setValue = (stage, target, value) => {
    this.setState(({ data }) => {
      return {
        data: {
          ...data,
          [stage]: {
            ...data[stage],
            [target]: value
          }
        }
      }
    })
  }

  login = e => {
    e.preventDefault();

    let { login, password } = this.state.data.login;
    client.query({
      query: gql`
        query($login: String!, $password: String!) {
          login(login: $login, password: $password) {
            id,
            login,
            password
          }
        }
      `,
      variables: {
        login,
        password
      }
    }).then(({ data }) => {
      let a = en => {
        this.setState(() => {
          return {
            error: {
              visible: en,
              message: en ? "Invalid login or password!" : ""
            }
          }
        });
      }
      if(!data.login) { // bad auth data
        a(true);
      } else { // enter
        let { id, login, password } = data.login;
        a(false);
        cookieControl.set("userdata", {
          id,
          login,
          password
        });
        window.location.reload();
      }
    });
  }

  register = e => {
    e.preventDefault();

    let { login, password, name, image, url } = this.state.data.register;

    if(url.split(" ").length >= 2) {
      return this.setState(() => {
        return {
          error: {
            visible: true,
            message: "URL cannot contain spaces!"
          }
        }
      });
    }

    this.props.register({
      variables: {
        login, password, name, image, url
      }
    }).then(res => {
      if(!res.data.registerUser) {
        return this.setState(() => {
          return {
            error: {
              visible: true,
              message: "User with this URL or Login exists!"
            }
          }
        });
      }

      let { id, login, password } = res.data.registerUser;
      cookieControl.set("userdata", {
        id,
        login,
        password
      });

      window.location.reload();
    });
  }

  render() {
    return(
      <div className="rn-register">
        <h1 className="rn-register-title">Twitter</h1>
        <p className={ `rn-register-form_log-err${ (!this.state.error.visible) ? "" : " visible" }` }>{ this.state.error.message }</p>

        <form
          className={ `rn-register-form rn-register-form_log${ (this.state.stage === "LOGIN") ? " visible" : "" }` }
          onSubmit={ this.login }>
          <input
            className="rn-register-form-inp"
            type="text"
            placeholder="Login"
            onChange={ ({ target }) => this.setValue("login", "login", target.value) }
            required
          />
          <input
            className="rn-register-form-inp"
            type="password"
            placeholder="Password"
            onChange={ ({ target }) => this.setValue("login", "password", target.value) }
            required
          />
          <button type="submit" className="rn-register-form-sub">Login</button>
          <button type="button" onClick={ () => this.setStage("REGISTER") } className="rn-register-form-sub add">Register</button>
        </form>

        <form
          className={ `rn-register-form rn-register-form_reg${ (this.state.stage === "REGISTER") ? " visible" : "" }` }
          onSubmit={ this.register }>
          <input
            className="rn-register-form-inp"
            type="text"
            placeholder="Name"
            onChange={ ({ target }) => this.setValue("register", "name", target.value) }
            required
          />
          <input
            className="rn-register-form-inp"
            type="text"
            placeholder="@url"
            onChange={ ({ target }) => this.setValue("register", "url", target.value) }
            required
          />
          <input
            className="rn-register-form-inp"
            type="text"
            placeholder="Login"
            onChange={ ({ target }) => this.setValue("register", "login", target.value) }
            required
          />
          <input
            className="rn-register-form-inp"
            type="password"
            placeholder="Password"
            onChange={ ({ target }) => this.setValue("register", "password", target.value) }
            required
          />
          <input
            required
            id="rn-register-form-phg"
            type="file"
            title="Photo"
            accept="image/*"
            onChange={ ({ target }) => this.setValue("register", "image", target.files[0]) }
          />
          <label className="rn-register-form-phg" htmlFor="rn-register-form-phg">Image</label>
          <button type="submit" className="rn-register-form-sub">Register</button>
          <button type="button" onClick={ () => this.setStage("LOGIN") } className="rn-register-form-sub add">Login</button>
        </form>

      </div>
    );
  }
}

export default compose(
  graphql(gql`
    mutation($name: String!, $login: String!, $password: String!, $image: Upload!, $url: String!) {
      registerUser(name: $name, login: $login, password: $password, image: $image, url: $url) {
        id,
        login,
        password
      }
    }
  `, { name: "register" })
)(App);
