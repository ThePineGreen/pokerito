import {Component, OnInit} from '@angular/core';
import {PokerCard} from '../../models/PokerCard.model';
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

  cardNumbers: string[] = ['0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?'];
  users: Record<string, string>[];
  isNotificationShowed = false;
  result: Record<string, any>;
  cardDeck: PokerCard[];
  isResultShown = false;
  isNameExist = false;
  sessionId: string;
  isOwner: boolean;
  userId: string;
  socket: Socket;
  roomId: string;

  private static generateCardDeck(numbers: string[]): PokerCard[] {
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
    this.cardDeck = RoomComponent.generateCardDeck(this.cardNumbers);

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

    this.socket.on('reset-room', () => {
      this.isResultShown = false;
      this.result = null;
      this.cardDeck.forEach(card => card.isSelected = false);
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
        if (user.self) {
          this.isOwner = user.owner;
          navigator.clipboard.writeText(window.location.href).then(() => {
            this.isNameExist = true;
            this.isNotificationShowed = true;
          });

          if (user.card) {
            this.selectCardInHand({value: user.card.value, isSelected: true});
          }
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

  onCardClick(selectedCard: PokerCard): void {
    this.selectCardInHand(selectedCard);
    this.socket.emit('user-select-card', selectedCard.value);
  }

  private selectCardInHand(selectedCard: PokerCard): void {
    this.cardDeck.forEach(card => card.isSelected = false);
    this.cardDeck.find(value => value.value === selectedCard.value).isSelected = true;
  }

  onContinueClick(nameInput: HTMLInputElement): void {
    sessionStorage.setItem('name', nameInput.value);
    this.connectToSocket(nameInput.value);
  }

  onResultsButtonClick(): void {
    this.socket.emit('show-results');
  }

  onResetRoomClick(): void {
    this.socket.emit('reset-room');
  }
}
