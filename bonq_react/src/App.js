import React from 'react';
import { HashRouter, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import axios from 'axios';
import Start from './Start';
import Login from './Login';
import Test from './Test';
import Register from './Register';
import './App.css';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			isAuthenticated: false,
			token: null
		};
		this.authenticate = this.authenticate.bind(this);
		this.logout = this.logout.bind(this);
		this.refresh = this.refresh.bind(this);
	}

// KEEP USER LOGGED IN AFTER REFRESH
	componentDidMount() {
		const lsToken = localStorage.getItem('jwt');
		if (lsToken) {
			this.authenticate(lsToken);
		}
	}

	authenticate(token) {
		this.setState({
			isAuthenticated: true,
			token: token
		});
		localStorage.setItem('jwt', token);
	}

	logout() {
		console.log(this.state);
		this.setState({
			isAuthenticated: false,
			token: null
		});
		console.log(this.state);
	}

	refresh() {
		console.log("REFRESH");
		return axios.get('http://localhost:8000/api/refreshToken', {
			headers: { 'Authorization': 'Bearer ' + this.state.token }
		})
		.then((response) => {
			const token = response.data.token;
			this.authenticate(token);
		})
		.catch((error) => {
			console.log('Error!', error);
		});
	}

	render() {
		return (
			<HashRouter>
					<Switch>
						<Route exact path='/' component={Start} />
						<Route exact path='/login' render={(props) =>
							<Login authenticate={this.authenticate} isAuthenticated={this.state.isAuthenticated} {...props} />} />
						<Route exact path='/register' render={(props) =>
							<Register authenticate={this.authenticate} isAuthenticated={this.state.isAuthenticated} {...props} />} />

						<PrivateRoute exact path='/succes' component={Test} isAuthenticated={this.state.isAuthenticated} token={this.state.token} refresh={this.refresh} />
					</Switch>

			</HashRouter>
		);
	}
}

const PrivateRoute = ({ component: Component, isAuthenticated, token, ...rest }) => (
	<Route {...rest} render={props => (
		isAuthenticated ? (
			<Component {...props} {...rest} token={token} isAuthenticated={isAuthenticated} />
		) : (
			<Redirect to={{
				pathname: '/login',
				state: { from: props.location }
			}} />
		)
	)} />
);




// const Menu = (props) => (
// 	<Menu isAuthenticated={this.state.isAuthenticated} logout={this.logout} />
// 	<ul className="list-inline">
// 		<li>
// 			<NavLink exact activeClassName="active" to="/">
// 				Start
// 			</NavLink>
// 		</li>
// 		<li>
// 			<NavLink exact activeClassName="active" to="/login">
// 				Login
// 			</NavLink>
// 		</li>
// 		<li>
// 			<NavLink exact activeClassName="active" to="/register">
// 				Register
// 			</NavLink>
// 		</li>
// 		<li>
// 			<NavLink exact activeClassName="active" to="/succes">
// 				Succes
// 			</NavLink>
// 		</li>
// 		{props.isAuthenticated ?
// 			<li>
// 				<a href="/" onClick={props.logout}>
// 					Logout
// 				</a>
// 			</li>
// 			:
// 			null
// 		}
// 	</ul>
// );

export default App;
