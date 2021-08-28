import React from 'react';
import './App.css';
import Caller from './Game/Game';
import Tabla from './Components/Tabla';

class App extends React.Component {
	constructor(props) {
		super(props);

		const g = new Caller('zapo-01');
		const playerId = g.registrar();
		const isHost = playerId === 0;
		console.log(`soy el jugador número ${playerId}`);

		this.state = {
			g,
			playerId,
			isHost,
			cartaCantada: {},
			marcadas: []
		};
	}

	componentDidMount() {
		if(this.timer !== undefined || !this.state.isHost) {
			return;
		}

		this.state.g.iniciar();
		this.timer = setInterval(
			() => this.setState(({g}) => ({ cartaCantada: g.cantar() })),
			4500
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
