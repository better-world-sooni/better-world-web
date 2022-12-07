import { useState } from "react";
import useEdittableText from "./useEdittableText";

export default function useContractAddress(contract_address) {
  const [contractAddress, contractAddressHasChanged, handleChangeText] = useEdittableText(contract_address);
  const [contractAddressError, setContractAddressError] = useState("");

  const handleChangeContractAddress = ({ target: { value } }) => {
    const error = getNameError(value);
    setContractAddressError(error);
    handleChangeText(value);
  };
  const getNameError = (value) => {
    if (!/^0x[a-f0-9]{40}$/.test(value)) {
      return `0x로 시작하는 유효한 주소를 입력해주세요.`;
    }
  };

  return { contractAddress, contractAddressHasChanged, contractAddressError, handleChangeContractAddress };
}
