import Div from "src/components/Div";
import Helmet from "react-helmet";
import Confetti from "src/components/modals/Confetti";
import EmptyBlock from "src/components/EmptyBlock";
import Row from "src/components/Row";
import Col from "src/components/Col";
import { IMAGES } from "src/modules/images";
import { COLORS, truncateKlaytnAddress } from "src/modules/constants";
import MainTopBar from "src/components/MainTopBar";
import { useEffect, useRef, useState } from "react";
import { sha3_256 } from "js-sha3";
import apis from "src/modules/apis";
import { apiHelperWithJwtFromContext, apiHelperWithToken } from "src/modules/apiHelper";
import {
	ChatAltIcon,
	CheckCircleIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	HeartIcon,
	PencilIcon,
	PlusIcon,
	RefreshIcon,
	XIcon,
} from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid, ChatAltIcon as ChatAltIconSolid } from "@heroicons/react/solid";
import { NextPageContext } from "next";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import ImageModal from "src/components/modals/ImageModal";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import { createPresignedUrl, fileChecksum, uploadToPresignedUrl } from "src/modules/fileHelper";
import TextareaAutosize from "react-textarea-autosize";
import { Slide } from "react-slideshow-image";

enum Content {
	Story,
	Feed,
	Capsules,
}
enum NameState {
	Stale,
	Editting,
	Loading,
}
enum StoryState {
	Stale,
	Editting,
	Loading,
}
enum FeedState {
	Stale,
	Editting,
	Loading,
}
function NftCollection({
	follower_count,
	following_count,
	is_following,
	nft_profile,
	nft_metadatum,
	contract_address,
	token_id,
	collection,
	posts,
	currentUser,
	currentNft,
}) {
	const mine = contract_address == currentNft.contract_address && token_id == currentNft.token_id;

	// feed state

	const [feedState, setFeedState] = useState(FeedState.Stale);
	const [following, setFollowing] = useState(is_following);
	const followerOffset = is_following == following ? 0 : !following ? -1 : 1;
	const handleClickFollow = async () => {
		const res = await apiHelperWithToken(apis.follow.contractAddressAndTokenId(contract_address, token_id), "POST");
		if (res.success) {
			setFollowing(!following);
		}
	};
	const handleClickUnfollow = async () => {
		const res = await apiHelperWithToken(apis.follow.contractAddressAndTokenId(contract_address, token_id), "DELETE");
		if (res.success) {
			setFollowing(!following);
		}
	};

	return (
		<Div>
			<Helmet bodyAttributes={{ style: "background-color : rgb(250, 250, 250);" }} />
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Confetti />
			<Div mxAuto maxW={700} px15 bgWhite rounded>
				<Div>
					<EmptyBlock h={20} />
					<Div flex flexRow gapX={20}>
						<Div style={{ flex: 2 }}>
							<Div imgTag src={nft_metadatum?.image_uri} bgGray200 hAuto rounded></Div>
						</Div>
						<Div style={{ flex: 4 }}>
							<Name
								nftProfileName={nft_profile.name}
								nftMetadatumName={nft_metadatum.name}
								currentNft={currentNft}
								contractAddress={contract_address}
								tokenId={token_id}
								mine={mine}
							/>
							<EmptyBlock h={2} />
							<Div textGray600 cursorPointer onClick={() => href(urls.nftCollection.contractAddress(collection.contract_address))}>
								<Div>{nft_metadatum.name}</Div>
							</Div>
							<EmptyBlock h={2} />
							<Row>
								<Col auto>
									<Div spanTag textBase fontWeight={500}>
										{follower_count + followerOffset}
									</Div>{" "}
									<Div spanTag textBase>
										팔로워
									</Div>
								</Col>
								<Col auto>
									<Div spanTag textBase fontWeight={500}>
										{following_count}
									</Div>{" "}
									<Div spanTag textBase>
										팔로잉
									</Div>
								</Col>
							</Row>
						</Div>
					</Div>
					<Div my10 cursorPointer>
						{mine ? (
							<Div flex1 flex justifyCenter px20 py5 rounded border1 onClick={handleClickUnfollow}>
								<Div textBase>새로운 게시물</Div>
							</Div>
						) : following ? (
							<Div flex1 flex justifyCenter px20 py5 rounded border1 onClick={handleClickUnfollow}>
								<Div textBase>언팔로우</Div>
							</Div>
						) : (
							<Div flex1 flex justifyCenter px20 py5 rounded border1 onClick={handleClickFollow}>
								<Div textBase>팔로우</Div>
							</Div>
						)}
					</Div>
					<Story initialStory={nft_profile?.story} contractAddress={contract_address} tokenId={token_id} mine={mine} />
				</Div>
			</Div>
			<Div mxAuto maxW={700} bgWhite>
				<Posts currentNft={currentNft} posts={posts} />
			</Div>
		</Div>
	);
}

function Name({ nftProfileName, nftMetadatumName, contractAddress, tokenId, currentNft, mine }) {
	const initialName = nftProfileName || nftMetadatumName;
	const [name, setName] = useState({
		value: initialName,
		edittingValue: initialName,
		state: NameState.Stale,
		error: "",
	});
	const isValidName = name.error == "" && name.edittingValue != "";
	const handleClickEditName = () => {
		setName({ ...name, state: NameState.Editting });
	};
	const handleEditName = ({ target: { value } }) => {
		const error = getNameError(value);
		setName({ ...name, edittingValue: value, error });
	};
	const handleClickSaveName = async () => {
		if (isValidName) {
			setName({ ...name, state: NameState.Loading });
			try {
				const res = await apiHelperWithToken(apis.nftProfile.contractAddressAndTokenId(contractAddress, tokenId), "PUT", {
					property: "name",
					value: name.edittingValue,
				});
				if (res.success) {
					setName({
						value: res.nft.nft_profile.name,
						edittingValue: res.nft.nft_profile.name,
						state: NameState.Stale,
						error: "",
					});
					return;
				}
				throw new Error();
			} catch {
				setName({ ...name, error: "입력하신 이름으로 업데이트 하지 못하였습니다." });
			}
		}
	};
	const getNameError = (value) => {
		if (value == "") {
			return "이름은 한 글자 이상이어야 합니다.";
		}
		if (value.split(" ").length > 5) {
			return "이름은 다섯 단어 이하여야 합니다.";
		}
		if (value.length > 20) {
			return "이름은 길이는 스무 글자 이하여야 합니다.";
		}
		return "";
	};

	return (
		<Div>
			<Div itemsCenter flex flexRow>
				<Div auto flex1>
					{
						{
							[NameState.Stale]: (
								<Div fontWeight={500} textXl>
									{name.value}
								</Div>
							),
							[NameState.Editting]: (
								<Div fontWeight={500} textXl>
									<input
										placeholder={name.value}
										value={name.edittingValue}
										className={"px-5 w-full focus:outline-none focus:border-gray-400 bg-gray-200 rounded"}
										style={{ height: 40 }}
										onChange={handleEditName}
									></input>
								</Div>
							),
							[NameState.Loading]: <Div fontWeight={500}>{name.value}</Div>,
						}[name.state]
					}
				</Div>
				{mine && (
					<Div pl5>
						{
							{
								[NameState.Stale]: (
									<Div cursorPointer onClick={handleClickEditName}>
										<PencilIcon height={20} width={20} scale={1} strokeWidth={0.5} />
									</Div>
								),
								[NameState.Editting]: (
									<Div cursorPointer textGray200={!isValidName} onClick={handleClickSaveName}>
										<CheckCircleIcon height={20} width={20} scale={1} strokeWidth={0.5} />
									</Div>
								),
								[NameState.Loading]: (
									<Div clx={"animate-spin"}>
										<RefreshIcon height={20} width={20} scale={1} strokeWidth={0.5} className={"-scale-x-100"} />
									</Div>
								),
							}[name.state]
						}
					</Div>
				)}
			</Div>
			{name.state == NameState.Editting && (
				<Div textDanger textSm fontNormal px20 mt5>
					{name.error}
				</Div>
			)}
		</Div>
	);
}

function Story({ initialStory, contractAddress, tokenId, mine }) {
	// story state
	const [story, setStory] = useState({
		value: initialStory,
		edittingValue: initialStory,
		state: StoryState.Stale,
		error: "",
	});
	const isValidStory = story.error == "" && story.edittingValue != "";
	const handleClickEditStory = () => {
		setStory({ ...story, state: StoryState.Editting });
	};
	const handleEditStory = ({ target: { value } }) => {
		const error = getStoryError(value);
		setStory({ ...story, edittingValue: value, error });
	};
	const getStoryError = (value) => {
		if (value == "") {
			return "스토리는 한 글자 이상이어야 합니다.";
		}
		if (new Blob([value]).size > 60000) {
			return "스토리는 60KB 이하여야합니다.";
		}
		return "";
	};
	const handleClickSaveStory = async () => {
		if (isValidStory) {
			setStory({ ...story, state: StoryState.Loading });
			try {
				const res = await apiHelperWithToken(apis.nftProfile.contractAddressAndTokenId(contractAddress, tokenId), "PUT", {
					property: "story",
					value: story.edittingValue,
				});
				if (res.success) {
					setStory({
						value: res.nft.nft_profile.story,
						edittingValue: res.nft.nft_profile.story,
						state: StoryState.Stale,
						error: "",
					});
					return;
				}
				throw new Error();
			} catch {
				setStory({ ...story, error: "스토리를 저장하지 못하였습니다." });
			}
		}
	};
	return (
		<Div mxAuto py20>
			<Div itemsCenter flex flexRow>
				<Div flex1 textLg fontWeight={500}>
					스토리
				</Div>
				{mine && (
					<Div pl5>
						{
							{
								[StoryState.Stale]: (
									<Div cursorPointer onClick={handleClickEditStory}>
										<PencilIcon height={20} width={20} scale={1} strokeWidth={0.5} />
									</Div>
								),
								[StoryState.Editting]: (
									<Div cursorPointer textGray200={!isValidStory} onClick={handleClickSaveStory}>
										<CheckCircleIcon height={20} width={20} scale={1} strokeWidth={0.5} />
									</Div>
								),
								[StoryState.Loading]: (
									<Div clx={"animate-spin"}>
										<RefreshIcon height={20} width={20} scale={1} strokeWidth={0.5} className={"-scale-x-100"} />
									</Div>
								),
							}[story.state]
						}
					</Div>
				)}
			</Div>
			<Div textGray400={!story.value}>
				{
					{
						[StoryState.Stale]: (
							<Div textGray400={!story.value} textBase>
								<ReactMarkdown children={story.value || "스토리가 아직 작성되지 않았습니다."}></ReactMarkdown>
							</Div>
						),
						[StoryState.Editting]: (
							<Div fontWeight={500}>
								<textarea
									placeholder={story.value || "마크다운을 사용하실 수 있습니다."}
									value={story.edittingValue}
									className={"border-gray-200 box-shadow-none w-full focus:border-gray-400"}
									style={{ boxShadow: "none", border: "none" }}
									onChange={handleEditStory}
									rows={10}
								></textarea>
							</Div>
						),
						[StoryState.Loading]: (
							<Div textGray400={!story.value} textBase>
								<ReactMarkdown children={story.value || "스토리가 아직 작성되지 않았습니다."}></ReactMarkdown>
							</Div>
						),
					}[story.state]
				}
			</Div>
		</Div>
	);
}

function Feed({ currentNft, feedState, setFeedState, posts }) {
	if (FeedState.Stale == feedState) {
		return <Posts posts={posts} currentNft={currentNft} />;
	}
	return <NewProposal currentNft={currentNft} feedState={feedState} setFeedState={setFeedState} />;
}
function Posts({ posts, currentNft }) {
	if (posts.length == 0) {
		return (
			<Div textCenter py30>
				아직 업로드가 된 제안서가 없습니다. 처음이 되어 보세요!
			</Div>
		);
	}
	return (
		<Div py20>
			{posts.map((post, index) => {
				return (
					<Div key={index} mb10>
						<Post post={post} currentNft={currentNft} />
					</Div>
				);
			})}
		</Div>
	);
}
function NewProposal({ currentNft, feedState, setFeedState }) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [error, setError] = useState("");
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [previewing, setPreviewing] = useState(false);
	const [expandImageModal, setExpandImageModal] = useState(false);
	const handleContentChange = ({ target: { value } }) => {
		setContent(value);
		setError("");
	};
	const handleTitleChange = ({ target: { value } }) => {
		setTitle(value);
		setError("");
	};
	const handleAddFiles = (e) => {
		const targetFilesLength = e.target.files.length;
		if (!e.target.files || targetFilesLength === 0) {
			return;
		}
		if (selectedFiles.length + targetFilesLength > 8) {
			setError("이미지는 8개 이상 선택하실 수 없습니다.");
			return;
		}
		const additionalFiles = [];
		for (let fileIndex = 0; fileIndex < targetFilesLength; fileIndex++) {
			additionalFiles.push(createFileObject(e.target.files[fileIndex]));
		}
		setError("");
		setSelectedFiles([...selectedFiles, ...additionalFiles]);
	};
	const createFileObject = (file) => {
		const url = URL.createObjectURL(file);
		const fileObject = {
			url,
			file,
			loading: false,
		};
		return fileObject;
	};
	const handleRemoveFile = (index) => {
		const reducedArray = [...selectedFiles];
		reducedArray.splice(index, 1);
		setError("");
		setSelectedFiles(reducedArray);
	};
	const handleClickPreview = () => {
		setPreviewing((prev) => !prev);
	};
	const handleClickImage = () => {
		setExpandImageModal(true);
	};
	const handleCloseModal = () => {
		setExpandImageModal(false);
	};
	const uploadPost = async () => {
		if (!(title || content || selectedFiles.length > 0)) {
			setError("");
			return;
		}
		setFeedState(FeedState.Loading);
		const signedIdArray = await uploadAllSelectedFiles();
		const res = await apiHelperWithToken(apis.post._(), "POST", {
			title,
			content,
			contract_address: currentNft.contract_address,
			token_id: currentNft.token_id,
			images: signedIdArray,
		});
		if (!res) {
			setError("게시물 업로드중 문제가 발생하였습니다.");
			setFeedState(FeedState.Editting);
			return;
		}
		setError("");
		if (location) {
			location.reload();
		} else {
			setFeedState(FeedState.Stale);
		}
	};
	const uploadAllSelectedFiles = async () => {
		try {
			const signedIdArray = await Promise.all(selectedFiles.map((file, index) => uploadFileAtIndex(index)));
			return signedIdArray;
		} catch {
			setError("이미지 업로드중 문제가 발생하였습니다.");
			setSelectedFiles(setAllSelectedFileNotLoading);
			return [];
		}
	};
	const setAllSelectedFileNotLoading = (prevSelectedFiles) => {
		const newSelectedFiles = prevSelectedFiles.map((file) => {
			file.loading = true;
			return file;
		});
		return newSelectedFiles;
	};
	const uploadFileAtIndex = async (index) => {
		setSelectedFiles((prevSelectedFiles) => setSelectedFileLoadingAtIndex(prevSelectedFiles, index, true));
		const res = await upload(selectedFiles[index].file);
		setSelectedFiles((prevSelectedFiles) => setSelectedFileLoadingAtIndex(prevSelectedFiles, index, false));
		return res;
	};
	const setSelectedFileLoadingAtIndex = (prevSelectedFiles, index, bool) => {
		const newSelectedFiles = [...prevSelectedFiles];
		newSelectedFiles[index].loading = bool;
		return newSelectedFiles;
	};
	const upload = async (file) => {
		const checksum = await fileChecksum(file);
		const createPresignedUrlRes = await createPresignedUrl(file.name, file.type, file.size, checksum);
		const uploadToPresignedUrlRes = await uploadToPresignedUrl(createPresignedUrlRes.presigned_url_object, file);
		if (!uploadToPresignedUrlRes) throw new Error();
		return createPresignedUrlRes.presigned_url_object.blob_signed_id;
	};

	return (
		<Div mt20>
			{previewing ? (
				<Post
					post={{
						title,
						content,
						nft: currentNft,
						image_uris: selectedFiles.map((selectedFile) => selectedFile.url),
					}}
					currentNft={currentNft}
				/>
			) : (
				<>
					<Div flex flexRow gapX={20}>
						{selectedFiles.map((fileObject, index) => {
							return (
								<Div key={index} relative roundedXl overflowHidden cursorPointer onClick={() => handleRemoveFile(index)} mb20>
									<Div imgTag src={fileObject.url} w100 h100 objectCover></Div>
									{fileObject.loading ? (
										<Div wFull hFull absolute z10 top0 flex itemsCenter justifyCenter clx={"bg-grayOpacity-100"}>
											<Div clx={"animate-spin"}>
												<RefreshIcon height={30} width={30} strokeWidth={0.5} className={"-scale-x-100"} />
											</Div>
										</Div>
									) : (
										<Div wFull hFull absolute z10 top0 flex itemsCenter justifyCenter clx={"opacity-0 bg-grayOpacity-100 hover:opacity-100"}>
											<XIcon height={30} width={30} strokeWidth={0.5} />
										</Div>
									)}
								</Div>
							);
						})}
					</Div>
					<Div>
						<input
							placeholder="제목"
							value={title}
							className={"rounded-full border-1 px-20 w-full focus:outline-none focus:border-gray-400"}
							style={{ height: 50 }}
							onChange={handleTitleChange}
						></input>
					</Div>
					<EmptyBlock h={20} />
					<Div>
						<textarea
							placeholder="마크다운을 사용하실수 있습니다."
							rows={10}
							value={content}
							className={"rounded-xl border-1 border-gray-200 box-shadow-none py-20 px-20 w-full focus:border-gray-400"}
							style={{ boxShadow: "none" }}
							onChange={handleContentChange}
						></textarea>
					</Div>
				</>
			)}
			<Row mt15>
				<Col>
					<Div clx="file-input rounded-full border-1 px-20 w-full" h50 relative flex itemsCenter justifyCenter>
						이미지 업로드
						<input type={"file"} onChange={handleAddFiles} multiple accept="image/png, image/gif, image/jpeg" className={"cursor-pointer"}></input>
					</Div>
				</Col>
				<Col>
					<Div h50 border1 roundedFull flex itemsCenter justifyCenter cursorPointer onClick={handleClickPreview}>
						<Div spanTag>프리뷰</Div>
					</Div>
				</Col>
				<Col>
					<Div h50 border1 roundedFull flex itemsCenter justifyCenter cursorPointer onClick={uploadPost}>
						<Div spanTag>게시</Div>
					</Div>
				</Col>
			</Row>
			{error && (
				<Div mt20 textDanger textSm>
					{error}
				</Div>
			)}
		</Div>
	);
}

const Post = ({ post, currentNft }) => {
	const [comments, setComments] = useState(post.comments);
	const [expandImageModal, setExpandImageModal] = useState(false);
	const [liked, setLiked] = useState(post.is_liked);
	const likeOffset = post.is_liked == liked ? 0 : !liked ? -1 : 1;
	const handleClickImage = () => {
		setExpandImageModal(true);
	};
	const handleCloseModal = () => {
		setExpandImageModal(false);
	};
	const handleClickLike = () => {
		setLiked(!liked);
		const verb = liked ? "DELETE" : "POST";
		apiHelperWithToken(apis.like.post(post.id), verb);
	};
	const handleNewCommentSuccess = (comment) => {
		setComments([...comments, comment]);
	};

	return (
		<Div borderT1 pt30 pb10>
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
						{post.title}
					</Div>
				)}
				{post.content && (
					<Div mt10 textBase>
						<ReactMarkdown children={post.content}></ReactMarkdown>
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
				<Row mt20 gapX={0} py10>
					<Col flex itemsCenter justifyCenter cursorPointer onClick={handleClickLike} auto pr0>
						<Div mr5>{liked ? <HeartIconSolid height={25} width={25} fill={COLORS.DANGER} /> : <HeartIcon height={25} width={25} />}</Div>
						<Div textSm>{`${post.likes_count + likeOffset} likes`}</Div>
					</Col>
					<Col flex itemsCenter justifyStart auto>
						<Div w={(comments.length - 1) * 15 + 24} relative h24 mr5>
							{comments.map((comment, index) => {
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
				{comments[0] && <Comment comment={comments[0]} />}
				{/* <NewComment currentNft={currentNft} postId={post.id} onSuccess={handleNewCommentSuccess} /> */}
				{post.image_uris.length > 0 && <ImageModal open={expandImageModal} handleCloseModal={handleCloseModal} imgSrcArr={post.image_uris} />}
			</Div>
		</Div>
	);
};

const Comment = ({ comment }) => {
	console.log(comment);
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
};

const NewComment = ({ currentNft, postId, onSuccess }) => {
	const placeholder = "댓글을 적어주세요";
	const [newComment, setNewComment] = useState("");
	const [loading, setLoading] = useState(false);
	const handleCommentChange = ({ target: { value } }) => {
		setNewComment(value);
	};
	const handlePostComment = async () => {
		if (!loading) {
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
	return (
		<Row gapX={0} mt10>
			<Col flex itemsCenter justifyCenter py10 auto pr0>
				<Div imgTag src={currentNft.nft_metadatum.image_uri} roundedFull h35 w35 overflowHidden></Div>
			</Col>
			<Col flex itemsCenter justifyCenter py10 cursorPointer>
				<Div wFull roundedXl bgGray200 px15 pt5>
					<TextareaAutosize
						onChange={handleCommentChange}
						placeholder={placeholder}
						style={{ boxShadow: "none", border: "none", resize: "none", width: "100%", padding: 0, background: "transparent" }}
					/>
				</Div>
			</Col>
			<Col flex itemsCenter justifyCenter py10 auto pl5 pr20 onClick={handlePostComment} cursorPointer>
				{loading ? <LoadingIcon /> : "게시"}
			</Col>
		</Row>
	);
};

const LoadingIcon = () => {
	return (
		<Div clx={"animate-spin"}>
			<RefreshIcon height={30} width={30} strokeWidth={0.5} className={"-scale-x-100"} />
		</Div>
	);
};

NftCollection.getInitialProps = async (context: NextPageContext) => {
	const { contractAddress, tokenId } = context.query;
	const res = await apiHelperWithJwtFromContext(context, apis.nftProfile.contractAddressAndTokenId(contractAddress, tokenId), "GET");
	return res.nft;
};

export default NftCollection;
