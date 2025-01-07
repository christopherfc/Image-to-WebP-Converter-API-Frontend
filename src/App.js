import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Importando o CSS

function App() {
  const [image, setImage] = useState(null); // Para armazenar a imagem carregada
  const [convertedImage, setConvertedImage] = useState(null); // Para armazenar o link da imagem convertida
  const [loading, setLoading] = useState(false); // Para mostrar o estado de carregamento

  // Função para tratar o upload da imagem
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file)); // Exibe o preview da imagem carregada
    setConvertedImage(null); // Limpa a imagem convertida
  };

  // Função para enviar a imagem e obter a versão convertida
  const handleImageConvert = async () => {
    const formData = new FormData();
    const fileInput = document.querySelector('input[type="file"]');
    formData.append('image', fileInput.files[0]);

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/convert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Espera uma resposta do tipo blob (arquivo)
      });

      // Cria uma URL para o arquivo recebido
      const convertedImageURL = URL.createObjectURL(response.data);
      setConvertedImage(convertedImageURL); // Atualiza o estado com a URL da imagem convertida
    } catch (error) {
      console.error('Erro ao converter a imagem:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Conversor de Imagens - Upload e Conversão para WebP</h1>
      
      {/* Input de arquivo para o upload */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {/* Preview da imagem carregada */}
      {image && (
        <div>
          <h2>Preview da Imagem Carregada</h2>
          <img src={image} alt="Imagem carregada" style={{ width: '300px', height: 'auto' }} />
        </div>
      )}

      {/* Botão para converter a imagem */}
      <button onClick={handleImageConvert} disabled={loading || !image}>
        {loading ? 'Convertendo...' : 'Converter para WebP'}
      </button>

      {/* Preview da imagem convertida */}
      {convertedImage && (
        <div>
          <h2>Imagem Convertida</h2>
          <a href={convertedImage} download="imagem-convertida.webp">
            <img src={convertedImage} alt="Imagem convertida" style={{ width: '300px', height: 'auto' }} />
            <p>Clique para baixar a imagem convertida</p>
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
