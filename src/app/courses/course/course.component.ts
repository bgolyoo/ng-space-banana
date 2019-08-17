import { Component, OnInit, Input } from '@angular/core';

interface Course {
  id: string | number;
  style?: { [_: string]: string },
  travelStyle?: { [_: string]: string },
  spinStyle?: { [_: string]: string },
  destroy?: () => void;
  destroyInitiated?: boolean;
}

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