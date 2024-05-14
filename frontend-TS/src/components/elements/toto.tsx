import React, { useState, useEffect } from 'react';

const TextLoader: React.FC = () => {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const loadTextFile = async () => {
      try {
        const response = await fetch('/app/hostname.txt'); // Assurez-vous que le chemin est correct
        const textData = await response.text();
        setText(textData);
      } catch (error) {
        console.error('Erreur lors du chargement du fichier', error);
      }
    };

    loadTextFile();
  }, []); // Le tableau vide indique que cet effet ne s'exécute qu'une fois après le premier rendu

  return (
    <div>
      <h1>Contenu du fichier toto.txt</h1>
      <textarea value={text} readOnly style={{ width: '100%', height: '300px' }} />
    </div>
  );
};

export default TextLoader;
