import { useState } from "react";
import useEdittableText from "./useEdittableText";

export default function useLink(uri, options = { canBlank: false, canMailTo: false }) {
  const [link, linkHasChanged, handleChangeText] = useEdittableText(uri);
  const [linkError, setLinkError] = useState("");
  const canBlank = options.canBlank;
  const canMailTo = options.canMailTo;
  const handleClickLink =
    !linkError &&
    link != "" &&
    (() => {
      window.open(link, "_blank");
    });
  const handleChangeLink = ({ target: { value } }) => {
    const error = getLinkError(value);
    setLinkError(error);
    handleChangeText(value);
  };
  const getLinkError = (value) => {
    if (!canBlank && value.length == 0) {
      return `링크를 작성해주세요.`;
    }
    if (canBlank && value.length == 0) {
      return "";
    }
    if (!(value.startsWith("https://") || value.startsWith("http://") || (canMailTo && value.startsWith("mailto:")))) {
      return canMailTo ? `링크는 "https://", "http://" 또는 "mailto:"로 시작해야 합니다.` : `링크는 "https://" 또는 "http://"로 시작해야 합니다.`;
    }
    return "";
  };

  return { link, linkHasChanged, linkError, handleChangeLink, handleClickLink };
}
