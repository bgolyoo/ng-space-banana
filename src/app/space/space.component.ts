import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { CONSTELLATIONS } from './constellations';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements AfterViewInit {

  stars = [];
  lines = [];
  private hostWidth;
  private hostHeight;

  constructor(private elRef: ElementRef) { }

  ngAfterViewInit() {
    this.hostWidth = this.elRef.nativeElement.clientWidth;
    this.hostHeight = this.elRef.nativeElement.clientHeight;
    this.createStars(200, 1);
    this.createStars(50, 2);
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
        style: {
          'background-color': style,
          'left': `${starLeft}px`,
          'top': `${starTop}px`,
          'width': `${starSize}px`,
          'height': `${starSize}px`
        }
      });
    }
  }

  createConstellations() {
    const hostHeight = this.elRef.nativeElement.clientHeight;
    const hostWidth = this.elRef.nativeElement.clientWidth;
    const radius = Math.sqrt(Math.pow(hostHeight, 2) + Math.pow(hostWidth, 2));
    const constellations: { constellations: any, minmax: any } = CONSTELLATIONS;

    const starLeft = (ra, raMin, raMax) => (ra / (ra > 0 ? Math.abs(raMax) : ra < 0 ? Math.abs(raMin) : 0) * (radius / 2)) + (hostWidth / 2);
    const starBottom = (dec, decMin, decMax) => (dec / (dec > 0 ? Math.abs(decMax) : dec < 0 ? Math.abs(decMin) : 0) * (radius / 2)) + (hostHeight / 2);
    const opacity = (mag, magMax) => mag / magMax;
    const size = (mag, magMax, sizeMax) => (opacity(mag, magMax) * sizeMax - 1) + 1;
    const bgStyle = (opacity) => `rgba(255,255,255,${opacity})`;

    const addStar = (star) => this.stars.push({
      style: {
        'background-color': star.bgStyle,
        'left': `${star.left}px`,
        'bottom': `${star.bottom}px`,
        'width': `${star.size}px`,
        'height': `${star.size}px`
      },
      label: star.label
    });
    const createStar = (ra, raMin, raMax, dec, decMin, decMax, mag, magMax, sizeMax, symbol) => ({
      left: starLeft(ra, raMin, raMax),
      bottom: starBottom(dec, decMin, decMax),
      bgStyle: bgStyle(opacity(mag, magMax)),
      size: size(mag, magMax, 4),
      label: symbol
    });

    constellations.constellations.forEach(constellation => {
      constellation.groups.forEach(group => {
        let lastStar;
        group.forEach((item, index) => {

          if (!group[index + 1]) {
            if (lastStar) {
              addStar(lastStar);
            }
            return;
          }

          const fromStar = lastStar ? lastStar : createStar(
            item.ra_north,
            constellations.minmax.ra_north_min,
            constellations.minmax.ra_north_max,
            item.dec_north,
            constellations.minmax.dec_north_min,
            constellations.minmax.dec_north_max,
            item.mag,
            constellations.minmax.mag_max,
            3,
            item.symbol
          );

          const toStar = createStar(
            group[index + 1].ra_north,
            constellations.minmax.ra_north_min,
            constellations.minmax.ra_north_max,
            group[index + 1].dec_north,
            constellations.minmax.dec_north_min,
            constellations.minmax.dec_north_max,
            group[index + 1].mag,
            constellations.minmax.mag_max,
            3,
            group[index + 1].symbol
          );

          const a = Math.max(fromStar.left, toStar.left) - Math.min(fromStar.left, toStar.left);
          const b = Math.max(fromStar.bottom, toStar.bottom) - Math.min(fromStar.bottom, toStar.bottom);

          const triangle = this.randomTriangle({ min: a, max: a }, { min: b, max: b });

          const rotate = fromStar.left < toStar.left
            ? fromStar.bottom < toStar.bottom
              ? triangle.betaDegree * -1
              : triangle.betaDegree
            : fromStar.bottom < toStar.bottom
              ? 180 + triangle.betaDegree
              : 180 - triangle.betaDegree;

          this.lines.push({
            bottom: `${fromStar.bottom}px`,
            left: `${fromStar.left}px`,
            transform: `rotate(${rotate}deg)`,
            width: `${triangle.c}px`
          });

          addStar(fromStar);
          lastStar = toStar;
        });
      });
    });
  }


  private randomTriangle(aSide: { min?: number, max: number }, bSide: { min?: number, max: number }): { alphaDegree: number, betaDegree: number, a: number, b: number, c: number } {
    const degree = (radian: number) => radian * 180 / Math.PI;
    const a = aSide.min === aSide.max ? aSide.max : aSide.min ? this.randomNumber(aSide.max, aSide.min) : this.randomNumber(aSide.max);
    const b = bSide.min === bSide.max ? bSide.max : bSide.min ? this.randomNumber(bSide.max, bSide.min) : this.randomNumber(bSide.max);
    const alphaRadian = Math.atan(a / b);
    const alphaDegree = degree(alphaRadian);
    const betaDegree = 90 - alphaDegree;
    const c = Math.abs(a / Math.sin(alphaRadian));
    return { alphaDegree, betaDegree, a, b, c };
  }

  private randomNumber(max: number, min = 0): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}