import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-reporter-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './reporter-nav.html',
  styleUrl: './reporter-nav.css'
})
export class ReporterNavComponent {
}