import React, { useState } from "react";
import { Upload, Button, Spin, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadImage, fetchImages } from "../services/api";

const ImageUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      await uploadImage(formData);
      message.success("Upload thành công!");
      onUploadSuccess(); // gọi lại để gallery update
    } catch (err) {
      console.error(err);
      message.error("Upload thất bại!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Spin spinning={uploading}>
      <Upload customRequest={handleUpload} showUploadList={false}>
        <Button icon={<UploadOutlined />}>Upload Ảnh</Button>
      </Upload>
    </Spin>
  );
};

export default ImageUpload;
