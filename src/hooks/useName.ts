import { useState } from "react";
import useEdittableText from "./useEdittableText";

export enum NameOwnerType {
  Nft,
  NftCollection,
}
export default function useName(nft_name, split = 5, length = 20) {
  const [name, nameHasChanged, handleChangeText] = useEdittableText(nft_name);
  const [nameError, setNameError] = useState("");

  const handleChangeName = ({ target: { value } }) => {
    const error = getNameError(value);
    setNameError(error);
    handleChangeText(value);
  };
  const getNameError = (value) => {
    if (value.split(" ").length > split) {
      return `이름은 ${split}단어 이하여야 합니다.`;
    }
    if (value.length > length) {
      return `이름의 길이는 ${length}글자 미만이어야 합니다.`;
    }
    return "";
  };

  return { name, nameHasChanged, nameError, handleChangeName };
}
