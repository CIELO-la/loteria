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
		const { carta, caller, playerId } = this.state;
		const tabla = caller !== null ? caller.tablas[playerId] : null;
		const anchura = Array(4).fill(null);

		return (
			<div className="App">
				{carta && carta.nombre
					? <div>el {carta.nombre}</div>
					: <div>¡Corre y se va!</div>
				}
				<table>
					<tbody>
						{tabla && anchura.map((_, i) => (
							<tr key={i}>
								{anchura.map((_, j) => (
									<td key={j}>
										<button
											onClick={() => console.log(`card ${anchura.length * i + j}`)}
										>
											{tabla[anchura.length * i + j][0].nombre}
										</button>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
};

export default App;
