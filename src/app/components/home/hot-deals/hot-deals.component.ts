import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-hot-deals',
  templateUrl: './hot-deals.component.html',
  styleUrls: ['./hot-deals.component.css'],
})
export class HotDealsComponent implements OnInit {
  @Output() setNav: EventEmitter<string> = new EventEmitter<string>();

  private subscription: Subscription;

  public toDay = moment(new Date());
  public fromDay = moment(new Date()).add(2, 'd');

  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;

  public duration;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;

  private getTimeDifference() {
    this.duration = moment.duration(this.fromDay.diff(moment(new Date())));

    this.allocateTimeUnits(this.duration);
  }

  private allocateTimeUnits(duration) {
    this.secondsToDday = Math.floor(
      (duration / this.milliSecondsInASecond) % this.SecondsInAMinute
    );
    this.minutesToDday = Math.floor(
      (duration / (this.milliSecondsInASecond * this.minutesInAnHour)) %
        this.SecondsInAMinute
    );
    this.hoursToDday = Math.floor(
      (duration /
        (this.milliSecondsInASecond *
          this.minutesInAnHour *
          this.SecondsInAMinute)) %
        this.hoursInADay
    );
    this.daysToDday = Math.floor(
      duration /
        (this.milliSecondsInASecond *
          this.minutesInAnHour *
          this.SecondsInAMinute *
          this.hoursInADay)
    );
  }

  ngOnInit() {
    this.subscription = interval(1000).subscribe((x) => {
      this.getTimeDifference();
    });
  }

  public selectNav(e: string) {
    this.setNav.emit(e);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
