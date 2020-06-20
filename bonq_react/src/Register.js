import React from 'react';
import axios from 'axios';
import {Redirect, NavLink} from 'react-router-dom';

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      email: '',
      password: '',
      error: '',
      redirect: false
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
  		axios.post('http://localhost:8000/api/signup', {
        username:this.state.username,
  			email: this.state.email,
  			password: this.state.password,
  		})

  		.then((response) => {
  			this.setState({ error: '' });
        console.log(response);
        console.log("geregistreerd nu inloggen");

          axios.post('http://localhost:8000/api/signin', {
            email: this.state.email,
            password: this.state.password
          })
          .then((response) => {
            const token = response.data.token;
            this.props.authenticate(token);
            console.log(token);
            this.setState({redirect: true});
          })
        })
  		.catch((error) => {
  			const status = error.response.status;
  			if (status === 500) {
  				this.setState({ error: 'Username or Email already in use' });
  			}
  		});
  	}



  render(){
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to="/succes"/>
    }

    return (

      <section>
      <header>
        <img src="/img/logo.png" alt="Bonq Logo"/>
      </header>

			<NavLink exact activeClassName="active" to="/">
				back to start
			</NavLink>

      <article>
        <h1>Register</h1>
          {this.state.error !== '' ?
            <p className="text-danger">{this.state.error}</p>
            :
            null
          }
          <form onSubmit={this.handleSubmit}>
              <input
                name='username'
                type='username'
                className='form-control'
                placeholder='Username'
                value={this.state.username}
                onChange={this.handleChange} />
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
              <input type='submit' className='btn' value='Register' />
          </form>
          </article>
      </section>
    );
  }
}
export default Register;
