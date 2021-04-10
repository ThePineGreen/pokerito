import {Component, OnInit} from '@angular/core';
import {FibonacciCard} from '../../models/fibonacciCard.model';
import {ActivatedRoute} from '@angular/router';
import {Socket} from 'socket.io-client';
import {UserData} from '../../models/player.model';
import {SocketService} from '../../service/socket.service';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss']
})
export class PokerComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private socketService: SocketService) {
  }

  fibonacciNumbers: string[] = ['0', '1', '2', '3', '5', '13', '21', '34', '55', '89', '?'];
  users: Record<string, string>[];
  fibonacciCards: FibonacciCard[];
  isNotificationShowed = false;
  isNameExist = false;
  socket: Socket;
  roomId: string;

  private static generateFibonacciCards(numbers: string[]): FibonacciCard[] {
    return numbers.map(item => {
      return {value: item, isSelected: false};
    });
  }

  ngOnInit(): void {
    this.isNameExist = !!sessionStorage.getItem('name');
    this.roomId = this.route.snapshot.paramMap.get('id');
    this.socket = this.socketService.getSocket();
    this.socket.on('users', (users) => {
      users.forEach((user) => {
        user.self = user.userId === this.socket.id;
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
    this.socket.emit('connect-to-room', this.getPlayerData(this.roomId));
    this.fibonacciCards = PokerComponent.generateFibonacciCards(this.fibonacciNumbers);
  }

  getPlayerData(roomId: string): UserData {
    return {
      username: 'Tom',
      roomId,
    };
  }

  onCardClick(selectedCard: FibonacciCard): void {
    this.fibonacciCards.forEach(card => card.isSelected = false);
    this.fibonacciCards.find(value => value.value === selectedCard.value).isSelected = true;
    this.socket.emit('select-card', selectedCard);
  }

  onContinueClick(nameInput: HTMLInputElement): void {
    sessionStorage.setItem('name', nameInput.value);
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.isNameExist = true;
      this.isNotificationShowed = true;
    });
  }
}
