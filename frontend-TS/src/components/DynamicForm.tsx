import  { useState } from 'react';

export const DynamicForm({ jsonData }) {
  const [formState, setFormState] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form Submitted:', formState);
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              onChange={handleChange}
            />
          </div>
        );
      case 'select':
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            <select name={field.name} onChange={handleChange}>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {jsonData.fields && jsonData.fields.map((field) => renderField(field))}
      <button type="submit">Submit</button>
    </form>
  );
}

