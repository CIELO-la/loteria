import React from 'react';
import './App.css';
import Caller from './Game/Game';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			caller: null
		};
	}

	componentDidMount() {
		!this.state.caller && this.setState(
			{ caller: new Caller('zapo-01') },
			() => {
				console.log(`¡Corre y se va!`);
				this.state.caller.iniciar();
				setInterval(
					() => console.log(`el ${this.state.caller.cantar().nombre}`),
					4000
				);
			}
		);
	}

	render() {
		return (
			<div className="App">
			</div>
		);
	}
};

export default App;
