import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Material CRUD';
  hideBackNav = true;
  constructor(
    public router: Router,
  ) {}

  determineIfShouldHideBackNav() {
    const parsed = this.router.parseUrl(this.router.url);
    const primaryOutlet = parsed.root.children.primary;
    return (primaryOutlet.segments.length < 2);
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(navEndEvent => {
      this.hideBackNav = this.determineIfShouldHideBackNav();
    })
  }

}
