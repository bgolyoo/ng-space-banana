import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements AfterViewInit {

  stars = [];

  constructor(private elRef: ElementRef) { }

  ngAfterViewInit() {
    this.createStars(200, 1);
    this.createStars(50, 2);
    this.createStars(5, 3);
  }

  createStars(starNumber: number, starSize: number) {
    const hostWidth = this.elRef.nativeElement.clientWidth;
    const hostHeight = this.elRef.nativeElement.clientHeight;
    for (var i = 0; i < starNumber; i++) {
      var starLeft = Math.floor(Math.random() * hostWidth) + 1;
      var starTop = Math.floor(Math.random() * hostHeight) + 1;
      const colorVal01 = Math.floor(Math.random() * 106) + 150;
      const colorVal02 = Math.floor(Math.random() * 106) + 150;
      const opacityVal = (Math.floor(Math.random() * 11)) / 10;
      const style = `rgba(${colorVal01},${colorVal02},255,${opacityVal})`;
      this.stars.push({
        'background-color': style,
        'left': `${starLeft}px`,
        'top': `${starTop}px`,
        'width': `${starSize}px`,
        'height': `${starSize}px`,
      });
    }
  }

}