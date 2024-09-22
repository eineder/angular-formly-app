import { FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-repeat-section',
  template: `
    <div *ngFor="let field of field.fieldGroup; let i = index">
      <formly-field [field]="field"></formly-field>
      <div class="d-flex justify-content-between mt-2">
        <button type="button" class="btn btn-danger" (click)="remove(i)">
          Remove Filter
        </button>
      </div>
      <hr />
    </div>
    <button type="button" class="btn btn-success mt-2" (click)="add()">
      Add Filter
    </button>
  `,
})
export class RepeatTypeComponent extends FieldArrayType {}
