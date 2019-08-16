import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

enum Side {
  TOP = 0, RIGHT = 1, BOTTOM = 2, LEFT = 3
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  ngUnsubscribe: Subject<void> = new Subject<void>();
  courses = [
    {
      top: '0px', left: '0px',
    }
  ];

  constructor(private elRef: ElementRef) { }

  ngOnInit() {

    interval(2000)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((step) => {

        const hostWidth = this.elRef.nativeElement.clientWidth;
        const hostHeight = this.elRef.nativeElement.clientHeight;
        const course: any = {
          id: step,
        };

        const side = this.randomNumber(4);
        switch (side) {
          case Side.TOP:
            course.top = 0;
            course.left = this.randomNumber(hostWidth);
            course.rotate = this.randomNumber(360);
            course.travelSec = this.randomNumber(20, 5);
            course.travelDistance = hostHeight;
            course.spinSec = this.randomNumber(20, 5);
            break;
          case Side.RIGHT:
            course.top = this.randomNumber(hostHeight);
            course.left = hostWidth;
            course.rotate = this.randomNumber(360);
            course.travelSec = this.randomNumber(20, 5);
            course.travelDistance = hostWidth;
            course.spinSec = this.randomNumber(20, 5);
            break;
          case Side.BOTTOM:
            course.top = hostHeight;
            course.left = this.randomNumber(hostWidth);
            course.rotate = this.randomNumber(360);
            course.travelSec = this.randomNumber(20, 5);
            course.travelDistance = hostHeight;
            course.spinSec = this.randomNumber(20, 5);
            break;
          case Side.LEFT:
            course.top = this.randomNumber(hostHeight);
            course.left = 0;
            course.rotate = this.randomNumber(360);
            course.travelSec = this.randomNumber(20, 5);
            course.travelDistance = hostWidth;
            course.spinSec = this.randomNumber(20, 5);
            break;
          default:
            course.top = 0;
            course.left = 0;
            course.rotate = this.randomNumber(360);
            course.travelSec = this.randomNumber(20, 5);
            course.travelDistance = hostHeight;
            course.spinSec = this.randomNumber(20, 5);
            break;
        }
        console.log(course);
      });
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe = undefined;
  }

  private randomNumber(max: number, min = 0): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

}
