import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { WebsocketService } from './service/websocket.service';

export interface IMessage {
    id: number;
    text: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

WS = {
    ON: {
        MESSAGES: 'messages',
        COUNTER: 'counter',
        UPDATE_TEXTS: 'update-texts'
    },
    SEND: {
        SEND_TEXT: 'set-text',
        REMOVE_TEXT: 'remove-text'
    }
};

  public messages$: Observable<IMessage[]>;
  public counter$: Observable<number>;
  public texts$: Observable<string[]>;

  public form: FormGroup;

  constructor(private fb: FormBuilder, private wsService: WebsocketService) {
  }

  ngOnInit() {
      this.form = this.fb.group({
          text: [null, [
              Validators.required
          ]]
      });

      // get messages
      this.messages$ = this.wsService.on<IMessage[]>(this.WS.ON.MESSAGES);

      // get counter
      this.counter$ = this.wsService.on<number>(this.WS.ON.COUNTER);

      // get texts
      this.texts$ = this.wsService.on<string[]>(this.WS.ON.UPDATE_TEXTS);
  }

  public sendText(): void {
      if (this.form.valid) {
          this.wsService.send(this.WS.SEND.SEND_TEXT, this.form.value.text);
          this.form.reset();
      }
  }

  public removeText(index: number): void {
      this.wsService.send(this.WS.SEND.REMOVE_TEXT, index);
  }
}
