import { useEffect, useState } from "react";

export default function useRefreshContent(content, refeshQuery) {
    const [cachedContent, setCachedContent] = useState(content);
	const refreshContent = async () => {
		const res = await refeshQuery();
		setCachedContent(res);
	};
	useEffect(() => {
		setCachedContent(content);
	}, [content]);
    return [cachedContent, refreshContent]
}