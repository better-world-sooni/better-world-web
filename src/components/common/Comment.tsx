import { useEffect, useState } from "react";
import { apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import Col from "../Col";
import Div from "../Div";
import Row from "../Row";
import { HeartIcon } from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import { COLORS, kmoment } from "src/modules/constants";
import { createdAtText } from "src/modules/timeHelper";

export default function Comment({ comment, nested = false, full = false, onClickContent = null, onClickReply = null }) {
	const [liked, setLiked] = useState(comment?.is_liked);
	const likeOffset = comment?.is_liked == liked ? 0 : !liked ? -1 : 1;
	const cachedComments = comment?.comments || [];
	const handleClickLike = () => {
		setLiked(!liked);
		const verb = liked ? "DELETE" : "POST";
		apiHelperWithToken(apis.like.comment(comment?.id), verb);
	};
	const handleClickReply = () => {
		onClickReply(comment);
	};
	useEffect(() => {
		setLiked(comment?.is_liked);
	}, [comment?.is_liked]);
	if (!comment) {
		return null;
	}
	return (
		<Div id={`comment_${comment.id}`} py5>
			<Row gapX={0} mt10 textBase>
				<Col flex itemsCenter justifyCenter auto pr0>
					<Div imgTag src={comment.nft.nft_metadatum.image_uri} rounded h={nested ? 18 : 25} w={nested ? 18 : 25} overflowHidden></Div>
				</Col>
				<Col cursorPointer fontWeight={500}>
					<Div spanTag fontWeight={500} mr10>
						{comment.nft.nft_profile.name || comment.nft.nft_metadatum.name}
					</Div>
					<Div spanTag onClick={onClickContent} fontNormal>
						{comment.content}
					</Div>
				</Col>
				<Col flex itemsCenter justifyCenter auto pl5 pr20 cursorPointer onClick={handleClickLike}>
					{liked ? <HeartIconSolid height={18} width={18} fill={COLORS.DANGER} /> : <HeartIcon height={18} width={18} />}
				</Col>
			</Row>
			{full && (
				<Row gapX={0} textXs textGray400 mt3>
					<Col auto w={nested ? 31 : 38}></Col>
					<Col flex itemsCenter cursorPointer onClick={onClickContent} auto pr0>
						{createdAtText(comment.updated_at)}
					</Col>
					{comment.likes_count + likeOffset > 0 && (
						<Col flex itemsCenter cursorPointer onClick={onClickContent} auto pr0>
							좋아요 {comment.likes_count + likeOffset}개
						</Col>
					)}
					{!nested && (
						<Col flex itemsCenter cursorPointer onClick={handleClickReply} auto>
							{"답글 달기"}
						</Col>
					)}
				</Row>
			)}
			{!nested && (
				<Div ml38>
					{cachedComments.map((comment) => {
						return <Comment key={comment.id} comment={comment} nested full />;
					})}
				</Div>
			)}
		</Div>
	);
}
