import { XIcon } from "@heroicons/react/outline";
import { useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { COLORS } from "src/modules/constants";
import Col from "../Col";
import Div from "../Div";
import EmptyBlock from "../EmptyBlock";
import Row from "../Row";
import Spinner from "./Spinner";

export default function NewComment({ currentNftImage, postId, onSuccess, full = false, replyComment, onClickExitReply }) {
	const placeholder = "댓글을 적어주세요";
	const [newComment, setNewComment] = useState("");
	const [loading, setLoading] = useState(false);
	const handleCommentChange = ({ target: { value } }) => {
		setNewComment(value);
	};
	const onKeyPress = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handlePostComment();
		}
	};
	const handlePostComment = async () => {
		if (!loading && newComment) {
			setLoading(true);
			const endpoint = replyComment ? apis.comment.comment(replyComment.id) : apis.comment.post(postId);
			const res = await apiHelperWithToken(endpoint, "POST", {
				content: newComment,
			});
			if (res.success) {
				onSuccess(res.comment, replyComment);
				setNewComment("");
			}
			setLoading(false);
		}
	};
	const fullConditionalProps = full ? { sticky: true, bottom0: true, bgWhite: true, pt10: true } : {};
	return (
		<Div {...fullConditionalProps}>
			{replyComment && (
				<Div flex flexRow itemsCenter py5 borderT1>
					<Div textBase onClick={onClickExitReply} cursorPointer w40></Div>
					<Div textBase flex1 textCenter>{`${replyComment.nft.name || replyComment.nft.nft_metadatum.name} 에게 답변`}</Div>
					<Div textBase onClick={onClickExitReply} cursorPointer w40>
						<Div px10>
							<XIcon height={20} width={20} />
						</Div>
					</Div>
				</Div>
			)}
			<Row gapX={0} px15={!full} mx0={full} flexRow flex itemsCenter>
				<Col flex itemsCenter justifyCenter auto pr0>
					<Div imgTag src={currentNftImage} rounded h25 w25 overflowHidden></Div>
				</Col>
				<Col flex itemsCenter justifyCenter cursorPointer>
					<Div wFull roundedLg bgGray200 px15>
						<ReactTextareaAutosize
							onChange={handleCommentChange}
							onKeyPress={onKeyPress}
							placeholder={placeholder}
							className={"text-sm"}
							value={newComment}
							style={{
								boxShadow: "none",
								border: "none",
								resize: "none",
								width: "100%",
								padding: 0,
								background: "transparent",
								height: 25,
								display: "flex",
								lineHeight: 2.5,
							}}
						/>
					</Div>
				</Col>
				<Col flex itemsCenter justifyCenter auto pl0 textBase onClick={handlePostComment} cursorPointer textSm>
					{loading ? <Spinner clx={"w-20 h-20"} fill={COLORS.BW} circleFill={COLORS.GRAY200} /> : "게시"}
				</Col>
			</Row>
		</Div>
	);
}
