import {Component, OnInit} from '@angular/core';
import {FibonacciCard} from '../../models/fibonacciCard.model';
import {ActivatedRoute} from '@angular/router';
import {Socket} from 'socket.io-client';
import {SocketService} from '../../service/socket.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private socketService: SocketService) {
  }

  fibonacciNumbers: string[] = ['0', '1', '2', '3', '5', '13', '21', '34', '55', '89', '?'];
  users: Record<string, string>[];
  fibonacciCards: FibonacciCard[];
  isNotificationShowed = false;
  result: Record<string, any>;
  isResultShown = false;
  isNameExist = false;
  sessionId: string;
  userId: string;
  socket: Socket;
  roomId: string;

  private static generateFibonacciCards(numbers: string[]): FibonacciCard[] {
    return numbers.map(item => {
      return {value: item, isSelected: false};
    });
  }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('id');
    this.socket = this.socketService.connectToSocket();
    this.isNameExist = !!sessionStorage.getItem('name');
    this.sessionId = sessionStorage.getItem('sessionId');
    this.userId = sessionStorage.getItem('userId');
    this.fibonacciCards = RoomComponent.generateFibonacciCards(this.fibonacciNumbers);

    this.socket.on('session', ({sessionId, userId}) => {
      this.socket.auth = {sessionId};
      this.userId = userId;
      this.sessionId = sessionId;
      sessionStorage.setItem('sessionId', sessionId);
      sessionStorage.setItem('userId', userId);
    });
    if (this.sessionId) {
      this.socket.auth = {sessionId: this.sessionId};
      this.socket.connect();
      this.subscribeToUsers();
    }

    this.socket.on('user-select-card', ({value, from}) => {
      for (const user of this.users) {
        if (user.userId === from) {
          user.card = value;
          user.isCardSelected = 'true';
          break;
        }
      }
    });

    this.socket.on('show-results', result => {
      this.isResultShown = true;
      this.result = result;
    });
  }

  private connectToSocket(name: string): void {
    this.socket.auth = {
      username: name,
      roomId: this.roomId
    };
    this.socket.connect();
    this.subscribeToUsers();
  }

  private subscribeToUsers(): void {
    this.socket.on('users', (users) => {
      users.forEach((user) => {
        user.self = user.userId === this.userId;
        if (user.self && user.card) {
          this.selectCardInHand({value: user.card.value, isSelected: true});
        }
      });

      this.users = users.sort((a, b) => {
        if (a.self) {
          return -1;
        }
        if (b.self) {
          return 1;
        }
        if (a.username < b.username) {
          return -1;
        }
        return a.username > b.username ? 1 : 0;
      });
    });
  }

  onCardClick(selectedCard: FibonacciCard): void {
    this.selectCardInHand(selectedCard);
    this.socket.emit('user-select-card', selectedCard.value);
  }

  private selectCardInHand(selectedCard: FibonacciCard): void {
    this.fibonacciCards.forEach(card => card.isSelected = false);
    this.fibonacciCards.find(value => value.value === selectedCard.value).isSelected = true;
  }

  onContinueClick(nameInput: HTMLInputElement): void {
    sessionStorage.setItem('name', nameInput.value);
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.connectToSocket(nameInput.value);
      this.isNameExist = true;
      this.isNotificationShowed = true;
    });
  }

  onResultsButtonClick(): void {
    this.socket.emit('show-results');
  }
}
