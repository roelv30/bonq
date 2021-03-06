import React from 'react';
import axios from 'axios';
import {NavLink} from 'react-router-dom';
import './Dashboard.css';
import Avatar from './Avatar';
var myProps;

//This component is for the Dashboard page for a logged in user
class Dashboard extends React.Component {
	constructor() {
		super();
		this.state = {
			user: [],
		}
	};

// Function that uses the logout function defined in App.js [logout()]
	handleLogout(event) {
		event.preventDefault();
		myProps.logout();
	};

//Calls getUser() on mount
	componentDidMount(){
		this.getUser();
	};

//Calls getUser() on update
	componentDidUpdate(prevProps, prevState){
		if (prevProps.token !== this.props.token) {
			this.getUser();
		}
	};

//Get current logged in user from API & set as state
	getUser() {
		const token = this.props.token;
		axios.get('https://bonq-api.herokuapp.com/api/dashboard', {
			headers: { 'Authorization': 'Bearer ' + token }
		})
		.then((response) => {
			const user = response.data;
			this.setState({user});
			//Set username for game
			this.props.socket.emit("username", response.data.username);
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
					<h1 className='dashboard__article__title'>
							Welcome back
								<span className='dashboard__article__title--pink'> {this.state.user.username}</span>
							!
					</h1>
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
						<NavLink exact activeClassName="active" className="dashboard__article__menu__button" to="#">
							<img src="/img/friends.svg" alt="Friends Icon" className="dashboard__article__menu__button__img"/>
							friends
						</NavLink>
						<NavLink exact activeClassName="active" className="dashboard__article__menu__button" to="#">
							<img src="/img/stats.svg" alt="Stats Icon" className="dashboard__article__menu__button__img"/>
							stats
						</NavLink>
						<NavLink exact activeClassName="active" className="dashboard__article__menu__button" to="#">
							<img src="/img/shop.svg" alt="Shop Icon" className="dashboard__article__menu__button__img"/>
							shop
						</NavLink>
						<NavLink exact activeClassName="active" className="dashboard__article__menu__button" to="#">
							<img src="/img/settings.svg" alt="Settings Icon" className="dashboard__article__menu__button__img"/>
							settings
						</NavLink>
					</section>
				</article>

				<h1 className="dashboard__article__title--center">Pick a game</h1>

				<article className="dashboard__article--games">

					<section className="dashboard__article__game">
						<article className="dashboard__article__game__title">
							<img className="dashboard__article__game__title__img" src="/img/pubquiz.jpeg" alt="Pubquiz Background"/>
							<p className="dashboard__article__game__title__text"> Pubquiz </p>
						</article>
						<article className="dashboard__article__game__options">
							<NavLink exact activeClassName="active" className="dashboard__article__game__options__button" to="/pubq/questions">Create</NavLink>
							<NavLink exact activeClassName="active" className="dashboard__article__game__options__button" to="/joingame">Join</NavLink>
						</article>
					</section>

					<section className="dashboard__article__game">
						<article className="dashboard__article__game__title">
							<img className="dashboard__article__game__title__img" src="/img/bubbletrouble.jpg" alt="Bubble Trouble Background"/>
							<p className="dashboard__article__game__title__text"> Bubble Trouble </p>
						</article>
						<article className="dashboard__article__game__options">
							<NavLink exact activeClassName="active" className="dashboard__article__game__options__button" to= {{
								pathname: '/easteregg',
								gameProps: {
									game: 'bubbletrouble'
								}
							}}>Play</NavLink>
						</article>
					</section>

					<section className="dashboard__article__game">
						<article className="dashboard__article__game__title">
							<img className="dashboard__article__game__title__img" src="/img/sonic.jpg" alt="Sonic Background"/>
							<p className="dashboard__article__game__title__text"> Sonic</p>
						</article>
						<article className="dashboard__article__game__options">
							<NavLink exact activeClassName="active" className="dashboard__article__game__options__button" to= {{
								pathname: '/easteregg',
								gameProps: {
									game: 'sonic'
								}
							}}>Play</NavLink>
						</article>
					</section>
					<section className="dashboard__article__game">
						<article className="dashboard__article__game__title">
							<img className="dashboard__article__game__title__img" src="/img/zwaardsandaal.jpg" alt="Zwaarden & Sandalen Background"/>
							<p className="dashboard__article__game__title__text"> Zwaarden & Sandalen</p>
						</article>
						<article className="dashboard__article__game__options">
							<NavLink exact activeClassName="active" className="dashboard__article__game__options__button" to= {{
								pathname: '/easteregg',
								gameProps: {
									game: 'zwaardsandaal'
								}
							}}>Play</NavLink>
						</article>
					</section>
				</article>
			</section>
		)
	}
};


export default Dashboard;
