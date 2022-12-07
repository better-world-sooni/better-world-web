import { chain } from "lodash";
import { useRef, useState } from "react";
import { getDateType } from "src/modules/timeHelper";
import { updateEventQuery, uploadDrawEventQuery } from "./queries/admin/events";
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

export default function useUploadDrawEvent({ queryClient, uploadSuccessCallback = null, event = null }) {
  const isModify = event != null;
  const [loading, setLoading] = useState(false);

  const [collection, setCollection] = useState({
    name: event?.nft_collection?.name,
    contractAddress: event?.nft_collection?.contract_address,
    imageUri: event?.nft_collection?.image_uri,
  });
  const canModifyCollection = !isModify;

  const [type, setType] = useState(event?.has_application ? (event?.has_application == true ? EventType.EVENT : EventType.NOTICE) : EventType.NOTICE);
  const canModifyType = !(event?.has_application == true && event?.event_application_count != 0);

  const [name, setName] = useState(event?.name ? event?.name : "");
  const [description, setDescription] = useState(event?.description ? event?.description : "");
  const index = useRef<number>(0);
  const {
    link: discordLink,
    linkError: discordLinkError,
    handleChangeLink: handleChangeDiscordLink,
    handleClickLink: handleClickDiscordLink,
  } = useLink(event?.discord_link ? event?.discord_link : "", true);
  const {
    link: applicationLink,
    linkError: applicationLinkError,
    handleChangeLink: handleChangeApplicationLink,
    handleClickLink: handleClickApplicationLink,
  } = useLink(event?.application_link ? event?.application_link : "");
  const [enableApplicationLink, setEnableApplicationLink] = useState(
    isModify ? (event?.has_application == true && event?.application_link ? true : false) : true
  );
  const [eanbleExpires, setEnableExpires] = useState(event?.expires_at ? true : false);
  const [expiresAt, setExpiresAt] = useState(event?.expires_at ? getDateType(event?.expires_at) : new Date());
  const [enableCreatedAt, setEnableCreatedAt] = useState(isModify ? true : false);
  const [createdAt, setCreatedAt] = useState(isModify ? getDateType(event?.created_at) : new Date());

  const getIndex = () => {
    const nextIndex = index.current;
    index.current += 1;
    return nextIndex;
  };
  const drawEventOptions = event?.draw_event_options;
  const Options =
    drawEventOptions && drawEventOptions.length != 0
      ? chain(drawEventOptions)
          .groupBy("category")
          .map((value, key) => {
            const options = value.map((item) => ({ ...item }));
            if (options.length == 1 && options[0].input_type == EventApplicationInputType.CUSTOM_INPUT)
              return { name: key, inputType: EventApplicationInputType.CUSTOM_INPUT, index: getIndex(), options: [] };
            if (options.length == 1 && options[0].input_type == EventApplicationInputType.DISCORD_ID)
              return { name: key, inputType: EventApplicationInputType.DISCORD_ID, index: getIndex(), options: [] };
            if (options.length == 1 && options[0].input_type == EventApplicationInputType.TWITTER_ID)
              return { name: key, inputType: EventApplicationInputType.TWITTER_ID, index: getIndex(), options: [] };
            return { name: key, inputType: EventApplicationInputType.SELECT, index: getIndex(), options: options.map((value) => value?.name) };
          })
          .value()
      : null;
  const [applicationCategories, setApplicationCategories] = useState<EventApplicationCategory[]>(Options ? Options : []);
  const canModifyApplicationCategories = !(event?.has_application == true && event?.event_application_count != 0);

  const [error, setError] = useState("");
  const selectCollection = (name, contractAddress, imageUri) => {
    setCollection({ name, contractAddress, imageUri });
    setError("");
  };
  const fileLimit = 8;
  const { imageUrls, handleAddImages, handleChangeImage, handleRemoveImage, getImageUriKeys } = useUploadImageUriKeys({
    attachedRecord: "draw_event",
    fileLimit: fileLimit,
    originImagesUrl: event?.image_uris,
  });
  const canModifyImages = !isModify;

  const { isLoading: loadingUpload, mutate: mutateUpload } = uploadDrawEventQuery(queryClient, uploadSuccessCallback);
  const { isLoading: loadingUpdate, mutate: mutateUpdate } = updateEventQuery(queryClient, uploadSuccessCallback);
  const isSelectCollection = collection?.contractAddress != null;
  const canUploadDrawEvent = !(
    !isSelectCollection ||
    !name ||
    !description ||
    (type == EventType.EVENT && enableApplicationLink && (applicationLinkError || applicationLink == "")) ||
    (type == EventType.EVENT && imageUrls.length == 0) ||
    imageUrls.length > fileLimit ||
    discordLinkError
  );

  const uploadDrawEvent = async () => {
    if (loading || loadingUpload || loadingUpdate) {
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

    if (discordLinkError) {
      setError(discordLinkError);
      return;
    }
    if (type == EventType.EVENT && imageUrls.length == 0) {
      setError("이미지를 추가해주세요.");
      return;
    }
    if (imageUrls.length > fileLimit) {
      setError("이미지는 8장 이하여야 합니다.");
      return;
    }
    setLoading(true);
    const keys = isModify ? [] : await getImageUriKeys();
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
      event_id: event?.id,
      contract_address: collection.contractAddress,
      name,
      description,
      images: keys,
      expires_at: type == EventType.EVENT && eanbleExpires ? expiresAt : null,
      created_at: enableCreatedAt ? createdAt : new Date(),
      has_application: type == EventType.EVENT,
      application_link: type == EventType.EVENT && enableApplicationLink ? applicationLink : null,
      discord_link: discordLink != "" ? discordLink : null,
      draw_event_options_attributes: type == EventType.EVENT && !enableApplicationLink ? applicationOptions : [],
    };
    isModify ? mutateUpdate(body) : mutateUpload(body);
    setLoading(false);
    setError("");
  };
  const handleApplicationLinkChange = (value) => {
    handleChangeApplicationLink(value);
    setError("");
  };
  const handleDiscordLinkChange = (value) => {
    handleChangeDiscordLink(value);
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
    canModifyCollection,
    type,
    setType,
    canModifyType,
    collection,
    selectCollection,
    error,
    loading: loading || loadingUpload || loadingUpdate,
    canUploadDrawEvent,
    discordLink,
    handleDiscordLinkChange,
    handleClickDiscordLink,
    discordLinkError,
    applicationCategories,
    handleAddApplicationCategory,
    handleRemoveApplicationCategory,
    handleAddApplicationOption,
    handleRemoveApplicationOption,
    canModifyApplicationCategories,
    enableApplicationLink,
    toggleEnableApplicationLink,
    applicationLink,
    handleApplicationLinkChange,
    handleClickApplicationLink,
    applicationLinkError,
    expiresAt,
    eanbleExpires,
    setEnableExpires,
    setExpiresAt,
    createdAt,
    enableCreatedAt,
    setCreatedAt,
    setEnableCreatedAt,
    name,
    handleNameChange,
    description,
    handleDescriptionChange,
    uploadDrawEvent,
    imageUrls,
    handleAddImages,
    handleChangeImage,
    handleRemoveImage,
    canModifyImages,
    fileLimit,
  };
}
