import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnChanges {

  isVisible = false;
  formGroup: FormGroup;
  user: User;

  @Input() visible = false;
  @Input() roomId: string;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      nameInput: new FormControl(null, null),
      cardLabels: new FormControl(1, null),
    });
  }

  onChangeVisibility(value: boolean): void {
    this.isVisible = value;
    this.visibleChange.emit(value);
  }

  onSaveClick(): void {
    this.updateUser();
    this.onChangeVisibility(false);
  }

  updateUser(): void {
    // this.socketService.getSocket().emit('update-user', {
    //   username: this.formGroup.get('nameInput').value,
    //   cardLabels: Number.parseInt(this.formGroup.get('cardLabels').value, 10),
    // });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible.currentValue) {
      this.formGroup?.get('nameInput').setValue(sessionStorage.getItem('name'));
    }
  }

}
