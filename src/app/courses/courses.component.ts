import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses: number[] = [];

  get hostWidth(): number {
    return this.elRef.nativeElement.clientWidth;
  }

  get hostHeight(): number {
    return this.elRef.nativeElement.clientHeight;
  }

  constructor(private elRef: ElementRef) { }

  ngOnInit() {
    const numOfCourses = 10;
    this.courses = new Array(numOfCourses).fill(null);
  }
}