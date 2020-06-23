import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import axios from 'axios';
import NewToBonq from './NewToBonq';
import Back from './Back';
import './Login.css';

class Login extends React.Component {
	constructor() {
		super();
		this.state = {
			email: '',
			password: '',
			error: '',
			loading: false,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	};

	handleChange(event) {
		const name = event.target.name;
		this.setState({
			[name]: event.target.value
		});
	};

	handleSubmit(event) {
		event.preventDefault();
	  this.setState({ loading: true });
		axios.post('http://localhost:8000/api/signin', {
			email: this.state.email,
			password: this.state.password
		})
		.then((response) => {
		  this.setState({ loading: false });
			this.setState({ error: '' });
			const token = response.data.token;
			this.props.authenticate(token);
		})
		.catch((error) => {
			this.setState({ loading: false });
			const status = error.response.status;
			if (status === 401) {
				this.setState({ error: 'Username or password not recognised.' });
			}
		});
	};

	render() {
		if (this.props.isAuthenticated && this.props.location.state !== undefined) {
			return (
				<Redirect to='/succes'/>
			);
		};

		return (
			<section className="login">
			<div className="background">
			 <div className="background__inside"></div>
		 </div>
				<Back />
				<article className="login__article">
					<h1 className="login__article__title">Login</h1>
					<form className="login__article__form" onSubmit={this.handleSubmit}>
					  <label className="login__article__form__label">Email
							<input className="login__article__form__input"
									name='email'
									type='email'
									placeholder='Email'
									value={this.state.email}
									onChange={this.handleChange} />
						</label>
					 <label className="login__article__form__label">Password
						<input className="login__article__form__input"
								name='password'
								type='password'
								placeholder='Password'
								value={this.state.password}
								onChange={this.handleChange} />
						</label>
						<NavLink exact activeClassName="active" className="login__article__form__forgotten" to="#">Forgotten your password?</NavLink>
						<input className="login__article__form__button" type='submit' value='Login' />
				    {this.state.loading && <img className="login__article__form__loading" src="/img/loading.gif" alt="Loading..."/>}

						{this.state.error !== '' ?
							<p className="login__article__error">{this.state.error}</p>
							:
							<p className="login__article__error"> </p>
						}
					</form>
					<NewToBonq text="New to bonq?" link="/register" linktext="Sign up for free!" className="login__article__new" />
				</article>
			</section>
		);
	};
};

export default Login;
