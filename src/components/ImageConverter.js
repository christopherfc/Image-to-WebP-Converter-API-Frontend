import React, { useState } from "react";
import "./ImageConverter.css";

const ImageConverter = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    setError(null);
    setDownloadLink(null);

    try {
      const response = await fetch("http://localhost:3000/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha na conversão da imagem.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadLink(url);
    } catch (err) {
      setError("Erro ao converter imagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="converter-container">
      <form onSubmit={handleSubmit} className="image-form">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
        <button type="submit" disabled={loading} className="convert-button">
          {loading ? "Convertendo..." : "Converter Imagem"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {downloadLink && (
        <div className="download-container">
          <p>Imagem convertida com sucesso!</p>
          <a href={downloadLink} download="imagem-convertida.webp" className="download-link">
            Baixar Imagem Convertida
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageConverter;
