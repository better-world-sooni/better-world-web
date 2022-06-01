import apis from "src/modules/apis";
import { apiHelperWithJwtFromContext, apiHelperWithToken } from "src/modules/apiHelper";
import { NextPageContext } from "next";
import WebviewWrapper from "src/components/WebviewWrapper";
import useRefreshContent from "src/hooks/useRefeshContent";
import NftCollection from "src/components/common/NftCollection";

function Index({ nft_collection, currentUser, currentNft }) {
	const refreshQuery = async () => {
		const res = await apiHelperWithToken(apis.nft_collection.contractAddress.profile(nft_collection.contract_address), "GET");
		return res.nft_collection;
	};
	const [cachedContent, refreshContent] = useRefreshContent(nft_collection, refreshQuery);
	return (
		<WebviewWrapper currentNft={currentNft} currentUser={currentUser} onRefresh={refreshContent} backable>
			<NftCollection nft_collection={cachedContent} currentNft={currentNft} />
		</WebviewWrapper>
	);
}

Index.getInitialProps = async (context: NextPageContext) => {
	const { contractAddress } = context.query;
	const res = await apiHelperWithJwtFromContext(context, apis.nft_collection.contractAddress.profile(contractAddress), "GET");
	return res;
};

export default Index;
