import { useEffect, useState } from "react";
import useIsTablet from "src/hooks/useIsTablet";
import { apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import Col from "../Col";
import Div from "../Div";
import EmptyBlock from "../EmptyBlock";
import Row from "../Row";
import Name from "./Name";
import Posts from "./Posts";
import Story from "./Story";

export default function NftProfile({ nft, currentNft }) {
	const { follower_count, following_count, is_following, name, story, nft_metadatum, contract_address, token_id, posts } = nft;
	const isTablet = useIsTablet();
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
	const handleClickDm = async () => {
		const res = await apiHelperWithToken(apis.chat.chatRoom.contractAddressAndTokenId(contract_address, token_id), "POST");
		href(urls.chat.room(res.chat_room._id.$oid));
	};
	useEffect(() => {
		setFollowing(is_following);
	}, [is_following, token_id, contract_address]);

	return (
		<Div bgWhite roundedLg={!isTablet} overflowHidden>
			<Div maxW={650} px15>
				<Div borderB1>
					<EmptyBlock h={20} />
					<Div flex flexRow gapX={20}>
						<Div style={{ flex: 2 }}>
							<Div imgTag src={nft_metadatum?.image_uri} bgGray200 hAuto roundedLg></Div>
						</Div>
						<Div style={{ flex: 4 }}>
							<Name nftName={name} nftMetadatumName={nft_metadatum.name} mine={mine} />
							<EmptyBlock h={2} />
							<Div textGray600 cursorPointer onClick={() => href(urls.nftCollection.contractAddress(contract_address))}>
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
							<Div flex1 flex justifyCenter px20 py5 roundedLg border1 onClick={handleClickNewPost}>
								<Div textBase>게시물 작성</Div>
							</Div>
						) : (
							<Div>
								<Row gapX={10}>
									<Col pr0>
										{" "}
										{following ? (
											<Div flex1 flex justifyCenter px20 py5 roundedLg border1 onClick={handleClickUnfollow}>
												<Div textBase>언팔로우</Div>
											</Div>
										) : (
											<Div flex1 flex justifyCenter px20 py5 roundedLg border1 onClick={handleClickFollow}>
												<Div textBase>팔로우</Div>
											</Div>
										)}
									</Col>
									<Col pl0>
										<Div flex1 flex justifyCenter px20 py5 roundedLg border1 onClick={handleClickDm}>
											<Div textBase>DM</Div>
										</Div>
									</Col>
								</Row>
							</Div>
						)}
					</Div>
					<Story initialStory={story} mine={mine} />
				</Div>
			</Div>
			<Div maxW={650} bgWhite>
				<Posts posts={posts} currentNftImage={currentNft.nft_metadatum.image_uri} />
			</Div>
		</Div>
	);
}
