import { transition, trigger, useAnimation } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Ably, { Realtime, Types } from 'ably';
import { RoomService } from 'src/app/service/room.service';
import { SupabaseService } from 'src/app/service/supabase.service';
import { RoomsQuery } from 'src/app/store/rooms.query';
import { UserQuery } from 'src/app/store/user.query';
import { environment } from 'src/environments/environment';
import cards from '../../../assets/cards.json';
import { PokerCard } from '../../models/PokerCard.model';
import { NavbarService } from '../../service/navbar.service';
import { slideInCards, slideOutCards } from '../../slide.animation';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  animations: [
    trigger('groupTickets', [
      transition(':enter', [useAnimation(slideInCards)]),
      transition(':leave', [useAnimation(slideOutCards)]),
    ]),
    trigger('hideCards', [
      transition(':enter', [useAnimation(slideInCards)]),
      transition(':leave', [useAnimation(slideOutCards)])
    ])
  ],
})
export class RoomComponent implements OnInit {
  private realtime: Realtime;
  private channel: Types.RealtimeChannelCallbacks;
  private cardNumbers: PokerCard[] = cards.default;

  public roomId: string;
  public isResultShown: boolean = false;
  public users: Record<string, any>[] = [];
  public cardDeck: PokerCard[];
  public result: Record<string, any>;
  public isTextLabels: boolean = false;
  public isOwner: boolean;
  // users$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  // ablyUsers: Observable<any[]>;
  // newUsers: any;

  constructor(private route: ActivatedRoute,
    private navbarService: NavbarService,
    private userQuery: UserQuery,
    private roomsQuery: RoomsQuery,
    private roomService: RoomService,
    private cdr: ChangeDetectorRef,
    private supabase: SupabaseService) {
  }

  // isNotificationShowed: boolean;
  // coefficientEstimate: number;

  async ngOnInit(): Promise<void> {
    this.realtime = new Ably.Realtime({
      key: environment.ablyKey,
      clientId: this.supabase.user.id,
      closeOnUnload: true,
    });

    this.roomId = this.route.snapshot.paramMap.get('id');
    this.channel = this.realtime.channels.get(this.roomId);
    this.cardDeck = this.cardNumbers;

    //TODO: refactor!!!
    this.roomService.getRoomsByUser().then(() => {
      this.isOwner = !!this.roomsQuery.getAll().find(room => room.id === this.roomId);
    })

    this.initSubscriptions();

    await this.supabase.getTable('cards').on('*', (payload) => {
      if (payload.eventType === 'DELETE') {
        const oldItem = payload.old;
        this.users.find(user => user.id === oldItem.user_id).card = null;
      } else if (payload.eventType === 'INSERT') {
        const newItem = payload.new;
        let user = this.users.find(user => user.id === newItem.user_id)
        user.card = this.getCardByValue(newItem.value);
        user.isCardSelected = true;
      } else if (payload.eventType === 'UPDATE') {
        const updatedItem = payload.new;
        let user = this.users.find(user => user.id === updatedItem.user_id)
        user.card = this.getCardByValue(updatedItem.value);
        user.isCardSelected = true;
      }
    }).subscribe();
  }

  private initSubscriptions(): void {
    this.channel.presence.subscribe((presenceMsg) => {
      this.channel.presence.get(async (err, members) => {
        await this.convertMembersToUsers(members).then((data) => {
          const sortedData = this.sortUsers(data);
          this.users = [...sortedData];
        });
        await this.loadCardsFromDB();
        this.cdr.detectChanges();
      })
    });

    this.channel.subscribe((message) => {
      console.dir(message);
      switch (message.name) {
        case 'show-results': {
          this.isResultShown = true;
          this.result = message.data;
          this.cdr.detectChanges();
          break;
        }
        case 'reset-room': {
          this.isResultShown = false;
          // this.coefficientEstimate = null;
          this.result = null;
          this.cardDeck.forEach(card => card.isSelected = false);

          this.cdr.detectChanges();
          break;
        }
      }
    });

    // TODO: get data for user from userQuery
    const data = {
      // name: 'Alex',
      id: this.supabase.user.id,
      card: null,
    };

    this.channel.presence.enter(data);

  }

  // TODO: types
  private async convertMembersToUsers(members: Types.PresenceMessage[]): Promise<{ name: any; }[]> {
    // TODO: get data from UserQuery
    const result: any[] = await Promise.all(members.map(async (member: Types.PresenceMessage) => {
      const userData = await this.supabase.getTable('users').select('name').eq('id', member.clientId);
      return {
        ...member.data,
        name: member.data.name || userData?.data?.[0]?.name || 'Anonymous user',
        self: member.clientId === this.supabase.user.id,
      };
    }));
    return result;
  }

  // TODO: types
  private sortUsers(users: any[]): any[] {
    return users.sort((a, b) => {
      if (a.self) {
        return -1;
      }
      if (b.self) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return a.name > b.name ? 1 : 0;
    });
  }

  private selectCardInHand(selectedCard: PokerCard): void {
    this.cardDeck.forEach(card => card.isSelected = false);
    this.cardDeck.find(value => value.value === selectedCard.value).isSelected = true;
  }

  private getCardByValue(value: string): PokerCard {
    return this.cardDeck.find((card: PokerCard) => card.value === value);
  }

  // TODO: types!!!
  private async loadCardsFromDB() {
    await this.supabase.getTable('cards').select().eq('room_id', this.roomId).then(data => {
      let cards = data.data;
      cards.forEach(card => {
        let user = this.users.find(user => user.id === card.user_id);
        user.card = {
          value: card.value,
        }
      });
    });
  }

  public async onCardClick(selectedCard: PokerCard): Promise<void> {
    this.selectCardInHand(selectedCard);
    await this.supabase.getTable('cards').upsert({
      user_id: this.supabase.user.id,
      room_id: this.roomId,
      value: selectedCard.value,
    });
  }

  public onResultsButtonClick(): void {
    let result: number = 0;
    let questionMarkCount: number = 0;
    this.users.forEach(user => {
      if (user.card) {
        let cardValue = user.card.value;
        let value = cardValue && parseFloat(cardValue) ? parseFloat(cardValue) : 0;
        result += value;
        if (!(user?.card) || user.card.value === '?') {
          questionMarkCount++;
        }
      }
    });
    this.channel.publish('show-results', {
      resultSumm: parseFloat((result / (this.users.length - questionMarkCount)).toFixed(1)),
    });
  }

  public async onResetRoomClick(): Promise<void> {
    this.channel.publish('reset-room', null);
    await this.supabase.getTable('cards').delete().match({ room_id: this.roomId });
  }
}
