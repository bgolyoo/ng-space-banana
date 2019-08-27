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
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  get hostWidth(): number {
    console.log(this.elRef.nativeElement.clientWidth);
    return this.elRef.nativeElement.clientWidth;
  }

  get hostHeight(): number {
    console.log(this.elRef.nativeElement.clientHeight);
    return this.elRef.nativeElement.clientHeight;
  }

  constructor(private elRef: ElementRef, private chRef: ChangeDetectorRef) { }

  ngOnInit() {
    const numOfCourses = 10;
    this.ids = new Array(numOfCourses).fill(null).map((_, index) => index);
    this.chRef.detectChanges();
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe = undefined;
  }
}