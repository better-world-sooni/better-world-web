import Div from "src/components/Div";
import MainTopBar from "src/components/MainTopBar";
import NewPost from "src/components/common/NewPost";
import { apiHelperWithJwtFromContext } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { NextPageContext } from "next";

function ContractAddress({ currentUser, currentNft, nft_collection }) {
	return (
		<>
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Div mxAuto maxW={650} bgWhite rounded>
				<NewPost currentNft={currentNft} nftCollection={nft_collection} />
			</Div>
		</>
	);
}

ContractAddress.getInitialProps = async (context: NextPageContext) => {
	const { contractAddress } = context.query;
	const res = await apiHelperWithJwtFromContext(context, apis.nft_collection.contractAddress._(contractAddress), "GET");
	return res;
};

export default ContractAddress;
