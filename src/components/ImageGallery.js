import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { Spin, Button, Modal, Input, App } from "antd";
import { fetchImages, deleteImage } from "../services/api";

const ImageGallery = React.forwardRef((props, ref) => {
  const { message } = App.useApp();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false); // loading khi load list ảnh
  const [deleting, setDeleting] = useState(false); // loading khi xóa ảnh
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [deleteCode, setDeleteCode] = useState("");

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await fetchImages();
      setImages(data);

      // preload ảnh
      data.forEach((img) => {
        const preload = new Image();
        preload.src = img.url;
      });
    } catch (err) {
      console.error("Lỗi load ảnh:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useImperativeHandle(ref, () => ({
    refresh: loadImages,
  }));

  useEffect(() => {
    loadImages();
  }, []);

  const breakpointColumnsObj = {
    default: 5,
    1100: 4,
    700: 3,
    500: 2,
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "image.jpg";
    link.click();
  };

  const handleDelete = async () => {
    if (deleteCode !== "151023") {
      message.error("Mã xóa không đúng!");
      return;
    }

    setDeleting(true);
    try {
      await deleteImage(currentImage._id);
      message.success("Xóa ảnh thành công!");
      setIsModalOpen(false);
      setDeleteCode("");
      loadImages();
    } catch (error) {
      message.error("Lỗi khi xóa ảnh: " + error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {images.map((img) => (
            <div key={img._id} style={{ cursor: "pointer" }}>
              <img
                src={img.url}
                alt=""
                style={{ width: "100%", borderRadius: "12px" }}
                onClick={() => {
                  setCurrentImage(img);
                  setIsModalOpen(true);
                }}
              />
            </div>
          ))}
        </Masonry>
      </div>

      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        centered
        width={800}
      >
        {currentImage && (
          <Spin spinning={deleting}>
            <div style={{ textAlign: "center" }}>
              <img
                src={currentImage.url}
                alt=""
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  borderRadius: "8px",
                }}
              />
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                }}
              >
                <Button
                  type="primary"
                  onClick={() => handleDownload(currentImage.url)}
                  disabled={deleting}
                >
                  Tải xuống
                </Button>
                <Input
                  type="number"
                  placeholder="Nhập mã xóa"
                  value={deleteCode}
                  onChange={(e) => setDeleteCode(e.target.value)}
                  style={{ width: 200 }}
                  onPressEnter={(e) => e.preventDefault()}
                  disabled={deleting}
                />
                <Button danger onClick={handleDelete} loading={deleting}>
                  Xóa ảnh
                </Button>
              </div>
            </div>
          </Spin>
        )}
      </Modal>
    </Spin>
  );
});

export default ImageGallery;
