import Div from "src/components/Div";
import Helmet from "react-helmet";
import Confetti from "src/components/modals/Confetti";
import EmptyBlock from "src/components/EmptyBlock";
import Row from "src/components/Row";
import Col from "src/components/Col";
import { COLORS, truncateKlaytnAddress } from "src/modules/constants";
import MainTopBar from "src/components/MainTopBar";
import { useEffect, useState } from "react";
import apis from "src/modules/apis";
import { apiHelperWithJwtFromContext, apiHelperWithToken } from "src/modules/apiHelper";
import { CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon, PencilIcon, RefreshIcon } from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import { NextPageContext } from "next";
import ReactMarkdown from "react-markdown";
import ImageModal from "src/components/modals/ImageModal";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import Post from "src/components/common/Post";
import TruncatedText from "src/components/common/TruncatedText";

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
function NftProfile({
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
	const [following, setFollowing] = useState(is_following);
	const followerOffset = is_following == following ? 0 : !following ? -1 : 1;
	const handleClickNewPost = () => {
		href(urls.post.index());
	};
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
	useEffect(() => {
		setFollowing(is_following);
	}, [is_following]);

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
								nftProfileName={nft_profile?.name}
								nftMetadatumName={nft_metadatum.name}
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
							<Div flex1 flex justifyCenter px20 py5 rounded border1 onClick={handleClickNewPost}>
								<Div textBase>게시물 작성</Div>
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
				<Posts posts={posts} currentNftImage={currentNft.nft_metadatum.image_uri} />
			</Div>
		</Div>
	);
}

function Name({ nftProfileName, nftMetadatumName, contractAddress, tokenId, mine }) {
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

	useEffect(() => {
		setName({
			value: initialName,
			edittingValue: initialName,
			state: NameState.Stale,
			error: "",
		});
	}, [initialName]);

	return (
		<Div>
			<Div itemsCenter flex flexRow>
				<Div flex1>
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
	useEffect(() => {
		setStory({
			value: initialStory,
			edittingValue: initialStory,
			state: StoryState.Stale,
			error: "",
		});
	}, [initialStory]);

	return (
		<Div mxAuto py20 borderB1>
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
								<ReactMarkdown
									children={story.value ? (TruncatedText({ text: story.value, maxLength: 50 }) as string) : "스토리가 아직 작성되지 않았습니다."}
								></ReactMarkdown>
							</Div>
						),
						[StoryState.Editting]: (
							<Div fontWeight={500}>
								<textarea
									placeholder={story.value || "마크다운을 사용하실 수 있습니다."}
									value={story.edittingValue}
									className={"bg-gray-200 border-gray-200 box-shadow-none w-full rounded focus:border-gray-400"}
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
function Posts({ posts, currentNftImage }) {
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
						<Post post={post} currentNftImage={currentNftImage} />
					</Div>
				);
			})}
		</Div>
	);
}

NftProfile.getInitialProps = async (context: NextPageContext) => {
	const { contractAddress, tokenId } = context.query;
	const res = await apiHelperWithJwtFromContext(context, apis.nftProfile.contractAddressAndTokenId(contractAddress, tokenId), "GET");
	return res.nft;
};

export default NftProfile;
