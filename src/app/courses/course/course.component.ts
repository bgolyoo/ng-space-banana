import { Component, OnInit, Input } from '@angular/core';
import { Course } from './course.interface';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  @Input() course: Course;

  constructor() { }

  ngOnInit() {
  }

}