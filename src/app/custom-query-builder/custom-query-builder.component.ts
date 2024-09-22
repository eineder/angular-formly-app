import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

// Field and operator definitions
const fieldDefinitions = [
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
  form = new FormGroup({});
  model: any = {
    filters: [],
  };

  // The form fields configuration
  fields: FormlyFieldConfig[] = [
    {
      key: 'filters',
      type: 'repeat',
      fieldArray: {
        fieldGroup: [
          {
            key: 'field',
            type: 'select',
            templateOptions: {
              label: 'Field',
              required: true,
              options: fieldDefinitions.map((field) => ({
                value: field.key,
                label: field.label,
              })),
            },
          },
          {
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

  onSubmit(model: any) {
    console.log('Query:', model);
  }
}
