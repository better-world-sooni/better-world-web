import { apiHelperWithJwtFromContext, apiHelperWithToken } from "src/modules/apiHelper";
import { NextPageContext } from "next";
import apis from "src/modules/apis";
import Posts from "src/components/common/Posts";
import WebviewWrapper from "src/components/WebviewWrapper";
import useRefreshContent from "src/hooks/useRefeshContent";
import ActiveCapsules from "src/components/common/ActiveCapsules";

function Index({ currentUser, currentNft, feed, active_capsules }) {
	const refreshQuery = async () => {
		const res = await apiHelperWithToken(apis.feed._(), "GET");
		return res;
	};
	const [cachedContent, refreshContent] = useRefreshContent({ feed, active_capsules }, refreshQuery);
	return (
		<WebviewWrapper currentNft={currentNft} currentUser={currentUser} onRefresh={refreshContent} messageable>
			<ActiveCapsules capsule_owners={cachedContent.active_capsules} currentNft={currentNft} />
			<Posts posts={cachedContent.feed} currentNftImage={currentNft.nft_metadatum.image_uri} />
		</WebviewWrapper>
	);
}



Index.getInitialProps = async (context: NextPageContext) => {
	const res = await apiHelperWithJwtFromContext(context, apis.feed._(), "GET");
	return res;
};
export default Index;
