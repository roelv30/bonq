import React from 'react';
import axios from 'axios';

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      email: '',
      password: '',
      error: ''
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
        console.log(response);
  			this.setState({ error: '' });
  		})
  		.catch((error) => {
  			const status = error.response.status;
  			if (status === 500) {
  				this.setState({ error: 'Username or Email already in use' });
  			}
  		});
  	}

  render(){
    return (
      <div>
        <h1>Register</h1>
          {this.state.error !== '' ?
            <p className="text-danger">{this.state.error}</p>
            :
            null
          }
          <form onSubmit={this.handleSubmit}>
            <div className='form-group'>
              <input
                name='username'
                type='username'
                className='form-control'
                placeholder='Username'
                value={this.state.username}
                onChange={this.handleChange} />
            </div>
            <div className='form-group'>
              <input
                name='email'
                type='email'
                className='form-control'
                placeholder='Email'
                value={this.state.email}
                onChange={this.handleChange} />
            </div>
            <div className='form-group'>
              <input
                name='password'
                type='password'
                className='form-control'
                placeholder='Password'
                value={this.state.password}
                onChange={this.handleChange} />
            </div>
            <div className='form-group'>
              <input type='submit' className='btn' value='Register' />
            </div>
          </form>
      </div>
    );
  }
}
export default Register;
