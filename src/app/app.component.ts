import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  boxes = ['box 1', 'box 2'];

  addBox() {
    this.boxes.push(`box ${this.boxes.length + 1}`);
  }
}
