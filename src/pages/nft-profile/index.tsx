import apis from "src/modules/apis";
import { apiHelperWithJwtFromContext, apiHelperWithToken } from "src/modules/apiHelper";
import { NextPageContext } from "next";
import NftProfile from "src/components/common/NftProfile";
import WebviewWrapper from "src/components/WebviewWrapper";
import useRefreshContent from "src/hooks/useRefeshContent";

function Index({ nft, currentUser, currentNft }) {
	const refreshQuery = async () => {
		const res = await apiHelperWithToken(apis.nft._(), "GET");
		return res.nft;
	};
	const [cachedContent, refreshContent] = useRefreshContent(nft, refreshQuery);
	return (
		<WebviewWrapper currentNft={currentNft} currentUser={currentUser} onRefresh={refreshContent} messageable>
			<NftProfile nft={cachedContent} currentNft={currentNft} />
		</WebviewWrapper>
	);
}

Index.getInitialProps = async (context: NextPageContext) => {
	const res = await apiHelperWithJwtFromContext(context, apis.nft._(), "GET");
	return res;
};

export default Index;
