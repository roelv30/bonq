import React from 'react';
import axios from 'axios';
import {NavLink} from 'react-router-dom';
import './Dashboard.css';
import Avatar from './Avatar';
var myProps;


class Dashboard extends React.Component {

	constructor() {
		super();
		this.state = {
			user: [],
		}
	};

	handleLogout(event) {
		event.preventDefault();
		myProps.logout();
	};

	componentDidMount(){
		this.getUser();
	};

	componentDidUpdate(prevProps, prevState){
		if (prevProps.token !== this.props.token) {
			this.getUser();
		}
	};

	getUser() {
		const token = this.props.token;
		axios.get('http://localhost:8000/api/dashboard', {
			headers: { 'Authorization': 'Bearer ' + token }
		})
		.then((response) => {
			const user = response.data;
			this.setState({user});
			myProps = this.props;
		})
		.catch((error) => {
			const status = error.response.status;
			if (status === 401 && this.props.isAuthenticated) {
				// logged in but invalid jwt
				this.props.refresh();
			}
		});
	};

	render() {
		return(
			<section className="dashboard">
				<article className='dashboard__article'>
					<h1 className='dashboard__article__title'>Welcome back {this.state.user.username}!</h1>
					<section className='dashboard__article__details'>
						<Avatar token={this.props.token} />
						<article className="dashboard__article__details__stats">
							<section className="dashboard__article__details__stats__content">
								<img className="dashboard__article__details__stats__content--left" src="/img/crown.svg" alt="Crown Icon"/>
								<p className="dashboard__article__details__stats__content--center">Level</p>
								<p className="dashboard__article__details__stats__content--right">{this.state.user.level}</p>
							</section>
							<section className="dashboard__article__details__stats__content">
								<img className="dashboard__article__details__stats__content--left" src="/img/medal.svg" alt="Medal Icon"/>
								<p className="dashboard__article__details__stats__content--center">Total wins</p>
								<p className="dashboard__article__details__stats__content--right">{this.state.user.wins}</p>
							</section>
							<section className="dashboard__article__details__stats__content">
								<img className="dashboard__article__details__stats__content--left" src="/img/bonqs.png" alt="Bonqs Currency Icon"/>
								<p className="dashboard__article__details__stats__content--center">Total bonqs</p>
								<p className="dashboard__article__details__stats__content--right">{this.state.user.bonqs}</p>
							</section>
						</article>
					</section>

					<section className="dashboard__article__menu">
						<NavLink exact activeClassName="active" className="dashboard__article__menu__button" to="#">friends</NavLink>
						<NavLink exact activeClassName="active" className="dashboard__article__menu__button" to="#">stats</NavLink>
						<NavLink exact activeClassName="active" className="dashboard__article__menu__button" to="#">shop</NavLink>
						<NavLink exact activeClassName="active" className="dashboard__article__menu__button" to="#">settings</NavLink>
					</section>
				</article>

				<article className="dashboard__article--game">
					<h1 className="dashboard__article__title">Pick a game</h1>
					<img className="dashboard" src="/img/pubquiz.jpeg" alt="Pubquiz Background"/>
					<NavLink exact activeClassName="active" className="dashboard__article__menu__button" to="/joingame">Create</NavLink>
					<NavLink exact activeClassName="active" className="dashboard__article__menu__button" to="#">Join</NavLink>
				</article>


			</section>
		)
	}
};


export default Dashboard;
