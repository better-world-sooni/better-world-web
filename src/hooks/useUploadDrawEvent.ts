import { useState } from "react";
import { uploadDrawEventQuery } from "./queries/admin/events";
import useLink from "./useLink";
import { useUploadImageUriKeys } from "./useUploadImageUriKey";

export enum EventApplicationInputType {
  SELECT = 0,
  CUSTOM_INPUT = 1,
  TWITTER_ID = 2,
  DISCORD_ID = 3,
}

export type EventApplicationCategory = {
  name: string;
  options: string[];
  inputType: EventApplicationInputType;
  index: number;
};

export enum EventType {
  NOTICE = 0,
  EVENT = 1,
}

export default function useUploadDrawEvent({ queryClient, uploadSuccessCallback = null }) {
  const [collection, setCollection] = useState({ name: null, contractAddress: null, imageUri: null });
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(EventType.NOTICE);
  const [name, setName] = useState("");
  const [discordLink, setDiscordLink] = useState("");
  const [description, setDescription] = useState("");
  const [index, setIndex] = useState(0);
  const getIndex = () => {
    const nextIndex = index + 1;
    setIndex((prev) => prev + 1);
    return nextIndex;
  };
  const {
    link: applicationLink,
    linkError: applicationLinkError,
    handleChangeLink: handleChangeApplicationLink,
    handleClickLink: handleClickApplicationLink,
  } = useLink("");
  const [enableApplicationLink, setEnableApplicationLink] = useState(true);
  const [expiresAt, setExpiresAt] = useState(null);
  const [applicationCategories, setApplicationCategories] = useState<EventApplicationCategory[]>([]);
  const [error, setError] = useState("");
  const selectCollection = (name, contractAddress, imageUri) => {
    setCollection({ name, contractAddress, imageUri });
    setError("");
  };
  const fileLimit = 8;
  const { imageUrls, handleAddImages, handleChangeImage, handleRemoveImage, getImageUriKeys } = useUploadImageUriKeys({
    attachedRecord: "draw_event",
    fileLimit: fileLimit,
  });
  const { isLoading, mutate } = uploadDrawEventQuery(queryClient, uploadSuccessCallback);
  const isSelectCollection = collection?.contractAddress != null;
  const canUploadDrawEvent = !(
    !isSelectCollection ||
    !name ||
    !description ||
    (type == EventType.EVENT && enableApplicationLink && (applicationLinkError || applicationLink == "")) ||
    imageUrls.length == 0 ||
    imageUrls.length > fileLimit
  );

  const uploadDrawEvent = async () => {
    if (loading || isLoading) {
      return;
    }
    if (!isSelectCollection) {
      setError("Collection을 선택해주세요.");
      return;
    }
    if (!name) {
      setError("제목을 작성해주세요.");
      return;
    }
    if (!description) {
      setError("설명을 작성해주세요.");
      return;
    }
    if (type == EventType.EVENT && enableApplicationLink && (applicationLinkError || applicationLink == "")) {
      setError(applicationLinkError);
      return;
    }
    if (imageUrls.length == 0) {
      setError("이미지를 추가해주세요.");
      return;
    }
    if (imageUrls.length > fileLimit) {
      setError("이미지는 8장 이하여야 합니다.");
      return;
    }
    setLoading(true);
    const keys = await getImageUriKeys();
    if (keys == null) {
      setLoading(false);
      return;
    }
    const applicationOptions = applicationCategories
      .map((applicationCategory) => {
        if (applicationCategory.inputType !== EventApplicationInputType.SELECT)
          return {
            name: applicationCategory.name,
            category: applicationCategory.name,
            input_type: applicationCategory.inputType,
          };
        return applicationCategory.options.map((applicationOption) => {
          return {
            name: applicationOption,
            category: applicationCategory.name,
            input_type: applicationCategory.inputType,
          };
        });
      })
      .flat();
    const body = {
      contract_address: collection.contractAddress,
      name,
      description,
      images: keys,
      expires_at: expiresAt,
      has_application: type == EventType.EVENT,
      application_link: enableApplicationLink ? applicationLink : null,
      discord_link: discordLink ? discordLink : null,
      draw_event_options_attributes: !enableApplicationLink ? applicationOptions : [],
    };
    mutate(body);
    setLoading(false);
    setError("");
  };
  const handleDiscordLinkChange = ({ target: { value: text } }) => {
    setDiscordLink(text);
    setError("");
  };
  const handleApplicationLinkChange = (value) => {
    handleChangeApplicationLink(value);
    setError("");
  };
  const toggleEnableApplicationLink = () => {
    setEnableApplicationLink((prev) => !prev);
  };
  const handleDescriptionChange = ({ target: { value: text } }) => {
    setDescription(text);
    setError("");
  };
  const handleNameChange = ({ target: { value: text } }) => {
    setName(text);
    setError("");
  };
  const handleAddApplicationCategory = (name, inputType) => {
    setApplicationCategories([...applicationCategories, { name, options: [], inputType, index: getIndex() }]);
  };

  const handleRemoveApplicationCategory = (index) => {
    const newApplicationCategories = applicationCategories.slice(0, index).concat(applicationCategories.slice(index + 1));
    setApplicationCategories(newApplicationCategories);
  };

  const handleAddApplicationOption = (categoryIndex, optionName) => {
    const newApplicationCategories = [...applicationCategories];
    if (newApplicationCategories[categoryIndex]) {
      newApplicationCategories[categoryIndex].options = [...newApplicationCategories[categoryIndex].options, optionName];
      setApplicationCategories(newApplicationCategories);
    }
  };

  const handleRemoveApplicationOption = (categoryIndex, optionIndex) => {
    const newApplicationCategories = [...applicationCategories];
    if (newApplicationCategories[categoryIndex]) {
      newApplicationCategories[categoryIndex].options = newApplicationCategories[categoryIndex].options
        .slice(0, optionIndex)
        .concat(newApplicationCategories[categoryIndex].options.slice(optionIndex + 1));
      setApplicationCategories(newApplicationCategories);
    }
  };

  return {
    type,
    setType,
    collection,
    selectCollection,
    error,
    loading: loading || isLoading,
    canUploadDrawEvent,
    discordLink,
    handleDiscordLinkChange,
    applicationCategories,
    handleAddApplicationCategory,
    handleRemoveApplicationCategory,
    handleAddApplicationOption,
    handleRemoveApplicationOption,
    enableApplicationLink,
    toggleEnableApplicationLink,
    applicationLink,
    handleApplicationLinkChange,
    handleClickApplicationLink,
    applicationLinkError,
    expiresAt,
    setExpiresAt,
    name,
    handleNameChange,
    description,
    handleDescriptionChange,
    uploadDrawEvent,
    imageUrls,
    handleAddImages,
    handleChangeImage,
    handleRemoveImage,
    fileLimit,
  };
}
