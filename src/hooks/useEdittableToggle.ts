import { useEffect, useState } from "react";

export default function useEdittableToggle(initialcheck, lock) {
    const [toggle, setToggle] = useState(initialcheck);
    const textHasChanged = initialcheck !== toggle
    useEffect(() => {
        if (!lock) setToggle(initialcheck);
    }, [initialcheck]);
    const handleChangeToggle= (check) => {
        if (!lock) setToggle(check);
      };
    return [toggle, textHasChanged, handleChangeToggle];
};