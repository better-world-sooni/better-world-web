import { chain } from "lodash";
import { useRef, useState } from "react";
import { getDateType } from "src/modules/timeHelper";
import { updateEventQuery, uploadDrawEventQuery } from "./queries/admin/events";
import useCheckPrivilege from "./useCheckPrivilege";
import useLink from "./useLink";
import { useUploadImageUriKeys } from "./useUploadImageUriKey";

export enum EventApplicationInputType {
  SELECT = 0,
  CUSTOM_INPUT = 1,
  TWITTER_ID = 2,
  DISCORD_ID = 3,
  LINK = 4,
  NOT_SELECTED = -1,
}

export type EventApplicationCategory = {
  name: string;
  category: string;
  options: string[];
  inputType: EventApplicationInputType;
  index: number;
};

export enum EventType {
  NOTICE = 0,
  EVENT = 1,
}

export enum OrderableType {
  HOLDER_ONLY = 0,
  ALL = 1,
}

export default function useUploadDrawEvent({ queryClient, uploadSuccessCallback = null, event = null, nftCollection = null }) {
  const isModify = event != null;
  const [loading, setLoading] = useState(false);
  const { currentNft, currentUser, isPrivilege, isSuperPrivilege } = useCheckPrivilege();
  const [collection, setCollection] = useState({
    name: isSuperPrivilege ? event?.nft_collection?.name : nftCollection?.name,
    contractAddress: isSuperPrivilege ? event?.nft_collection?.contract_address : nftCollection?.contract_address,
    imageUri: isSuperPrivilege ? event?.nft_collection?.image_uri : nftCollection?.image_uri,
  });

  const canModifyCollection = !isModify && isSuperPrivilege;
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
  } = useLink(event?.discord_link ? event?.discord_link : "", { canBlank: true, canMailTo: false });
  const [orderableType, setOrderableType] = useState(event?.orderable_type ? event?.orderable_type : OrderableType.HOLDER_ONLY);
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
              return { category: key, name: options[0].name, inputType: EventApplicationInputType.CUSTOM_INPUT, index: getIndex(), options: [] };
            if (options.length == 1 && options[0].input_type == EventApplicationInputType.DISCORD_ID)
              return { category: key, name: options[0].name, inputType: EventApplicationInputType.DISCORD_ID, index: getIndex(), options: [] };
            if (options.length == 1 && options[0].input_type == EventApplicationInputType.TWITTER_ID)
              return { category: key, name: options[0].name, inputType: EventApplicationInputType.TWITTER_ID, index: getIndex(), options: [] };
            if (options[0].input_type == EventApplicationInputType.SELECT)
              return { category: key, name: key, inputType: EventApplicationInputType.SELECT, index: getIndex(), options: options.map((value) => value?.name) };
            return { category: key, name: options[0].name, inputType: EventApplicationInputType.LINK, index: getIndex(), options: [] };
          })
          .value()
      : null;
  const [applicationCategories, setApplicationCategories] = useState<EventApplicationCategory[]>(
    Options ? Options : [{ name: "", category: "", index: getIndex(), options: [], inputType: EventApplicationInputType.NOT_SELECTED }]
  );
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
      setError("내용을 작성해주세요.");
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
    if (type == EventType.EVENT)
      for (var i = 0; i < applicationCategories.length; i++) {
        var applicationCategory = applicationCategories[i];
        if (applicationCategory.category == "") {
          setError("참여 조건 " + (i + 1) + "을/를 입력해주세요.");
          return;
        }
        if (applicationCategory.inputType == EventApplicationInputType.NOT_SELECTED) {
          setError("참여 조건 " + (i + 1) + "의 옵션을 선택해주세요.");
          return;
        }
        if (
          applicationCategory.inputType == EventApplicationInputType.LINK &&
          (applicationCategory.name == "" ||
            !(
              applicationCategory.name.startsWith("https://") ||
              applicationCategory.name.startsWith("http://") ||
              applicationCategory.name.startsWith("mailto:")
            ))
        ) {
          setError("참여 조건 " + (i + 1) + "에 올바른 링크를 적어주세요.");
          return;
        }
        if (applicationCategory.inputType == EventApplicationInputType.SELECT && applicationCategory.options.length == 0) {
          setError("참여 조건 " + (i + 1) + "의 옵션을 1개 이상 추가해주세요.");
          return;
        }
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
            name: applicationCategory.inputType == EventApplicationInputType.LINK ? applicationCategory.name : applicationCategory.category,
            category: applicationCategory.category,
            input_type: applicationCategory.inputType,
          };
        return applicationCategory.options.map((applicationOption) => {
          return {
            name: applicationOption,
            category: applicationCategory.category,
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
      created_at: enableCreatedAt ? createdAt : isModify ? null : new Date(),
      has_application: type == EventType.EVENT,
      application_link: null,
      discord_link: discordLink != "" ? discordLink : null,
      draw_event_options_attributes: type == EventType.EVENT ? applicationOptions : [],
      orderable_type: type == EventType.EVENT ? orderableType : OrderableType.HOLDER_ONLY,
    };
    isModify ? mutateUpdate(body) : mutateUpload(body);
    setLoading(false);
    setError("");
  };
  const handleDiscordLinkChange = (value) => {
    handleChangeDiscordLink(value);
    setError("");
  };
  const handleDescriptionChange = ({ target: { value: text } }) => {
    setDescription(text);
    setError("");
  };
  const handleNameChange = ({ target: { value: text } }) => {
    setName(text);
    setError("");
  };
  const handleAddApplicationCategory = () => {
    const newApplicationCategory = {
      name: "",
      category: "",
      index: getIndex(),
      options: [],
      inputType: EventApplicationInputType.NOT_SELECTED,
    };
    setApplicationCategories([...applicationCategories, newApplicationCategory]);
  };

  const handleRemoveApplicationCategory = (index) => {
    if (applicationCategories.length == 1) return;
    const newApplicationCategories = applicationCategories.slice(0, index).concat(applicationCategories.slice(index + 1));
    setApplicationCategories(newApplicationCategories);
    setError("");
  };

  const handleAddApplicationOption = (categoryIndex, optionName) => {
    const newApplicationCategories = [...applicationCategories];
    if (newApplicationCategories[categoryIndex]) {
      newApplicationCategories[categoryIndex].options = [...newApplicationCategories[categoryIndex].options, optionName];
      setApplicationCategories(newApplicationCategories);
      setError("");
    }
  };

  const handleRemoveApplicationOption = (categoryIndex, optionIndex) => {
    const newApplicationCategories = [...applicationCategories];
    if (newApplicationCategories[categoryIndex]) {
      newApplicationCategories[categoryIndex].options = newApplicationCategories[categoryIndex].options
        .slice(0, optionIndex)
        .concat(newApplicationCategories[categoryIndex].options.slice(optionIndex + 1));
      setApplicationCategories(newApplicationCategories);
      setError("");
    }
  };

  const handleChangeApplicationCategoryName = (categoryIndex, value) => {
    const newApplicationCategories = [...applicationCategories];
    if (newApplicationCategories[categoryIndex]) {
      newApplicationCategories[categoryIndex] = {
        ...newApplicationCategories[categoryIndex],
        category: value,
      };
      setApplicationCategories(newApplicationCategories);
      setError("");
    }
  };

  const handleChangeApplicationName = (categoryIndex, value) => {
    const newApplicationCategories = [...applicationCategories];
    if (newApplicationCategories[categoryIndex]) {
      newApplicationCategories[categoryIndex] = {
        ...newApplicationCategories[categoryIndex],
        name: value,
      };
      setApplicationCategories(newApplicationCategories);
      setError("");
    }
  };

  const handleChangeApplicationInputType = (categoryIndex, inputType: EventApplicationInputType) => {
    const newApplicationCategories = [...applicationCategories];
    if (newApplicationCategories[categoryIndex]) {
      newApplicationCategories[categoryIndex] = {
        ...newApplicationCategories[categoryIndex],
        inputType,
        options: [],
        name: "",
      };
      setApplicationCategories(newApplicationCategories);
      setError("");
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
    handleChangeApplicationCategoryName,
    handleChangeApplicationInputType,
    handleChangeApplicationName,
    canModifyApplicationCategories,
    orderableType,
    setOrderableType,
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
