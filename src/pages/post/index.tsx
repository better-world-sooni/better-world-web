import Div from "src/components/Div";
import MainTopBar from "src/components/MainTopBar";
import NewPost from "src/components/common/NewPost";

function Index({ currentUser, currentNft }) {
	return (
		<>
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Div mxAuto maxW={700} bgWhite rounded>
				<NewPost currentNft={currentNft} />
			</Div>
		</>
	);
}

export default Index;
