import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import NewToBonq from './NewToBonq';
import Back from './Back';
import './Register.css';

//This component is for the Register page
class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      email: '',
      password: '',
      error: '',
      redirect: false,
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

//Changes value based on change in the input field
  handleChange(event) {
		const name = event.target.name;
		this.setState({
			[name]: event.target.value
		});
	}

//Function that registers a user & logs in after registration
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });
    axios.post('https://bonq-api.herokuapp.com/api/signup', {
        username:this.state.username,
        email: this.state.email,
        password: this.state.password,
      })
    .then((response) => {
      this.setState({ error: '' });
      axios.post('https://bonq-api.herokuapp.com/api/signin', {
        email: this.state.email,
        password: this.state.password
      })
      .then((response) => {
        this.setState({ loading: false });
  			//authenticate the jwt token
        const token = response.data.token;
        this.props.authenticate(token);
        this.setState({redirect: true});
      })
    })
		//Error when provided e-mail or username that already exists in database
    .catch((error) => {
      this.setState({ loading: false });
      const status = error.response.status;
      if (status === 500) {
        this.setState({ error: 'Username / Email already in use' });
      }
    });
  }

  render(){
    const { redirect } = this.state;

    // Redirects to dashboard after registration
    if (redirect) {
      return <Redirect to="/dashboard"/>
    }

    // Cannot access register when already logged in
    if (this.props.isAuthenticated) {
      return (
        <Redirect to='/dashboard'/>
      );
    };

    return (
      <section className="register">
        <div className="background">
         <div className="background__inside"></div>
        </div>
        <Back text="&larr; back to start" link="/"/>
        <article className="register__article">
          <h1 className="register__article__title">Register</h1>
          <form className="register__article__form" onSubmit={this.handleSubmit}>
            <label className="register__article__form__label">Username
              <input className="register__article__form__input"
                name='username'
                type='username'
                value={this.state.username}
                onChange={this.handleChange}
                required
                maxLength="15"/>
            </label>
            <label className="register__article__form__label">Email
              <input className="register__article__form__input"
                name='email'
                type='email'
                value={this.state.email}
                onChange={this.handleChange}
                required />
            </label>
            <label className="register__article__form__label">Password
              <input className="register__article__form__input"
                name='password'
                type='password'
                value={this.state.password}
                onChange={this.handleChange}
                required/>
            </label>
            <input className="register__article__form__button" type='submit' value='Create Account' />
            {this.state.loading && <img className="register__article__form__loading" src="/img/loading.gif" alt="Loading..."/>}
            {this.state.error !== '' ?
              <p className="register__article__error">{this.state.error}</p>
            :
              <p className="register__article__error"> </p>
            }
          </form>
    			<NewToBonq text="Already a bonq user?" link="/login" linktext="Click here to sign in" />
        </article>
      </section>
    );
  };
};

export default Register;
