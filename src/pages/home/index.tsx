import Div from "src/components/Div";
import MainTopBar from "src/components/MainTopBar";
import NewPost from "src/components/common/NewPost";
import { apiHelperWithJwtFromContext } from "src/modules/apiHelper";
import { NextPageContext } from "next";
import apis from "src/modules/apis";
import Posts from "src/components/common/Posts";

function Index({ currentUser, currentNft, feed }) {
	return (
		<>
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Div mxAuto maxW={650} bgWhite rounded>
				<Posts posts={feed} currentNftImage={currentNft.nft_metadatum.image_uri} />
			</Div>
		</>
	);
}

Index.getInitialProps = async (context: NextPageContext) => {
	const res = await apiHelperWithJwtFromContext(context, apis.feed._(), "GET");
	return res;
};
export default Index;
