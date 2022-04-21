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

export default function Post({ post, full = false }) {
	const [liked, setLiked] = useState(post.is_liked);
	const likeOffset = post.is_liked == liked ? 0 : !liked ? -1 : 1;
	const handleClickLike = () => {
		setLiked(!liked);
		const verb = liked ? "DELETE" : "POST";
		apiHelperWithToken(apis.like.post(post.id), verb);
	};
	const handleClickTruncatedContent = () => href(urls.post.postId(post.id));

	return (
		<Div borderB1 pt20 pb20>
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
							<TruncatedMarkdown text={post.content} maxLength={300} onClickTruncated={handleClickTruncatedContent} />
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
			<Div px15>
				<Row mt20 gapX={0} pt10 pb5>
					<Col flex itemsCenter justifyCenter cursorPointer onClick={handleClickLike} auto pr0>
						<Div mr5>{liked ? <HeartIconSolid height={25} width={25} fill={COLORS.DANGER} /> : <HeartIcon height={25} width={25} />}</Div>
						<Div textSm>{`${post.likes_count + likeOffset} likes`}</Div>
					</Col>
					<Col flex itemsCenter justifyStart auto>
						<Div w={(post.comments.length - 1) * 15 + 24} relative h24 mr5>
							{post.comments.map((comment, index) => {
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
				{post.comments[0] && <Comment comment={post.comments[0]} />}
			</Div>
		</Div>
	);
}