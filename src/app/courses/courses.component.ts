import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Observable, Subject, interval, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

enum Side {
  TOP = 0, RIGHT = 1, BOTTOM = 2, LEFT = 3
}

enum Direction {
  RIGHT, LEFT
}

export interface Course {
  id: string | number;
  style?: { [_: string]: string },
  travelStyle?: { [_: string]: string },
  spinStyle?: { [_: string]: string },
  destroy?: () => void;
  destroyInitiated?: boolean;
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, AfterViewInit, OnDestroy {

  ids: number[] = [];
  courses: { [id: number]: Course } = {};
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  get hostWidth(): number {
    return this.elRef.nativeElement.clientWidth;
  }

  get hostHeight(): number {
    return this.elRef.nativeElement.clientHeight;
  }

  constructor(private elRef: ElementRef, private chRef: ChangeDetectorRef) { }

  ngOnInit() {
    const numOfCourses = 1;
    new Array(numOfCourses).fill(null).map((_, index) => this.courses[index] = this.randomCourse(index));
    this.ids = new Array(numOfCourses).fill(null).map((_, index) => index);
    this.chRef.detectChanges();
    Object.keys(this.courses).forEach(key => this.courses[key].destroy());
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

  private createCourses(numOfCourses: number): Course[] {
    const courses = [];
    for (let i = 0; i < numOfCourses; i++) {
      courses.push(this.randomCourse(i));
    }
    console.log(courses);
    return courses;
  }

  private createCourseTimeParams(): { travelTime: number, spinTime: number } {
    return {
      travelTime: this.randomNumber(20, 5),
      spinTime: this.randomNumber(20, 5)
    }
  }

  private createCourseStyles(top: number, left: number, rotate: number, travelTime: number, travelDistance: number, travelDelay: number, spinTime: number, spinReverse: boolean, objectHeight: number): Partial<Course> {
    return {
      style: {
        top: `${top}px`,
        left: `${left}px`,
        transform: `rotate(${rotate}deg)`,
        width: `${travelDistance}px`,
        height: `${objectHeight}em`,
        'font-size': `${objectHeight}em`
      },
      travelStyle: {
        animation: `travel ${travelTime}s linear ${travelDelay}s infinite`
      },
      spinStyle: {
        animation: `spin ${spinTime}s linear infinite${spinReverse ? ' reverse' : ''}`
      }
    }
  }

  private destroyCourse(courseId: number) {
    this.courses[courseId] = this.randomCourse(courseId);
    this.chRef.detectChanges();
    this.courses[courseId].destroy();
  }

  private getTravelDistance(oppositeSide: number, degreeA: number) {
    const radius = (degree: number) => degree * Math.PI / 180;
    const hypotenuseSide = oppositeSide / Math.sin(radius(degreeA));
    const adjacentSide = Math.pow(hypotenuseSide, 2) - Math.pow(oppositeSide, 2);
  }

  private randomCourse(id: number): Course {
    const hostWidth = this.elRef.nativeElement.clientWidth;
    const hostHeight = this.elRef.nativeElement.clientHeight;
    const SIDES = [Side.TOP, Side.RIGHT, Side.BOTTOM, Side.LEFT];
    const side = this.randomArrayItem(SIDES);
    const opposite: (s: Side) => Side = (s: Side) => s === Side.TOP ? Side.BOTTOM : Side.BOTTOM ? Side.TOP : Side.RIGHT ? Side.LEFT : Side.LEFT ? Side.RIGHT : null;
    const otherSides = SIDES.splice(SIDES.findIndex((s: Side) => s === side), 1);
    if (opposite) {
      otherSides.push(...[opposite(side), opposite(side)]);
    }
    // const otherSide = this.randomArrayItem(SIDES.splice(SIDES.findIndex((s: Side) => s === side), 1));
    const otherSide = this.randomArrayItem(otherSides);

    // const side = this.randomArrayItem([Side.TOP]);
    // const otherSide = this.randomArrayItem([Side.BOTTOM]);
    const oppositeSide = (side === Side.TOP && otherSide === Side.BOTTOM) ||
      (side === Side.BOTTOM && otherSide === Side.TOP) ||
      (side === Side.LEFT && otherSide === Side.RIGHT) ||
      (side === Side.RIGHT && otherSide === Side.LEFT);
    return this.createCourse(id, side, otherSide, hostWidth, hostHeight, oppositeSide);
  }

  private createCourse(id: number, side: Side, otherSide: Side, sideLength: number, otherSideLength: number, oppositeSide?: boolean): Course {
    let triangle;
    let top, left, rotate, travelDistance;
    const { travelTime, spinTime } = this.createCourseTimeParams();
    const objectHeight = this.randomArrayItem([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8, 9]);
    const spinReverse = this.randomArrayItem([true, false]);
    const paddedSideLength = { min: sideLength / 100 * 20, max: sideLength - (sideLength / 100 * 20) };
    const paddedOtherSideLength = { min: otherSideLength / 100 * 20, max: otherSideLength - (otherSideLength / 100 * 20) };
    const travelDelay = this.randomNumber(5);

    const direction: Direction = oppositeSide ?
      this.randomArrayItem([Direction.RIGHT, Direction.LEFT])
      : side === Side.TOP && otherSide === Side.LEFT ? Direction.RIGHT
        : side === Side.TOP && otherSide === Side.RIGHT ? Direction.LEFT
          : side === Side.RIGHT && otherSide === Side.TOP ? Direction.RIGHT
            : side === Side.RIGHT && otherSide === Side.BOTTOM ? Direction.LEFT
              : side === Side.BOTTOM && otherSide === Side.RIGHT ? Direction.RIGHT
                : side === Side.BOTTOM && otherSide === Side.LEFT ? Direction.LEFT
                  : side === Side.LEFT && otherSide === Side.BOTTOM ? Direction.RIGHT
                    : side === Side.LEFT && otherSide === Side.TOP ? Direction.LEFT
                      : null;

    switch (side) {
      default:
      case Side.TOP:
        triangle = oppositeSide
          ? this.randomTriangle({ max: sideLength }, { min: otherSideLength, max: otherSideLength })
          : this.randomTriangle(paddedSideLength, paddedOtherSideLength);
        travelDistance = triangle.c;
        top = 0;
        if (direction === Direction.LEFT) {
          left = oppositeSide ? this.randomNumber(sideLength - triangle.a, 0) : sideLength - triangle.a;
          rotate = triangle.betaDegree;
        } else {
          left = oppositeSide ? this.randomNumber(sideLength, triangle.a) : triangle.a;
          rotate = 180 - triangle.betaDegree;
        }
        break;
      case Side.RIGHT:
        triangle = oppositeSide
          ? this.randomTriangle({ max: otherSideLength }, { min: sideLength, max: sideLength })
          : this.randomTriangle(paddedOtherSideLength, paddedSideLength);
        travelDistance = triangle.c;
        left = sideLength;
        if (direction === Direction.LEFT) {
          top = oppositeSide ? this.randomNumber(otherSideLength - triangle.a, 0) : otherSideLength - triangle.a;
          rotate = 90 + triangle.betaDegree;
        } else {
          top = oppositeSide ? this.randomNumber(otherSideLength, triangle.a) : triangle.a;
          rotate = 270 - triangle.betaDegree;
        }
        break;
      case Side.BOTTOM:
        triangle = oppositeSide
          ? this.randomTriangle({ max: sideLength }, { min: otherSideLength, max: otherSideLength })
          : this.randomTriangle(paddedSideLength, paddedOtherSideLength);
        travelDistance = triangle.c;
        top = otherSideLength;
        if (direction === Direction.LEFT) {
          left = oppositeSide ? this.randomNumber(sideLength, triangle.a) : triangle.a;
          rotate = 180 + triangle.betaDegree;
        } else {
          left = oppositeSide ? this.randomNumber(sideLength - triangle.a, 0) : sideLength - triangle.a;
          rotate = 360 - triangle.betaDegree;
        }
        break;
      case Side.LEFT:
        triangle = oppositeSide
          ? this.randomTriangle({ max: otherSideLength }, { min: sideLength, max: sideLength })
          : this.randomTriangle(paddedOtherSideLength, paddedSideLength);
        travelDistance = triangle.c;
        left = 0;
        if (direction === Direction.LEFT) {
          top = oppositeSide ? this.randomNumber(otherSideLength, triangle.a) : triangle.a;
          rotate = 270 + triangle.betaDegree;
        } else {
          top = oppositeSide ? this.randomNumber(otherSideLength - triangle.a, 0) : otherSideLength - triangle.a;
          rotate = 90 - triangle.betaDegree;
        }
        break;
    }
    return {
      id,
      destroy: () => {
        let timerSubscription = timer((travelTime + travelDelay) * 1000)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            this.destroyCourse(id);
            timerSubscription.unsubscribe();
            timerSubscription = undefined;
          })
      },
      ...this.createCourseStyles(top, left, rotate, travelTime, travelDistance, travelDelay, spinTime, spinReverse, objectHeight)
    };
  }

  private randomArrayItem(array: any[]): any {
    return array[this.randomNumber(array.length)];
  }

  private randomTriangle(aSide: { min?: number, max: number }, bSide: { min?: number, max: number }): { alphaDegree: number, betaDegree: number, a: number, b: number, c: number } {
    const degree = (radian: number) => radian * 180 / Math.PI;
    const a = aSide.min === aSide.max ? aSide.max : aSide.min ? this.randomNumber(aSide.max, aSide.min) : this.randomNumber(aSide.max);
    const b = bSide.min === bSide.max ? bSide.max : bSide.min ? this.randomNumber(bSide.max, bSide.min) : this.randomNumber(bSide.max);
    const alphaRadian = Math.atan(a / b);
    const alphaDegree = degree(alphaRadian);
    const betaDegree = 90 - alphaDegree;
    const c = a / Math.sin(alphaRadian);
    return { alphaDegree, betaDegree, a, b, c };
  }
}