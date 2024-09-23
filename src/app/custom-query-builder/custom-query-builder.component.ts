import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

// Field and operator definitions
let fieldDefinitions = [
  { key: 'name', label: 'Name', type: 'string' },
  { key: 'age', label: 'Age', type: 'number' },
  {
    key: 'status',
    label: 'Status',
    type: 'enum',
    options: ['Active', 'Inactive', 'Pending'],
  },
];

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
  options: string[] = ['Person', 'Company'];
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
                return fieldDefinitions.map((field) => ({
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
                return selectedField?.type === 'enum'; // Hide if enum
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
                return selectedField?.type !== 'enum'; // Show only if enum
              },
              'templateOptions.options': (field: FormlyFieldConfig) => {
                const selectedField = fieldDefinitions.find(
                  (f) => f.key === field.form?.value.field
                );
                if (selectedField?.type === 'enum') {
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
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selectedType: [''],
    });
  }

  ngOnInit(): void {
    if (this.options.length > 0) {
      this.form.get('selectedType')?.setValue(this.options[0]);
    }
  }

  onSubmit(model: any) {
    console.log('Query:', model);
  }

  onTypeSelected(event: any) {
    const type = this.form.get('selectedType')?.value;
    console.log('Selected:', type);

    if (type === 'Person') {
      fieldDefinitions = [
        { key: 'name', label: 'Name', type: 'string' },
        { key: 'age', label: 'Age', type: 'number' },
        {
          key: 'status',
          label: 'Status',
          type: 'enum',
          options: ['Active', 'Inactive', 'Pending'],
        },
      ];
    } else if (type === 'Company') {
      fieldDefinitions = [
        { key: 'name', label: 'Name', type: 'string' },
        { key: 'revenue', label: 'Revenue', type: 'number' },
        {
          key: 'isActive',
          label: 'Is active',
          type: 'enum',
          options: ['yes', 'no'],
        },
      ];
    }
  }
}
