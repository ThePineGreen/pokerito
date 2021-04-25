import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {SocketService} from '../../service/socket.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  isVisible = false;
  formGroup: FormGroup;

  @Input() user: Record<string, any>;
  @Input() visible = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();

  constructor(private socketService: SocketService) {
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      nameInput: new FormControl(null, null),
    });

    this.formGroup.get('nameInput').setValue(this.user?.username);
  }

  onChangeVisibility(value: boolean): void {
    this.isVisible = value;
    this.visibleChange.emit(value);
  }

  onChangeNameClick(): void {
    this.onChangeVisibility(false);
    this.socketService.getSocket().emit('update-user', {
      ...this.user,
      username: this.formGroup.get('nameInput').value,
    });
  }

}
