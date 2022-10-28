import { useState } from "react";
import useLink from "./useLink";

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

export default function useUploadDrawEvent({ initialHasApplication }) {
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
  // const { images, error, setError, handleAddImages, handleRemoveImage, uploadAllSelectedFiles } = useUploadDrawEvent({attachedRecord:"draw_event", fileLimit: 8})
  const isSelectCollection = collection?.contractAddress != null;
  console.log(
    "Collection : ",
    isSelectCollection ? collection?.name : "",
    "\n종류 : ",
    type == EventType.NOTICE ? "공지" : "이벤트",
    "\n제목 : ",
    name,
    "\n내용 : ",
    description
  );
  const uploadDrawEvent = async ({ uploadSuccessCallback }) => {
    if (loading) {
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
    if (initialHasApplication && enableApplicationLink && !applicationLink) {
      setError("응모 링크를 작성해주세요.");
      return;
    }
    if (applicationLinkError) {
      setError(applicationLinkError);
      return;
    }
    // if (images.length == 0) {
    //   setError("이미지를 추가해주세요.");
    //   return;
    // }
    setLoading(true);
    uploadSuccessCallback();
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
    loading,
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
  };
}
