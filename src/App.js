import React from 'react';
import './App.css';
import Caller from './Game/Game';
import Tabla from './Components/Tabla';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			g: null,
			playerId: null,
			isHost: false,
			cartaCantada: {},
			marcadas: []
		};
	}

	componentDidMount() {
		!this.state.g && this.setState(
			{ g: new Caller('zapo-01') },
			() => this.setState(
				{ playerId: this.state.g.registrar() },
				() => {
					console.log(`soy el jugador número ${this.state.playerId}`)
					if (this.state.playerId === 0) {
						this.setState({ isHost: true });
						this.state.g.iniciar();
						setInterval(
							() => this.setState({ cartaCantada: this.state.g.cantar() }),
							4500
						);
					}
				}
			)
		);
	}

	marcar = slotId => {
		const marcada = this.state.g.marcar(this.state.playerId, slotId);
		if (marcada && !this.state.marcadas.includes(slotId)) {
			console.log(`marcando el eslot ${slotId}`);
			this.setState({ marcadas: [...this.state.marcadas, slotId] });
		}
	};

	render() {
		const { marcar } = this;
		const { g, cartaCantada, playerId, marcadas } = this.state;
		const tabla = g !== null ? g.tablas[playerId] : null;
		return (
			<div className="App">
				<div>
					{cartaCantada && cartaCantada.nombre
						? <div>el {cartaCantada.nombre}</div>
						: <div>¡Corre y se va!</div>
					}
				</div>
				<div>
					{tabla && (
						<Tabla
							g={g}
							playerId={playerId}
							tabla={tabla}
							dimension={4}
							marcar={marcar}
							marcadas={marcadas}
						/>
					)}
					<button onClick={() => g.verificar(playerId)}>¡¿pues gané?!</button>
				</div>
			</div>
		);
	}
};

export default App;
