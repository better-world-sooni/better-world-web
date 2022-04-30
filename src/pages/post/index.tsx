import Div from "src/components/Div";
import NewPost from "src/components/common/NewPost";
import WebviewWrapper from "src/components/WebviewWrapper";

function Index({ currentUser, currentNft }) {
	return (
		<WebviewWrapper currentNft={currentNft} currentUser={currentUser} pullable={false} backable>
			<NewPost currentNft={currentNft} />
		</WebviewWrapper>
	);
}

export default Index;
