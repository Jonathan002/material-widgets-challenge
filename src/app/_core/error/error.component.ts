import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  @Input() message = `There was a problem trying to get the product you requested for.`;
  @Input() disableTryAgain = false;
  @Output() tryAgain = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

}
