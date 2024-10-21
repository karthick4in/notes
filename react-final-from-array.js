import React from 'react';
import { Form, Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
// npm install final-form react-final-form

const MyForm = () => {
  const onSubmit = (values) => {
    console.log(values); // Handle the submitted form values here
  };

  return (
    <Form
      onSubmit={onSubmit}
      mutators={{
        ...arrayMutators, // Important to include arrayMutators for handling array operations
      }}
      render={({ handleSubmit, form: { mutators: { push, remove } }, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <FieldArray name="inputArray">
            {({ fields }) => (
              <div>
                {fields.map((name, index) => (
                  <div key={name}>
                    <Field name={`${name}`} component="input" placeholder={`Input #${index + 1}`} />
                    <span onClick={() => remove(index)} style={{ cursor: 'pointer' }}>❌</span>
                  </div>
                ))}
                <button type="button" onClick={() => push('inputArray', '')}>
                  Add Input
                </button>
              </div>
            )}
          </FieldArray>
          <button type="submit" disabled={submitting || pristine}>
            Submit
          </button>
        </form>
      )}
    />
  );
};

export default MyForm;
