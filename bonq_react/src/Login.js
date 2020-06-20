import React from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import axios from 'axios';

class Login extends React.Component {
	constructor() {
		super();
		this.state = {
			email: '',
			password: '',
			error: '',
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		const name = event.target.name;
		this.setState({
			[name]: event.target.value
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		axios.post('http://localhost:8000/api/signin', {
			email: this.state.email,
			password: this.state.password
		})
		.then((response) => {
			this.setState({ error: '' });
			const token = response.data.token;
			this.props.authenticate(token);
		})
		.catch((error) => {
			const status = error.response.status;
			if (status === 401) {
				this.setState({ error: 'Username or password not recognised.' });
			}
		});
	}

	render(props) {
		console.log(this.props.isAuthenticated);
		if (this.props.isAuthenticated && this.props.location.state !== undefined) {
			return (
				<Redirect to='/succes'/>
			);
		}

		return (
			<section>
				<header>
					<img src="/img/logo.png" alt="Bonq Logo"/>
				</header>


				<NavLink exact activeClassName="active" to="/">
					back to start
				</NavLink>
				<h1>Login</h1>
				{this.state.error !== '' ?
					<p className="text-danger">{this.state.error}</p>
					:
					null
				}
				{this.props.isAuthenticated ?
					<p className="text-info">You are already logged in.</p>
					:
					<form onSubmit={this.handleSubmit}>
							<input
								name='email'
								type='email'
								className='form-control'
								placeholder='Email'
								value={this.state.email}
								onChange={this.handleChange} />
							<input
								name='password'
								type='password'
								className='form-control'
								placeholder='Password'
								value={this.state.password}
								onChange={this.handleChange} />
							<input type='submit' className='btn' value='Login' />
					</form>
				}
			</section>
		);
	}
}


export default Login;
