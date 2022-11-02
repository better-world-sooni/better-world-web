import { useEffect, useRef, useState } from "react";
import useFileUpload, { FileUploadReturnType } from "./useFileUpload";
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
  key: number;
};

type ImageTypeOutput = {
  url: string;
  loading: boolean;
  key: number;
};

export function useUploadImageUriKeys({ attachedRecord, fileLimit }) {
  const [images, setImages] = useState<ImageType[]>([]);
  const { uploadFile } = useFileUpload({ attachedRecord });
  const imagesLeft = fileLimit - images.length;
  const changedIndex = useRef<number>(-1);
  const key = useRef<number>(0);
  const getKey = () => {
    const nextKey = key.current;
    key.current += 1;
    return nextKey;
  };
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
      alert(`최대 ${imagesLeft}개의 이미지를 선택하실 수 있습니다.\n현재 ${images.length}개 선태됨.`);
      clear();
      return;
    }
    const newImages = filesContent.map((value, index) => <ImageType>{ url: value?.content, file: plainFiles[index], loading: false, key: getKey() });
    setImages([...images, ...newImages]);
    clear();
  }, [plainFiles]);

  const handleRemoveImage = (index: number) => {
    const newImage = images.slice(0, index).concat(images.slice(index + 1));
    setImages(newImage);
  };

  const handleChangeImage = (index: number) => {
    changedIndex.current = index;
    openOneFileSelector();
  };
  useEffect(() => {
    if (fileContent.length == 0) return;
    setImages((prevSelectedImages) =>
      setSelectedImagesImageAtIndex(prevSelectedImages, changedIndex.current, {
        url: fileContent[0]?.content,
        file: planFile[0],
        loading: false,
        key: prevSelectedImages[changedIndex.current].key,
      })
    );
    clearOne();
  }, [planFile]);

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
    const res = await uploadFile(images[index].file, FileUploadReturnType.BlobSignedId);
    setImages((prevSelectedImages) => setSelectedImageLoadingAtIndex(prevSelectedImages, index, false));
    return res;
  };
  const setSelectedImagesImageAtIndex = (prevSelectedImages: ImageType[], index: number, image: ImageType) => {
    const newSelectedImages = [...prevSelectedImages];
    newSelectedImages[index] = image;
    changedIndex.current = -1;
    return newSelectedImages;
  };

  const setSelectedImageLoadingAtIndex = (prevSelectedImages: ImageType[], index: number, bool: boolean) => {
    const newSelectedImages = [...prevSelectedImages];
    newSelectedImages[index].loading = bool;
    return newSelectedImages;
  };
  const imageUrls = images.map((value) => <ImageTypeOutput>{ url: value?.url, loading: value?.loading, key: value?.key });

  return { imageUrls, handleAddImages, handleChangeImage, handleRemoveImage, getImageUriKeys };
}
