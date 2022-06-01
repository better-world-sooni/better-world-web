import Div from "src/components/Div";
import Confetti from "src/components/modals/Confetti";
import MainTopBar from "src/components/MainTopBar";
import apis from "src/modules/apis";
import { apiHelperWithJwtFromContext, apiHelperWithToken } from "src/modules/apiHelper";
import { NextPageContext } from "next";
import Post from "src/components/common/Post";
import useIsTablet from "src/hooks/useIsTablet";
import useRefreshContent from "src/hooks/useRefeshContent";
import WebviewWrapper from "src/components/WebviewWrapper";

function Index({ post, currentUser, currentNft }) {
	const refreshQuery = async () => {
		const res = await apiHelperWithToken(apis.post.postId._(post.id), "GET");
		return res.post;
	};
	const [cachedContent, refreshContent] = useRefreshContent(post, refreshQuery);
	return (
		<WebviewWrapper currentNft={currentNft} currentUser={currentUser} onRefresh={refreshContent} backable>
			<Post post={cachedContent} full={true} currentNftImage={currentNft.nft_metadatum.image_uri} index={0} length={1} />
		</WebviewWrapper>
	);
}

Index.getInitialProps = async (context: NextPageContext) => {
	const { postId } = context.query;
	const res = await apiHelperWithJwtFromContext(context, apis.post.postId._(postId), "GET");
	return res;
};

export default Index;
