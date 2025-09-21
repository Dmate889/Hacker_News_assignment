import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HnApiService } from '@core/hn-api.service';
import { HnUser } from '@core/hn.models';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user?: HnUser;
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private api: HnApiService) {}

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('id')!;
    this.api.getUsers(username).subscribe({
      next: u => {
        this.user = u;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load user';
        this.loading = false;
      }
    });
  }
}
