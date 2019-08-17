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

  $courses: BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>(this.createCourses(6));
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private elRef: ElementRef) { }

  ngOnInit() {
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
        travelDistance = hostHeight;
        rotate = this.randomNumber(160, 20);
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
        travelDistance = hostHeight;
        rotate = this.randomNumber(200, 340);
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
}