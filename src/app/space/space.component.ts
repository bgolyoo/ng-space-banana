import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { CONSTELLATIONS } from './constellations';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements AfterViewInit {

  stars = [];

  constructor(private elRef: ElementRef) { }

  ngAfterViewInit() {
    // this.createStars(200, 1);
    // this.createStars(50, 2);
    // this.createStars(5, 3);
    this.createConstellations();
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

  createConstellations() {
    const hostHeight = this.elRef.nativeElement.clientHeight;
    const hostWidth = this.elRef.nativeElement.clientWidth;
    const radius = Math.sqrt(Math.pow(hostHeight,2) + Math.pow(hostWidth,2));
    console.log(hostHeight,hostWidth,radius);
    const constellations: { constellations: any, minmax: any } = CONSTELLATIONS;
    constellations.constellations.forEach(constellation => {
      constellation.groups.forEach(group => {
        group.forEach(item => {
          const starLeft = (item.ra_north / (item.ra_north > 0 ? Math.abs(constellations.minmax.ra_north_max) : item.ra_north < 0 ? Math.abs(constellations.minmax.ra_north_min) : 0) * (radius / 2)) + (hostWidth / 2);
          const starBottom = (item.dec_north / (item.dec_north > 0 ? Math.abs(constellations.minmax.dec_north_min) : item.dec_north < 0 ? Math.abs(constellations.minmax.dec_north_max) : 0) * (radius / 2)) + (hostHeight / 2);
          const opacityVal = item.mag / constellations.minmax.mag_max;
          const style = `rgba(255,255,255,${opacityVal})`;
          this.stars.push({
            'background-color': style,
            'left': `${starLeft}px`,
            'bottom': `${starBottom}px`,
            'width': `${item.mag / constellations.minmax.mag_max * 3}px`,
            'height': `${item.mag / constellations.minmax.mag_max * 3}px`,
          });
        });
      });
    });
  }

}