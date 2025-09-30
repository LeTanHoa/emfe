import React, { useRef } from "react";
import ImageUpload from "../components/ImageUpload";
import ImageGallery from "../components/ImageGallery";

const GalleryPage = () => {
  const galleryRef = useRef();

  const handleUploadSuccess = () => {
    if (galleryRef.current) {
      galleryRef.current.refresh(); // gọi lại load ảnh
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>📷 Bộ sưu tập ảnh</h2>
      <ImageUpload onUploadSuccess={handleUploadSuccess} />
      <div style={{ marginTop: "20px" }}>
        <ImageGallery ref={galleryRef} />
      </div>
    </div>
  );
};

export default GalleryPage;
