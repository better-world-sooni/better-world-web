import { useState } from "react";
import { apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import Col from "../Col";
import Div from "../Div";
import Row from "../Row";
import { HeartIcon } from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import { COLORS } from "src/modules/constants";

export default function Comment({ comment }) {
	const [liked, setLiked] = useState(comment.is_liked);
	const handleClickLike = () => {
		setLiked(!liked);
		const verb = liked ? "DELETE" : "POST";
		apiHelperWithToken(apis.like.comment(comment.id), verb);
	};
	return (
		<Row gapX={0} mt10 textBase>
			<Col flex itemsCenter justifyCenter py10 auto pr0>
				<Div imgTag src={comment.nft.nft_metadatum.image_uri} rounded h30 w30 overflowHidden></Div>
			</Col>
			<Col flex itemsCenter justifyCenter py10 cursorPointer auto fontWeight={500}>
				{comment.nft.nft_profile.name || comment.nft.nft_metadatum.name}
			</Col>
			<Col flex itemsCenter py10 cursorPointer>
				{comment.content}
			</Col>
			<Col flex itemsCenter justifyCenter py10 auto pl5 pr20 cursorPointer onClick={handleClickLike}>
				{liked ? <HeartIconSolid height={25} width={25} fill={COLORS.DANGER} /> : <HeartIcon height={25} width={25} />}
			</Col>
		</Row>
	);
}
