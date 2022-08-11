import { useState } from "react";
import useEdittableText from "./useEdittableText";

export enum NameOwnerType {
    Nft,
    NftCollection
}
export default function useName(nft_name) {
    const [name, nameHasChanged, handleChangeText] = useEdittableText(nft_name);
    const [nameError, setNameError] = useState('')

    const handleChangeName = ({ target: { value } }) => {
        const error = getNameError(value);
        setNameError(error)
        handleChangeText(value)
    }
    const getNameError = (value) => {
		if (value.split(" ").length > 5) {
			return "이름은 다섯 단어 이하여야 합니다.";
		}
		if (value.length > 19) {
			return "이름은 길이는 스무 글자 미만여야 합니다.";
		}
		return "";
	};

    return {name, nameHasChanged, nameError, handleChangeName};
};