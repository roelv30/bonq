import React from 'react';
import axios from 'axios';
var myProps;

class Test extends React.Component {



	constructor() {
		super();
		this.state = {
			teams: [],
		}
	}

	handleClick(event) {
		event.preventDefault();
		myProps.logout();


	}

	componentDidMount(){
		this.getTests();

	}

	componentDidUpdate(prevProps, prevState){

		console.log(this.props.isAuthenticated);
		if (prevProps.token !== this.props.token) {
				this.getTests();
			}

	}

	getTests() {
		const token = this.props.token;
		axios.get('http://localhost:8000/api/test', {
			headers: { 'Authorization': 'Bearer ' + token }
		})
		.then((response) => {
			const teams = response.data;
			this.setState({
				teams: teams
			});

			myProps = this.props;
		})
		.catch((error) => {
			const status = error.response.status;
			if (status === 401 && this.props.isAuthenticated) {
				// logged in but invalid jwt
				this.props.refresh();
			}
		});
	}

	render() {

		return(
			<section>
				<a href="/" onClick={this.handleClick}>
					Logout
				</a>
				<h1>Succes!</h1>
				{this.state.teams.map((team, index) => {
					return (

					<ul className="team" key={index}>
					<h2>Data on Lobby {team.lobby_id}</h2>
						<li>{team.lobby_id}</li>
						<li>{team.game_host}</li>
						<li>{team.unique_id}</li>
						<li>{team.person_id}</li>
						<li>{team.group_size}</li>
						<li>{team.winner}</li>
						<li>{team.pun_id}</li>
					</ul>
					)
				})}
			</section>
		)
	}
}


export default Test;
