import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  centered = true;

  constructor() { }

  ngOnInit() {
    timer(3000).subscribe(() => this.centered = false);
  }

}