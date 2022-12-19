import { useState } from "react";
import { EventBannerModalState } from "src/components/admin/EventBannerModal";
import { uploadEventBanner } from "./queries/admin/events";
import useLink from "./useLink";

export default function useUploadEventBanner({ queryClient, uploadSuccessCallback = null, drawEvent = null, state, lineLimit = 40, eventBanner }) {
  const { link, linkError, handleChangeLink, handleClickLink } = useLink(
    state == EventBannerModalState.MODIFY && eventBanner?.banner_uri != "" ? eventBanner?.banner_uri : "",
    false
  );
  const [description, setDescription] = useState(state == EventBannerModalState.MODIFY ? eventBanner.description : "");
  const [descriptionError, setDescriptionError] = useState("");
  const { isLoading: loading, mutate } = uploadEventBanner(queryClient, uploadSuccessCallback, state == EventBannerModalState.MODIFY ? "PUT" : "POST");
  const handleChangeDescription = ({ target: { value } }) => {
    const lines = value.split("\n");
    if (lines.length > 2) {
      setDescriptionError("문구는 최대 2줄까지 작성 가능합니다.");
      return;
    }
    for (var i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.length > lineLimit) {
        setDescriptionError("문구는 한 줄 당 " + lineLimit + "자까지 작성 가능합니다.");
        return;
      }
    }
    setDescription(value);
    setError("");
    setDescriptionError("");
  };
  const markdownDescription = description.replace("\n", "\n\n");
  const [error, setError] = useState("");

  const UploadEventBanner = async () => {
    if (loading) return;
    if (description == "") {
      setError("올바른 문구를 작성해주세요.");
      return;
    }
    if (state == EventBannerModalState.ADD_BY_LINK && (linkError != "" || link == "")) {
      setError("올바른 링크를 작성해주세요.");
      return;
    }

    const body = {
      draw_event_id:
        state == EventBannerModalState.ADD_BY_DRAW_EVENT_ID || (state == EventBannerModalState.MODIFY && drawEvent) ? (drawEvent ? drawEvent.id : null) : null,
      banner_uri: state == EventBannerModalState.ADD_BY_LINK || (state == EventBannerModalState.MODIFY && eventBanner?.banner_uri) ? link : null,
      description: description,
    };
    const modifiedBody = { ...body, event_banner_id: eventBanner?.id };
    mutate(state == EventBannerModalState.MODIFY ? modifiedBody : body);
  };

  return {
    loading,
    link,
    linkError,
    handleChangeLink: ({ target: { value } }) => {
      setError("");
      handleChangeLink({ target: { value } });
    },
    handleClickLink,
    description,
    markdownDescription,
    handleChangeDescription,
    descriptionError,
    error,
    uploadEventBanner: UploadEventBanner,
  };
}
