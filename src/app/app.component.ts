import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Firmadorv1Component } from "./firmadorv1/firmadorv1.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Firmadorv1Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'firmadorconpdfviewer';
}
