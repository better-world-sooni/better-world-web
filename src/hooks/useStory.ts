import { useState } from "react";
import useEdittableText from "./useEdittableText";

export enum StoryOwnerType {
    Nft,
    NftCollection
}
export default function useStory(nft_story) {
    const [story, storyHasChanged, handleChangeText] = useEdittableText(nft_story);
    const [storyError, setStoryError] = useState('')

    const handleChangeStory = ({ target: { value } }) => {
        const error = getStoryError(value);
        setStoryError(error)
        handleChangeText(value)
    }
    const getStoryError = (value) => {
		if (new Blob([value]).size > 60000) {
			return "스토리는 60KB 이하여야합니다.";
		}
		return "";
	};

    return {story, storyHasChanged, storyError, handleChangeStory};
};