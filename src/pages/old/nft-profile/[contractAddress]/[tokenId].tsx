import apis from "src/modules/apis";
import { apiHelperWithJwtFromContext, apiHelperWithToken } from "src/modules/apiHelper";
import { NextPageContext } from "next";
import NftProfile from "src/components/common/NftProfile";
import WebviewWrapper from "src/components/WebviewWrapper";
import useRefreshContent from "src/hooks/useRefeshContent";

function Index({ nft, currentUser, currentNft }) {
	const refreshQuery = async () => {
		const res = await apiHelperWithToken(apis.nft.contractAddressAndTokenId(nft.contract_address, nft.token_id), "GET");
		return res.nft;
	};
	const [cachedContent, refreshContent] = useRefreshContent(nft, refreshQuery);
	return (
		<WebviewWrapper currentNft={currentNft} currentUser={currentUser} onRefresh={refreshContent} backable>
			<NftProfile nft={cachedContent} currentNft={currentNft} />
		</WebviewWrapper>
	);
}

Index.getInitialProps = async (context: NextPageContext) => {
	const { contractAddress, tokenId } = context.query;
	const res = await apiHelperWithJwtFromContext(context, apis.nft.contractAddressAndTokenId(contractAddress, tokenId), "GET");
	return res;
};

export default Index;
