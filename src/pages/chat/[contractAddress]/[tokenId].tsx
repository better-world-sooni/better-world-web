import { NextPageContext } from "next";
import { apiHelperWithJwtFromContext, apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";



function ChatRoom() {

}


ChatRoom.getInitialProps = async (context: NextPageContext) => {
	const { contractAddress, tokenId } = context.query;
	const res = await apiHelperWithJwtFromContext(context, apis.nft.contractAddressAndTokenId(contractAddress, tokenId), "GET");
	return res.nft;
};
export default ChatRoom