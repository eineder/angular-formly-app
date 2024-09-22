// app.component.ts
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { CustomQueryBuilderComponent } from './custom-query-builder/custom-query-builder.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  onSubmit(model: any) {
    this.http.post('/api/search', model).subscribe((result) => {
      console.log('Search results:', result);
    });
  }
}
