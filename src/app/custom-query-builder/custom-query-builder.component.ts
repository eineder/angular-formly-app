import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SearchService } from '../services/search.service';

// Field and operator definitions
let fieldDefinitions: {
  key: string;
  label: string;
  type: string;
  options: string[];
}[] = [];

type FieldType = 'string' | 'number' | 'enum';

const operatorDefinitions: Record<
  FieldType,
  { value: string; label: string }[]
> = {
  string: [
    { value: 'equals', label: 'Equals' },
    { value: 'not-equals', label: 'Not Equals' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'contains', label: 'Contains' },
  ],
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'not-equals', label: 'Not Equals' },
    { value: 'greater-than', label: 'Greater Than' },
    { value: 'less-than', label: 'Less Than' },
    { value: 'greater-equal', label: 'Greater or Equal' },
    { value: 'less-equal', label: 'Less or Equal' },
  ],
  enum: [
    { value: 'equals', label: 'Equals' },
    { value: 'not-equals', label: 'Not Equals' },
  ],
};

@Component({
  selector: 'custom-query-builder',
  templateUrl: './custom-query-builder.component.html',
})
export class CustomQueryBuilderComponent {
  form: FormGroup;
  options: string[] = [];
  model: any = {
    filters: [],
  };

  // The form fields configuration
  fields: FormlyFieldConfig[] = [
    {
      key: 'filters',
      type: 'repeat',
      fieldArray: {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-4',
            key: 'field',
            type: 'select',
            templateOptions: {
              label: 'Field',
              required: true,
            },
            expressions: {
              'templateOptions.options': (field: FormlyFieldConfig) => {
                return fieldDefinitions?.map((field) => ({
                  value: field.key,
                  label: field.label,
                }));
              },
            },
          },
          {
            className: 'col-4',
            key: 'operator',
            type: 'select',
            templateOptions: {
              label: 'Operator',
              required: true,
              options: [], // Operators will be dynamically set based on field type
            },
            expressions: {
              'templateOptions.options': (field: FormlyFieldConfig) => {
                const selectedField = fieldDefinitions.find(
                  (f) => f.key === field.form?.value.field
                );
                if (selectedField) {
                  return (
                    operatorDefinitions[selectedField.type as FieldType] || []
                  );
                }
                return [];
              },
            },
          },
          {
            className: 'col-4',
            // This input field will be visible for string and number types
            key: 'value',
            type: 'input',
            templateOptions: {
              label: 'Value',
              required: true,
            },
            expressions: {
              hide: (field: FormlyFieldConfig) => {
                const selectedField = fieldDefinitions.find(
                  (f) => f.key === field.form?.value.field
                );
                return selectedField?.options; // Hide if options are defined
              },
              'templateOptions.type': (field: FormlyFieldConfig) => {
                const selectedField = fieldDefinitions.find(
                  (f) => f.key === field.form?.value.field
                );
                return selectedField?.type === 'number' ? 'number' : 'text'; // Input type based on field type
              },
            },
          },
          {
            className: 'col-4',
            // This select field will be visible for enum types
            key: 'value',
            type: 'select',

            templateOptions: {
              label: 'Value',
              required: true,
              options: [], // Options will be populated dynamically
            },
            expressions: {
              hide: (field: FormlyFieldConfig) => {
                const selectedField = fieldDefinitions.find(
                  (f) => f.key === field.form?.value.field
                );
                return !selectedField?.options; // Hide if no options are defined
              },
              'templateOptions.options': (field: FormlyFieldConfig) => {
                const selectedField = fieldDefinitions.find(
                  (f) => f.key === field.form?.value.field
                );
                if (selectedField?.options) {
                  return (
                    selectedField.options?.map((option) => ({
                      value: option,
                      label: option,
                    })) || []
                  );
                }
                return [];
              },
            },
          },
        ],
      },
    },
  ];
  constructor(private fb: FormBuilder, private searchService: SearchService) {
    this.form = this.fb.group({
      selectedType: [''],
    });
  }

  ngOnInit(): void {
    this.searchService.getTypeNames().subscribe((types) => {
      this.options = types;
      if (this.options.length > 0) {
        this.form.get('selectedType')?.setValue(this.options[0]);
      }

      this.onTypeSelected({});
    });
  }

  onSubmit(model: any) {
    console.log('Query:', model);
  }

  onTypeSelected(event: any) {
    const type = this.form.get('selectedType')?.value;
    console.log('Selected:', type);

    this.searchService.getSchema(type).subscribe((data) => {
      const schema = data[0].schema;
      const fields = Object.keys(schema.properties).map((key) => ({
        key,
        label: key,
        type: schema.properties[key].type,
        options: schema.properties[key].enum,
      }));
      fieldDefinitions = fields;
    });
  }
}
