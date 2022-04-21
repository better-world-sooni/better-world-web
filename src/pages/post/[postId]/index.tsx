import Div from "src/components/Div";
import Helmet from "react-helmet";
import Confetti from "src/components/modals/Confetti";
import MainTopBar from "src/components/MainTopBar";
import apis from "src/modules/apis";
import { apiHelperWithJwtFromContext } from "src/modules/apiHelper";
import { NextPageContext } from "next";
import Post from "src/components/common/Post";

function Index({ post, currentUser, currentNft }) {
	return (
		<Div>
			<Helmet bodyAttributes={{ style: "background-color : rgb(250, 250, 250);" }} />
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Confetti />
			<Div mxAuto maxW={700} bgWhite>
				<Post post={post} full={true} currentNftImage={currentNft.nft_metadatum.image_uri} />
			</Div>
		</Div>
	);
}

Index.getInitialProps = async (context: NextPageContext) => {
	const { postId } = context.query;
	const res = await apiHelperWithJwtFromContext(context, apis.post.postId._(postId), "GET");
	return res;
};

export default Index;
