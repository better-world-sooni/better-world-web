import Div from "src/components/Div";
import Confetti from "src/components/modals/Confetti";
import MainTopBar from "src/components/MainTopBar";
import apis from "src/modules/apis";
import { apiHelperWithJwtFromContext } from "src/modules/apiHelper";
import { NextPageContext } from "next";
import Post from "src/components/common/Post";
import useIsTablet from "src/hooks/useIsTablet";

function Index({ post, currentUser, currentNft }) {
	const isTablet = useIsTablet();
	return (
		<>
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Div mxAuto maxW={650} bgWhite rounded={!isTablet}>
				<Post post={post} full={true} currentNftImage={currentNft.nft_metadatum.image_uri} index={0} length={1} />
			</Div>
		</>
	);
}

Index.getInitialProps = async (context: NextPageContext) => {
	const { postId } = context.query;
	const res = await apiHelperWithJwtFromContext(context, apis.post.postId._(postId), "GET");
	return res;
};

export default Index;
