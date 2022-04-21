import { useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { COLORS } from "src/modules/constants";
import Col from "../Col";
import Div from "../Div";
import Row from "../Row";
import Spinner from "./Spinner";

export default function NewComment({ currentNftImage, postId, onSuccess, full = false }) {
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
			const res = await apiHelperWithToken(apis.comment.post(postId), "POST", {
				content: newComment,
			});
			if (res.success) {
				onSuccess(res.comment);
				setNewComment("");
			}
			setLoading(false);
		}
	};
	const fullConditionalProps = full ? { sticky: true, bottom0: true, bgWhite: true, py10: true } : {};
	return (
		<Row gapX={0} mt10 {...fullConditionalProps}>
			<Col flex itemsCenter justifyCenter auto pr0>
				<Div imgTag src={currentNftImage} rounded h25 w25 overflowHidden></Div>
			</Col>
			<Col flex itemsCenter justifyCenter cursorPointer>
				<Div wFull roundedLg bgGray200 px15 pt5>
					<ReactTextareaAutosize
						onChange={handleCommentChange}
						onKeyPress={onKeyPress}
						placeholder={placeholder}
						className={"text-sm"}
						value={newComment}
						style={{ boxShadow: "none", border: "none", resize: "none", width: "100%", padding: 0, background: "transparent" }}
					/>
				</Div>
			</Col>
			<Col flex itemsCenter justifyCenter auto pl0 textBase onClick={handlePostComment} cursorPointer>
				{loading ? <Spinner clx={"w-20 h-20"} fill={COLORS.PRIMARY} circleFill={COLORS.GRAY200} /> : "게시"}
			</Col>
		</Row>
	);
}
