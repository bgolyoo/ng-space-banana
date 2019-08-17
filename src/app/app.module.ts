import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SpaceComponent } from './space/space.component';
import { CoursesComponent } from './courses/courses.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, SpaceComponent, CoursesComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
