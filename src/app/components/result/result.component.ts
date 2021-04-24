import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  @Input() estimate: number;
  @Input() isResultShown: boolean;
  changedResult: number;

  ngOnInit(): void {
    this.resetCoefficient();
  }

  showCoefficientEstimate(coefficient: number): void {
    this.changedResult = parseFloat((this.estimate * coefficient).toFixed(1));
  }

  resetCoefficient(): void {
    this.changedResult = this.estimate;
  }

}
