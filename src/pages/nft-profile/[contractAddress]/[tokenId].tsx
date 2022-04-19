import Div from "src/components/Div";
import Helmet from "react-helmet";
import Confetti from "src/components/modals/Confetti";
import EmptyBlock from "src/components/EmptyBlock";
import Row from "src/components/Row";
import Col from "src/components/Col";
import { IMAGES } from "src/modules/images";
import { truncateKlaytnAddress } from "src/modules/constants";
import MainTopBar from "src/components/MainTopBar";
import { useEffect, useState } from "react";
import { sha3_256 } from "js-sha3";
import apis from "src/modules/apis";
import { apiHelperWithJwtFromContext, apiHelperWithToken } from "src/modules/apiHelper";
import { BadgeCheckIcon } from "@heroicons/react/solid";
import NftCollectionProfile from "src/components/common/NftCollectionProfile";
import { BellIcon, ChatAltIcon, CheckCircleIcon, HeartIcon, PencilIcon, PlusIcon, RefreshIcon, XCircleIcon, XIcon } from "@heroicons/react/outline";
import { NextPageContext } from "next";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import ImageModal from "src/components/modals/ImageModal";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import { createPresignedUrl, fileChecksum, uploadToPresignedUrl } from "src/modules/fileHelper";

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
function NftCollection({ nft, holder, collection, posts, user }) {
	// content types
	const [contentIndex, setContentIndex] = useState(Content.Story);

	// story state
	const [story, setStory] = useState({
		value: nft?.nft_profile?.story,
		edittingValue: nft?.nft_profile?.story,
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
				const res = await apiHelperWithToken(apis.nftProfile.contractAddressAndTokenId(nft.contract_address, nft.token_id), "PUT", {
					property: "story",
					value: story.edittingValue,
				});
				if (res.success) {
					console.log({
						value: res.nft.nft_profile.story,
						edittingValue: res.nft.nft_profile.story,
						state: StoryState.Stale,
						error: "",
					});
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

	// feed state
	const [feedState, setFeedState] = useState(FeedState.Stale);

	return (
		<Div>
			<Helmet bodyAttributes={{ style: "background-color : white;" }} />
			<MainTopBar user={user} />
			<Confetti />
			<EmptyBlock h={20} />
			<Div px30>
				<Div mxAuto maxW={1100} px10>
					<Row flex py20>
						<Col auto>
							<Div w300>
								<NftCard nft={nft} holder={holder} user={user} />
								<EmptyBlock h={20} />
								<Div roundedXl px20 py20 border1 cursorPointer onClick={() => href(urls.nftCollection.contractAddress(collection.contract_address))}>
									<Div fontWeight={500}>컬렉션</Div>
									<Row itemsCenter flex mt10>
										<Col auto pr0>
											<Div imgTag src={collection.image_uri} h40 w40 roundedFull></Div>
										</Col>
										<Col>
											<Div>{collection.name}</Div>
										</Col>
									</Row>
								</Div>
							</Div>
						</Col>
						<Col>
							<Row>
								<Col auto px5>
									<Div h50 roundedFull px20 flex itemsCenter justifyCenter border1 cursorPointer onClick={() => setContentIndex(Content.Feed)}>
										<Div textCenter>Feed</Div>
									</Div>
								</Col>
								<Col auto px5>
									<Div h50 roundedFull px20 flex itemsCenter justifyCenter border1 cursorPointer onClick={() => setContentIndex(Content.Capsules)}>
										<Div textCenter>Capsules</Div>
									</Div>
								</Col>
								<Col auto pr5>
									<Div h50 roundedFull px20 flex itemsCenter justifyCenter border1 cursorPointer onClick={() => setContentIndex(Content.Story)}>
										<Div textCenter>Story</Div>
									</Div>
								</Col>
								<Col></Col>
								<Col auto>
									{
										{
											[Content.Story]: (
												<Div>
													{
														{
															[StoryState.Stale]: (
																<Div h50 roundedFull px20 flex itemsCenter justifyCenter border1 cursorPointer onClick={handleClickEditStory}>
																	<PencilIcon height={20} width={20} scale={1} strokeWidth={0.5} />
																</Div>
															),
															[StoryState.Editting]: (
																<Div
																	h50
																	roundedFull
																	px20
																	flex
																	itemsCenter
																	justifyCenter
																	border1
																	cursorPointer
																	textGray200={!isValidStory}
																	onClick={handleClickSaveStory}
																>
																	<CheckCircleIcon height={20} width={20} scale={1} strokeWidth={0.5} />
																</Div>
															),
															[StoryState.Loading]: (
																<Div h50 roundedFull px20 flex itemsCenter justifyCenter border1>
																	<Div clx={"animate-spin"}>
																		<RefreshIcon height={20} width={20} scale={1} strokeWidth={0.5} className={"-scale-x-100"} />
																	</Div>
																</Div>
															),
														}[story.state]
													}
												</Div>
											),
											[Content.Feed]: (
												<Div>
													{
														{
															[FeedState.Stale]: (
																<Div
																	h50
																	roundedFull
																	px20
																	flex
																	itemsCenter
																	justifyCenter
																	border1
																	cursorPointer
																	onClick={() => setFeedState(FeedState.Editting)}
																>
																	<PlusIcon height={20} width={20} scale={1} strokeWidth={0.5} />
																</Div>
															),
															[FeedState.Editting]: (
																<Div
																	h50
																	roundedFull
																	px20
																	flex
																	itemsCenter
																	justifyCenter
																	border1
																	cursorPointer
																	onClick={() => setFeedState(FeedState.Stale)}
																>
																	<XIcon height={20} width={20} scale={1} strokeWidth={0.5} />
																</Div>
															),
															[FeedState.Loading]: (
																<Div h50 roundedFull px20 flex itemsCenter justifyCenter border1>
																	<Div clx={"animate-spin"}>
																		<RefreshIcon height={20} width={20} scale={1} strokeWidth={0.5} className={"-scale-x-100"} />
																	</Div>
																</Div>
															),
														}[feedState]
													}
												</Div>
											),
										}[contentIndex]
									}
								</Col>
							</Row>
							<Div>
								{
									{
										[Content.Story]: <Story story={story} handleEditStory={handleEditStory} />,
										[Content.Feed]: (
											<Feed nft={nft} posts={posts} feedState={feedState} setFeedState={setFeedState} user={user} collection={collection} />
										),
									}[contentIndex]
								}
							</Div>
						</Col>
					</Row>
				</Div>
			</Div>
		</Div>
	);
}

function NftCard({ nft, holder, user }) {
	const initialName = nft?.nft_profile?.name || nft.nft_metadatum?.name;
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
				const res = await apiHelperWithToken(apis.nftProfile.contractAddressAndTokenId(nft.contract_address, nft.token_id), "PUT", {
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
		<Div border1 roundedXl overflowHidden pb20>
			<Div imgTag src={nft.nft_metadatum?.image_uri} bgGray200 hAuto></Div>
			<Row itemsCenter mt20 px20>
				<Col>
					{
						{
							[NameState.Stale]: <Div fontWeight={500}>{name.value}</Div>,
							[NameState.Editting]: (
								<Div fontWeight={500}>
									<input
										placeholder={name.value}
										value={name.edittingValue}
										className={"px-5 w-full focus:outline-none focus:border-gray-400 bg-gray-200 rounded"}
										style={{ height: 30 }}
										onChange={handleEditName}
									></input>
								</Div>
							),
							[NameState.Loading]: <Div fontWeight={500}>{name.value}</Div>,
						}[name.state]
					}
				</Col>
				{holder?.uuid == user.uuid && (
					<Col auto>
						<Div>
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
					</Col>
				)}
			</Row>
			{name.state == NameState.Editting && (
				<Div textDanger textSm fontNormal px20 mt5>
					{name.error}
				</Div>
			)}
		</Div>
	);
}

function Story({ story, handleEditStory }) {
	return (
		<Div mxAuto maxW={1100} flex flexRow my20>
			<Div roundedXl border1 px20 py20 wFull>
				{
					{
						[StoryState.Stale]: (
							<Div textGray400={!story.value}>
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
									rows={10}
									onChange={handleEditStory}
								></textarea>
							</Div>
						),
						[StoryState.Loading]: (
							<Div textGray400={!story.value}>
								<ReactMarkdown children={story.value || "스토리가 아직 작성되지 않았습니다."}></ReactMarkdown>
							</Div>
						),
					}[story.state]
				}
			</Div>
		</Div>
	);
}
function Feed({ nft, feedState, setFeedState, posts, user, collection }) {
	if (FeedState.Stale == feedState) {
		return <Posts posts={posts} />;
	}
	return <NewProposal nft={nft} feedState={feedState} setFeedState={setFeedState} user={user} collection={collection} />;
}
function Posts({ posts }) {
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
					<Div key={index} mb20>
						<Post post={post} />
					</Div>
				);
			})}
		</Div>
	);
}
function NewProposal({ nft, feedState, setFeedState, user, collection }) {
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
			contract_address: nft.contract_address,
			token_id: nft.token_id,
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
						nft,
						image_uris: selectedFiles.map((selectedFile) => selectedFile.url),
					}}
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

const Post = ({ post, preview = false }) => {
	const [expandImageModal, setExpandImageModal] = useState(false);
	const handleClickImage = () => {
		setExpandImageModal(true);
	};
	const handleCloseModal = () => {
		setExpandImageModal(false);
	};
	const handleClickLike = () => {
		setExpandImageModal(false);
	};
	return (
		<Div roundedXl border1 pt20 pb10 px20>
			<Row flex itemsCenter>
				<Col auto>
					<Div imgTag src={post.nft.nft_metadatum.image_uri} h30 w30 roundedFull></Div>
				</Col>
				<Col auto pl0>
					{truncateKlaytnAddress(post.nft.nft_profile?.name || post.nft.nft_metadatum.name)}
				</Col>
				<Col auto></Col>
				<Col />
			</Row>
			{post.title && (
				<Div textXl fontWeight={500} pt20>
					{post.title}
				</Div>
			)}
			{post.content && (
				<Div pt10>
					<ReactMarkdown children={post.content}></ReactMarkdown>
				</Div>
			)}
			<Div wFull hAuto flex flexRow itemsCenter overflowXScroll gapX={20} pt20 onClick={handleClickImage}>
				{post.image_uris.length == 1 ? (
					<Div imgTag mxAuto src={post.image_uris[0]} w300 h300 roundedXl objectCover />
				) : (
					post.image_uris.map((image_uri, index) => {
						return <Div key={index} imgTag src={image_uri} w300 h300 roundedXl objectCover />;
					})
				)}
			</Div>
			{preview && (
				<Row borderT1 pt10 mt20 gapX={0}>
					<Col flex itemsCenter justifyCenter borderR1 py10>
						<Div>
							<HeartIcon height={20} width={20} />
						</Div>
					</Col>
					<Col flex itemsCenter justifyCenter py10>
						<Div strokeWidth={0.5}>
							<ChatAltIcon height={20} width={20} />
						</Div>
					</Col>
				</Row>
			)}
			{!preview && (
				<Row borderT1 pt10 mt20 gapX={0}>
					<Col flex itemsCenter justifyCenter borderR1 py10>
						<Div>
							<HeartIcon height={20} width={20} />
						</Div>
					</Col>
					<Col flex itemsCenter justifyCenter py10>
						<Div strokeWidth={0.5}>
							<ChatAltIcon height={20} width={20} />
						</Div>
					</Col>
				</Row>
			)}
			{post.image_uris.length > 0 && <ImageModal open={expandImageModal} handleCloseModal={handleCloseModal} imgSrcArr={post.image_uris} />}
		</Div>
	);
};

NftCollection.getInitialProps = async (context: NextPageContext) => {
	const { contractAddress, tokenId } = context.query;
	const res = await apiHelperWithJwtFromContext(context, apis.nftProfile.contractAddressAndTokenId(contractAddress, tokenId), "GET");
	return {
		nft: res.nft,
		holder: {
			...res.holder,
		},
		posts: res.posts,
		collection: res.collection,
	};
};

export default NftCollection;
