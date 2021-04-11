import {io, Socket} from 'socket.io-client';
import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';

@Injectable()
export class SocketService {

  socket: Socket;

  connectToSocket(): Socket {
    this.socket = io(environment.socket,
      {
        autoConnect: false
      }
    );
    this.socket.onAny((event, ...args) => {
      console.log(event, args);
    });
    return this.socket;
  }

  getSocket(): Socket {
    return this.socket;
  }
}
