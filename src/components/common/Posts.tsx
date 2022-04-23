import Div from "../Div";
import Post from "./Post";

export default function Posts({ posts, currentNftImage }) {
	if (posts.length == 0) {
		return (
			<Div textCenter py30 textBase>
				아직 게시물이 없습니다.
			</Div>
		);
	}
	return (
		<Div>
			{posts.map((post, index, array) => {
				return (
					<Div key={index} mb10>
						<Post post={post} currentNftImage={currentNftImage} index={index} length={array.length} />
					</Div>
				);
			})}
		</Div>
	);
}
