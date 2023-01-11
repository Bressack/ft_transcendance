import { io } from "socket.io-client";
import { Cookies } from 'quasar'

class WsService {
	socket : any;
	token : string;
	constructor() {
		this.token = Cookies.get('WsAuth');
	}
	getToken() {
		return this.token || (this.token = Cookies.get('WsAuth'));
	}
	
	emit(eventType : string, payload: object) {
		this.socket.emit(eventType, {...payload, auth: { token: this.getToken() }});
	}

	listen(eventType : string, callback: Function) {
		this.socket.on(eventType, callback);
	}

	removeListener(eventType : string) {
		this.socket.removeAllListeners(eventType);
	}

	// should only be called once access token has been received after initial REST request
	connect() {
		if (!this.socket) {
			this.socket = io('ws://127.0.0.1:3000/api/ws', {auth: { token: this.getToken() }}).connect();
		}
		else this.socket.connect();
	    return this.setupDefaultListeners();
	}

	setupDefaultListeners(){
		this.listen('user-connected',  this.handleUserConnectedEvent)
		this.listen('user-disconnected', this.handleUserDisconnectedEvent)
	}

	disconnect() {
		if (this.socket) {
			this.socket.removeAllListeners();
			this.socket.disconnect();
			console.log("Socket disconnected"); // should invalidate certain routes and what not, like the chat and games
		}
	}

	handleUserConnectedEvent(username:string) {
		console.log(`${username} connected`); // should update an array of connected users
	}
	handleUserDisconnectedEvent(username:string) {
		console.log(`${username} disconnected`); // should update an array of connected users
	}

	// sendInvite(obj: any) {
	// 	this.emit('invite-to-game', obj);
	// }

}

export default WsService;