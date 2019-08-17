import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { BehaviorSubject, Subject, interval, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

enum Side {
  TOP = 0, RIGHT = 1, BOTTOM = 2, LEFT = 3
}

interface Course {
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

  course: Course = {
    id: 'custom',
    style: {
      top: `${0}px`,
      left: `${100}px`,
      transform: `rotate(${60}deg)`,
      width: `${400}px`,
      height: `${100}px`
    },
    travelStyle: {
      animation: `travel ${5}s linear infinite`
    },
    spinStyle: {
      animation: `spin ${5}s linear infinite reverse`
    }
  };
  $courses: BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>(this.createCourses(6));
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private elRef: ElementRef) { }

  ngOnInit() {
    // this.watchCourses();
    this.randomCourse();
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe = undefined;
  }

  private watchCourses() {
    this.$courses.asObservable().subscribe((courses: Course[]) => {
      courses.forEach((c: Course) => {
        if (!c.destroyInitiated) {
          c.destroy();
          c.destroyInitiated = true;
        }
      });

      if (courses.length < 6) {
        const numOfCourses = 6 - courses.length;
        this.$courses.next([...courses, ...this.createCourses(numOfCourses)]);
      }
    });
  }

  private randomNumber(max: number, min = 0): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private createCourses(numOfCourses: number): Course[] {
    const courses = [];
    for (let i = 0; i < numOfCourses; i++) {
      courses.push(this.createCourse(`${new Date().toISOString()}_${i}`));
    }
    return courses;
  }

  private createCourse(id: string | number): Course {
    const hostWidth = this.elRef.nativeElement.clientWidth;
    const hostHeight = this.elRef.nativeElement.clientHeight;

    const side = this.randomNumber(4);
    let top, left, rotate, travelDistance;
    const { travelTime, spinTime } = this.createCourseTimeParams();
    switch (side) {
      default:
      case Side.TOP:
        top = 0;
        left = this.randomNumber(hostWidth);
        rotate = this.randomNumber(160, 20);
        travelDistance = hostHeight / Math.sin(rotate * Math.PI / 180);
        break;
      case Side.RIGHT:
        top = this.randomNumber(hostHeight);
        left = hostWidth;
        travelDistance = hostWidth;
        rotate = this.randomNumber(340, 110);
        break;
      case Side.BOTTOM:
        top = hostHeight;
        left = this.randomNumber(hostWidth);
        rotate = this.randomNumber(200, 340);
        travelDistance = hostHeight / Math.sin(rotate * Math.PI / 180);
        break;
      case Side.LEFT:
        top = this.randomNumber(hostHeight);
        left = 0;
        travelDistance = hostWidth;
        rotate = this.randomNumber(-70, 70);
        break;
    }
    return {
      id,
      destroy: () => timer(travelTime * 1000)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => this.destroyCourse(id)),
      ...this.createCourseStyles(top, left, rotate, travelTime, spinTime)
    };
  }

  private createCourseTimeParams(): { travelTime: number, spinTime: number } {
    return {
      travelTime: this.randomNumber(20, 5),
      spinTime: this.randomNumber(20, 5)
    }
  }

  private createCourseStyles(top: number, left: number, rotate: number, travelTime: number, spinTime: number): Partial<Course> {
    return {
      style: {
        top: `${top}px`,
        left: `${left}px`,
        transform: `rotate(${rotate}deg)`
      },
      travelStyle: {
        animation: `travel ${travelTime}s forwards`
      },
      spinStyle: {
        animation: `spin ${spinTime}s forwards`
      }
    }
  }

  private destroyCourse(courseId: string | number) {
    const courses = this.$courses.getValue();
    courses.splice(courses.findIndex((c: Course) => c.id === courseId), 1);
    this.$courses.next(courses);
  }

  private getTravelDistance(oppositeSide: number, degreeA: number) {
    const radius = (degree: number) => degree * Math.PI / 180;
    const hypotenuseSide = oppositeSide / Math.sin(radius(degreeA));
    const adjacentSide = Math.pow(hypotenuseSide, 2) - Math.pow(oppositeSide, 2);
  }

  private randomCourse() {
    const hostWidth = this.elRef.nativeElement.clientWidth;
    const hostHeight = this.elRef.nativeElement.clientHeight;
    const SIDES = [Side.TOP, Side.RIGHT, Side.BOTTOM, Side.LEFT];
    // const side = this.randomArrayItem(SIDES);
    // const otherSide = this.randomArrayItem(SIDES.splice(SIDES.findIndex((s: Side) => s === side), 1));
    const side = this.randomArrayItem([Side.TOP]);
    const otherSide = this.randomArrayItem([Side.RIGHT]);
    if (
      (side === Side.TOP && otherSide === Side.BOTTOM) ||
      (side === Side.BOTTOM && otherSide === Side.TOP) ||
      (side === Side.LEFT && otherSide === Side.RIGHT) ||
      (side === Side.RIGHT && otherSide === Side.LEFT)
    ) {
      if (
        (side === Side.TOP && otherSide === Side.BOTTOM) ||
        (side === Side.BOTTOM && otherSide === Side.TOP)
      ) {
        this.oppositeSideCourse(hostWidth, hostHeight);
      } else {
        this.oppositeSideCourse(hostHeight, hostWidth);
      }
    } else {
      this.adjasentSideCourse(hostWidth, hostHeight);
    }
  }

  private randomArrayItem(array: any[]): any {
    return array[this.randomNumber(array.length)];
  }

  private adjasentSideCourse(aMax: number, bMax: number) {
    const triangle = this.randomTriangle({ max: aMax }, { max: bMax });
console.log(triangle);
    return;
  }

  private oppositeSideCourse(aMax: number, bMax: number) {
    return this.randomTriangle({ max: aMax }, { min: bMax, max: bMax });
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