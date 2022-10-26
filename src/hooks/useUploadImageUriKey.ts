import React, { useEffect, useState } from "react";
import useFileUpload from "./useFileUpload";
import { useFilePicker } from "use-file-picker";

export default function useUploadImageUriKey({ uri, attachedRecord }) {
  const [image, setImage] = useState({
    url: uri,
    file: null,
  } as any);
  const [uploading, setUploading] = useState(false);
  const { uploadFile } = useFileUpload({ attachedRecord });
  const [openFileSelector, { filesContent, plainFiles, clear }] = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
  });
  const handleAddImage = () => {
    openFileSelector();
  };
  const handleRemoveImage = () => {
    setImage(null);
  };
  const getImageUriKey = async () => {
    if (!imageHasChanged || !image || !image?.file) return null;
    setUploading(true);
    try {
      const key = await uploadFile(image?.file);
      setUploading(false);
      return key;
    } catch (e) {
      setUploading(false);
      return null;
    }
  };
  const reLoadImage = () => {
    clear();
    setImage({
      url: uri,
      file: null,
    });
  };
  useEffect(() => {
    if (filesContent.length != 0) setImage({ url: filesContent[0]?.content, file: plainFiles[0] });
  }, [filesContent, plainFiles]);
  useEffect(() => {
    reLoadImage();
  }, [uri]);
  const imageHasChanged = image?.url != uri;
  return { image: image?.url, imageHasChanged, uploading, handleAddImage, handleRemoveImage, getImageUriKey, reLoadImage };
}
