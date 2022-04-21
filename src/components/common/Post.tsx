import { useState } from "react";
import { apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { COLORS, truncateKlaytnAddress } from "src/modules/constants";
import ReactMarkdown from "react-markdown";
import { Slide } from "react-slideshow-image";
import Col from "../Col";
import Div from "../Div";
import Row from "../Row";
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import Comment from "./Comment";
import TruncatedText from "src/components/common/TruncatedText";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import TruncatedMarkdown from "./TruncatedMarkdown";
import NewComment from "./NewComment";
import EmptyBlock from "../EmptyBlock";

export default function Post({ post, full = false, currentNftImage }) {
	const [liked, setLiked] = useState(post.is_liked);
	const [cachedComments, setCachedComments] = useState(post.comments || []);
	const [replyComment, setReplyComment] = useState(null);
	const likeOffset = post.is_liked == liked ? 0 : !liked ? -1 : 1;
	const handleClickLike = () => {
		setLiked(!liked);
		const verb = liked ? "DELETE" : "POST";
		apiHelperWithToken(apis.like.post(post.id), verb);
	};
	const hrefToPostId = () => href(urls.post.postId(post.id));
	const hrefToPostIdComments = () => href(urls.post.postId(post.id, "#comments"));
	const hrefToPostIdHottestComment = () => href(urls.post.postId(post.id, `#comments_${cachedComments[0]?.id}`));
	const handleNewCommentSuccess = (newComment, repliedComment) => {
		if (repliedComment) {
			const updatedCommentIndex = cachedComments.findIndex((comment) => {
				return comment.id == repliedComment.id;
			});
			const commentsOfRepliedComment = cachedComments[updatedCommentIndex].comments || [];
			commentsOfRepliedComment.push(newComment);
			const newRepliedComment = { ...repliedComment, comments: commentsOfRepliedComment };
			const newCachedComments = cachedComments.slice(0, updatedCommentIndex).concat(newRepliedComment, cachedComments.slice(updatedCommentIndex + 1));
			setCachedComments(newCachedComments);
			setReplyComment(null);
			return;
		}
		setCachedComments([...cachedComments, newComment]);
	};

	const displayNewComment = cachedComments.length == 0 || full;

	return (
		<>
			<Div borderB1 pt20 pb20={!displayNewComment} id={`post_${post.id}`}>
				<Div px15>
					<Row flex itemsCenter pb10>
						<Col auto>
							<Div imgTag src={post.nft.nft_metadatum.image_uri} h30 w30 rounded></Div>
						</Col>
						<Col auto pl0>
							{truncateKlaytnAddress(post.nft.nft_profile?.name || post.nft.nft_metadatum.name)}
						</Col>
						<Col auto></Col>
						<Col />
					</Row>
					{post.title && (
						<Div textXl fontWeight={500} mt10>
							{TruncatedText({ text: post.title, maxLength: 50 })}
						</Div>
					)}
					{post.content && (
						<Div mt10 textBase>
							{full ? (
								<ReactMarkdown children={post.content}></ReactMarkdown>
							) : (
								<TruncatedMarkdown text={post.content} maxLength={300} onClickTruncated={hrefToPostId} />
							)}
						</Div>
					)}
				</Div>
				{post.image_uris.length > 0 && (
					<Div wFull h400 clx={"slide-container"} mt10>
						<Slide
							transitionDuration={200}
							autoplay={false}
							prevArrow={
								<Div clx="nav default-nav" px5>
									<ChevronLeftIcon height={30} width={30} stroke={"black"} />
								</Div>
							}
							nextArrow={
								<Div clx="nav default-nav" px5>
									<ChevronRightIcon height={30} width={30} stroke={"black"} />
								</Div>
							}
						>
							{post.image_uris.map((image_uri, index) => {
								return (
									<div key={index}>
										<div
											style={{
												backgroundImage: `url(${image_uri})`,
												backgroundSize: "cover",
												backgroundPositionX: "center",
												backgroundPositionY: "center",
												border: "none",
												height: 400,
											}}
										></div>
									</div>
								);
							})}
						</Slide>
					</Div>
				)}
				<Div px15 mb5={displayNewComment}>
					<Row mt20 gapX={0} pt10 mb5={cachedComments[0]}>
						<Col flex itemsCenter justifyCenter cursorPointer onClick={handleClickLike} auto pr0>
							<Div mr5>{liked ? <HeartIconSolid height={25} width={25} fill={COLORS.DANGER} /> : <HeartIcon height={25} width={25} />}</Div>
							<Div textSm>{`${post.likes_count + likeOffset} likes`}</Div>
						</Col>
						<Col flex itemsCenter justifyStart auto onClick={hrefToPostIdComments} cursorPointer>
							<Div w={(cachedComments.slice(0, 3).length - 1) * 15 + 24} relative h24 mr5>
								{cachedComments.slice(0, 3).map((comment, index) => {
									return (
										<Div
											key={comment.id}
											imgTag
											src={comment.nft.nft_metadatum.image_uri}
											roundedFull
											h24
											w24
											absolute
											top0
											left={index * 15}
											border2
											borderWhite
										></Div>
									);
								})}
							</Div>
							<Div textSm>{`${post.comments_count} replies`}</Div>
						</Col>
						<Col></Col>
					</Row>
					<Div id={`comments`}>
						{!full && <Comment full={full} comment={cachedComments[0]} onClickContent={hrefToPostIdHottestComment} />}
						{full &&
							cachedComments
								.sort((a, b) => parseFloat(b.id) - parseFloat(a.id))
								.map((comment) => {
									return <Comment full={full} key={comment.id} comment={comment} onClickReply={setReplyComment} />;
								})}
					</Div>
				</Div>
				{displayNewComment && (
					<>
						<EmptyBlock h={10} />
						<NewComment
							currentNftImage={currentNftImage}
							postId={post.id}
							replyComment={replyComment}
							onSuccess={handleNewCommentSuccess}
							onClickExitReply={() => setReplyComment(null)}
							full={full}
						/>
					</>
				)}
			</Div>
		</>
	);
}
