import {Component, OnInit} from '@angular/core';
import {PokerCard} from '../../models/PokerCard.model';
import {ActivatedRoute} from '@angular/router';
import {Socket} from 'socket.io-client';
import {SocketService} from '../../service/socket.service';
import {SelectCardEvent} from '../../models/event.model';
import {transition, trigger, useAnimation} from '@angular/animations';
import {slideInAnimation, slideInCards, slideOutAnimation, slideOutCards} from '../../slide.animation';

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
    animations: [
        trigger('groupTickets', [
            transition(':enter', [useAnimation(slideInAnimation)]),
            transition(':leave', [useAnimation(slideOutAnimation)]),
        ]),
        trigger('hideCards', [
            transition(':enter', [useAnimation(slideInCards)]),
            transition(':leave', [useAnimation(slideOutCards)])
        ])
    ],
})
export class RoomComponent implements OnInit {

    constructor(private route: ActivatedRoute,
                private socketService: SocketService) {
    }

    cardNumbers: string[] = ['0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?'];
    users: Record<string, any>[];
    isNotificationShowed = false;
    result: Record<string, any>;
    coefficientEstimate: number;
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

    private static copyUrlToClipboard(): void {
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
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

        this.socket.on('user-select-card', (selectedCard: SelectCardEvent) => {
            for (const user of this.users) {
                if (user.userId === selectedCard.from) {
                    user.card = selectedCard;
                    console.dir(user.card);
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
            this.coefficientEstimate = null;
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
                    RoomComponent.copyUrlToClipboard();
                    this.isNameExist = true;

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
        const placeholderNames: string[] = [
            'Han Solo',
            'Obi-Wan Kenobi',
            'Count Dooku',
            'R2-D2',
            'C-3PO',
            'Luke Skywalker',
        ];
        const name = nameInput.value ? nameInput.value : placeholderNames[Math.floor(Math.random() * 6)];
        sessionStorage.setItem('name', name);
        this.isNotificationShowed = true;
        this.connectToSocket(name);
    }

    onResultsButtonClick(): void {
        this.socket.emit('show-results');
    }

    onResetRoomClick(): void {
        this.socket.emit('reset-room');
    }
}
