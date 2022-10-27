import { useState } from "react";
import useEdittableText from "./useEdittableText";

export default function useLink(uri) {
  const [link, linkHasChanged, handleChangeText] = useEdittableText(uri);
  const [linkError, setLinkError] = useState("");
  const handleClickLink =
    !linkError &&
    (() => {
      window.open(link, "_blank");
    });
  const handleChangeLink = ({ target: { value } }) => {
    const error = getLinkError(value);
    setLinkError(error);
    handleChangeText(value);
  };
  const getLinkError = (value) => {
    if (value.length == 0) {
      return `응모 링크를 작성해주세요.`;
    }
    if (!value.startsWith("https://") && !value.startsWith("http://")) {
      return `링크는 "https://" 또는 "http://"로 시작해야 합니다.`;
    }
    return "";
  };

  return { link, linkHasChanged, linkError, handleChangeLink, handleClickLink };
}
