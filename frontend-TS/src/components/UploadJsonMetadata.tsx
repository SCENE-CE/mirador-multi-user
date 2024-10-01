import React, { useState } from 'react';

function UploadJsonForm() {
  const [formData, setFormData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        console.log('JSON content:', json);
        setFormData(json);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    reader.onerror = (e) => {
      console.error('File reading error:', e);
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input
        type="file"
        accept="application/json"
        onChange={handleFileUpload}
        style={{ display: 'block', marginBottom: '20px' }}
      />
      {formData && <DynamicForm jsonData={formData} />}
    </div>
  );
}

function DynamicForm({ jsonData }) {
  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            <input type="text" name={field.name} />
          </div>
        );
      case 'number':
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            <input type="number" name={field.name} />
          </div>
        );
      case 'select':
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            <select name={field.name}>
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
    <form>
      {jsonData.fields && jsonData.fields.map((field) => renderField(field))}
      <button type="submit">Submit</button>
    </form>
  );
}

export default UploadJsonForm;
