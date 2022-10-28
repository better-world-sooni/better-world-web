import { useEffect, useRef, useState } from "react";
import useFileUpload from "./useFileUpload";
import { useFilePicker } from "use-file-picker";

export function useUploadImageUriKey({ uri, attachedRecord }) {
  const [image, setImage] = useState({
    url: uri,
    file: null,
  } as any);
  const [uploading, setUploading] = useState(false);
  const { uploadFile } = useFileUpload({ attachedRecord });
  const [openFileSelector, { filesContent, plainFiles, clear, errors }] = useFilePicker({
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
  }, [filesContent || plainFiles]);
  useEffect(() => {
    reLoadImage();
  }, [uri]);
  const imageHasChanged = image?.url != uri;
  return { image: image?.url, imageHasChanged, uploading, handleAddImage, handleRemoveImage, getImageUriKey, reLoadImage };
}

type ImageType = {
  url: string;
  file: File;
  loading: boolean;
};

export function useUploadImageUriKeys({ attachedRecord, maxFileLength }) {
  const [images, setImages] = useState<ImageType[]>([]);
  const { uploadFile } = useFileUpload({ attachedRecord });
  const imagesLeft = maxFileLength - images.length;
  const changedIndex = useRef<number>(-1);
  const [openFileSelector, { filesContent, plainFiles, clear }] = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: true,
  });
  const [openOneFileSelector, { filesContent: fileContent, plainFiles: planFile, clear: clearOne }] = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
  });
  const handleAddImages = () => {
    openFileSelector();
  };
  useEffect(() => {
    if (filesContent.length == 0) return;
    if (filesContent.length > imagesLeft) {
      alert(`최대 ${imagesLeft}개의 이미지를 선택하실 수 있습니다.`);
      clear();
      return;
    }
    const newImages = filesContent.map((value, index) => <ImageType>{ url: value?.content, file: plainFiles[index], loading: false });
    setImages([...images, ...newImages]);
    clear();
  }, [filesContent || plainFiles]);

  const handleRemoveImage = (index: number) => {
    const newImage = images.slice(0, index).concat(images.slice(index + 1));
    setImages(newImage);
  };

  const handleChangeImage = (index: number) => {
    changedIndex.current = index;
    openOneFileSelector();
  };
  useEffect(() => {
    if (filesContent.length == 0) return;
    setImages((prevSelectedImages) =>
      setSelectedImagesImageAtIndex(prevSelectedImages, changedIndex.current, {
        url: fileContent[changedIndex.current]?.content,
        file: plainFiles[changedIndex.current],
        loading: false,
      })
    );
    clearOne();
    changedIndex.current = -1;
  }, [fileContent || planFile]);

  const getImageUriKeys = async () => {
    try {
      const uriKeys = await Promise.all(images.map((_, index) => getImageUriKeyAtIndex(index)));
      return uriKeys;
    } catch (e) {
      alert("이미지 업로드 중 문제가 발생하였습니다.");
      return [];
    }
  };
  const getImageUriKeyAtIndex = async (index: number) => {
    setImages((prevSelectedImages) => setSelectedImageLoadingAtIndex(prevSelectedImages, index, true));
    const res = await uploadFile(images[index].file);
    setImages((prevSelectedImages) => setSelectedImageLoadingAtIndex(prevSelectedImages, index, false));
    return res;
  };

  const setSelectedImagesImageAtIndex = (prevSelectedImages: ImageType[], index: number, image: ImageType) => {
    const newSelectedImages = [...prevSelectedImages];
    newSelectedImages[index] = image;
    return newSelectedImages;
  };

  const setSelectedImageLoadingAtIndex = (prevSelectedImages: ImageType[], index: number, bool: boolean) => {
    const newSelectedImages = [...prevSelectedImages];
    newSelectedImages[index].loading = bool;
    return newSelectedImages;
  };
  const imageUrl = images.map((value) => value.url);

  return { imageUrl, handleAddImages, handleChangeImage, handleRemoveImage, getImageUriKeys };
}
