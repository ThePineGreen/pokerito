import {Component, OnInit} from '@angular/core';
import {FibonacciCard} from '../../models/FibonacciCard.model';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss']
})
export class PokerComponent implements OnInit {

  constructor() {
  }

  players: Record<string, string>[];
  fibonacciCards: FibonacciCard[] = [
    {
      value: '0',
      isSelected: false,
    },
    {
      value: '1',
      isSelected: false,
    },
    {
      value: '2',
      isSelected: false,
    },
    {
      value: '3',
      isSelected: false,
    },
    {
      value: '5',
      isSelected: false,
    },
    {
      value: '13',
      isSelected: false,
    },
    {
      value: '21',
      isSelected: false,
    },
    {
      value: '34',
      isSelected: false,
    },
    {
      value: '55',
      isSelected: false,
    },
    {
      value: '89',
      isSelected: false,
    },
    {
      value: '?',
      isSelected: false,
    },
  ];

  ngOnInit(): void {
    this.players = [
      {
        name: 'Tom',
        card: '5',
      },
      {
        name: 'Jack',
        card: '8',
      }
    ];
  }

  onCardClick(selectedCard: FibonacciCard): void {
    this.fibonacciCards.forEach(card => card.isSelected = false);
    this.fibonacciCards.find(value => value.value === selectedCard.value).isSelected = true;
  }
}
