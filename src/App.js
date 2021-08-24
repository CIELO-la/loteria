import React from 'react';
import './App.css';
import Caller from './Game/Game';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			caller: null,
			playerId: null,
			isHost: false,
			carta: {}
		};
	}

	componentDidMount() {
		!this.state.caller && this.setState(
			{ caller: new Caller('zapo-01') },
			() => this.setState(
				{ playerId: this.state.caller.registrar() },
				() => {
					console.log(`soy el jugador número ${this.state.playerId}`)
					if (this.state.playerId === 0) {
						this.setState({ isHost: true });
						this.state.caller.iniciar();
						setInterval(
							() => this.setState({ carta: this.state.caller.cantar() }),
							4500
						);
					}
				}
			)
		);
	}

	render() {
		const { carta } = this.state;
		return (
			<div className="App">
				{carta && carta.nombre
					? <div>el {carta.nombre}</div>
					: <div>¡Corre y se va!</div>
				}
			</div>
		);
	}
};

export default App;
