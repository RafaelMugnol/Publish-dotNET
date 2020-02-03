import React, { Component } from 'react';
import './App.css';
import api from './services/api'
import socket from 'socket.io-client';
import copy from 'copy-text-to-clipboard';

import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import WarningIcon from '@material-ui/icons/Warning';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import cyan from '@material-ui/core/colors/cyan';

import logo from './logo.png';

const theme = createMuiTheme({
	palette: {
		primary: blueGrey,
		secondary: cyan
	}
});

export default class App extends Component {
	state = {
		packs: [],
		waitingVersions: []
	};

	async componentDidMount() {
		this.subscribeToEvents();

		const response = await api.get('packs');

		let packs = response.data.packs;
		packs.forEach(element => {
			if (element.date)
				element.date = new Date(element.date);
		});

		packs.sort((a, b) => {
			if (a.version === "MAIN")
				return -1;
			if (b.version === "MAIN")
				return 1;

			// 2019.10.1
			const versionA = a.version.split('.');
			const versionB = b.version.split('.');

			// para deixar por último as versões com nomes diferentes
			if (versionA.length < 3)
				return 1;
			if (versionB.length < 3)
				return -1;

			for (let i = 0; i < 3; i++) {
				var comparer = this.compareValues(versionA[i], versionB[i]);

				if (comparer !== 0)
					return comparer;
			}

			return 0;
		});

		this.setState({ packs });

		if (!("Notification" in window)) {
			console.log('Esse browser não suporta notificações desktop');
		} else {
			if (Notification.permission !== 'denied') {
				// Pede ao usuário para utilizar a Notificação Desktop
				await Notification.requestPermission();
			}
		}
	};

	compareValues = (valueA, valueB) => {
		valueA = parseInt(valueA);
		valueB = parseInt(valueB);

		if (valueA < valueB)
			return 1;
		if (valueA > valueB)
			return -1;

		return 0;
	}

	subscribeToEvents = () => {
		const io = socket('http://merccxsws02:3333');

		io.on('updatePack', data => {
			data.date = new Date(data.date);
			this.setState({
				packs: this.state.packs.map(pack =>
					pack.id === data.id ? data : pack)
			})

			if (data.status === this.statusEnum.DISPONIVEL && this.state.waitingVersions.includes(data.version)) {
				this.spawnNotification("Publicação finalizada", "Finalizada a publicação da versão " + data.version + ".");

				let array = this.state.waitingVersions;
				const index = array.indexOf(data.version);

				if (index !== -1)
					array.splice(index, 1);

				this.setState({ waitingVersions: array })
			}
		});
	};

	refreshPack = (pack) => () => {
		this.spawnNotification("Publicação iniciada", "Iniciada a publicação da versão " + pack.version + ".");
		api.post('publish', { id: pack.id });

		let array = this.state.waitingVersions;
		array.push(pack.version)
		this.setState({ waitingVersions: array })
	}

	spawnNotification = async (title, body) => {
		if (!("Notification" in window)) {
			console.log('Esse browser não suporta notificações desktop');
		} else {
			if (Notification.permission !== 'granted') {
				await Notification.requestPermission(function (permission) {
					if (permission === "granted") {
						this.spawnNotificationConfirm(title, body);
					}
				});
			}
			else
				this.spawnNotificationConfirm(title, body);
		}
	}

	spawnNotificationConfirm = async (title, body) => {
		var n = new Notification(title, { body, icon: logo });

		setTimeout(n.close.bind(n), 5000);
	}

	updateStatus = (id, status) => {
		this.setState({
			packs: this.state.packs.map(el => (el.id === id ? { ...el, status } : el))
		});
	}

	formatDate = (date) => {
		return date.getDate().toString().padStart(2, '0') + "/" + (date.getMonth() + 1).toString().padStart(2, '0') + "/" + date.getFullYear() +
			" " + date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0');
	}

	statusEnum = {
		NAO_PUBLICADO: 0,
		FILA: 1,
		PROCESSANDO: 2,
		DISPONIVEL: 3,
		ERRO: 4,
		properties: {
			0: { text: "Não publicado", color: "#AAA" },
			1: { text: "Na fila", color: "#FF8C00" },
			2: { text: "Em processamento", color: "#4682B4" },
			3: { text: "Disponível", color: "#228B22" },
			4: { text: "Erro", color: "#E61919" }
		}
	};

	getStatusText = (status) => {
		return this.statusEnum.properties[status].text;
	}

	getStatusColor = (status) => {
		return this.statusEnum.properties[status].color;
	}

	copyToClipboard = (path) => () => {
		copy(path);
	}

	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<div className="App" id="main-container">
					<table className="table-packs" cellPadding="0" cellSpacing="0">
						<tr>
							<th></th>
							<th>Versão</th>
							<th style={{ width: "220px" }}>Situação</th>
							<th>Atualizado em</th>
							<th>Pasta</th>
						</tr>
						{this.state.packs.map(pack => (
							<tr>
								<td>
									<Tooltip title="Atualizar" placement="left">
										<IconButton disabled={[this.statusEnum.FILA, this.statusEnum.PROCESSANDO].includes(pack.status)} color="primary" onClick={this.refreshPack(pack)}>
											<RefreshIcon />
										</IconButton>
									</Tooltip>
								</td>
								<td>{pack.version}</td>
								<td style={{ color: this.getStatusColor(pack.status) }}>
									<table className="table-status" cellPadding="0" cellSpacing="0">
										<tr>
											<td width="100%">{this.getStatusText(pack.status)}</td>
											<td style={{ color: "#FFBF00", paddingTop: "5px" }}>
												{pack.status === this.statusEnum.ERRO &&
													<Tooltip title={pack.errorMessage} placement="top"><WarningIcon /></Tooltip>}
											</td>
										</tr>
									</table>
								</td>
								<td>{pack.date ? this.formatDate(pack.date) : "-"}</td>
								<td>
									<Tooltip title="Copiar" placement="right">
										<Button onClick={this.copyToClipboard(pack.path)}
											fullWidth color="primary" disableRipple
											style={{ textTransform: 'none', color: "#FFF", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "18px" }}>
											{pack.path}
										</Button>
									</Tooltip>
								</td>
							</tr>
						))}
					</table>
				</div>
			</MuiThemeProvider>
		);
	}
}