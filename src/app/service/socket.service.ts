import {io, Socket} from 'socket.io-client';
import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';

@Injectable()
export class SocketService {

  /** @internal */
  private socket: Socket;

  connectToSocket(): void {
    this.socket = io(environment.socket,
      {
        autoConnect: false
      }
    );
    this.socket.open();
    this.socket.onAny((event, ...args) => {
      console.log(event, args);
    });
  }

  getSocket(): Socket {
    return this.socket;
  }

  subscribeTo(event: string, func: (args: any) => void): void {
    this.socket.on(event, func);
  }

  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }
}
