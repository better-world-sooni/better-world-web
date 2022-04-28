import Div from "src/components/Div";
import EmptyBlock from "src/components/EmptyBlock";
import Row from "src/components/Row";
import Col from "src/components/Col";
import MainTopBar from "src/components/MainTopBar";
import { useEffect, useState } from "react";
import apis from "src/modules/apis";
import { apiHelperWithJwtFromContext, apiHelperWithToken } from "src/modules/apiHelper";
import { NextPageContext } from "next";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import useIsTablet from "src/hooks/useIsTablet";
import Posts from "src/components/common/Posts";
import Name from "src/components/common/Name";
import Story from "src/components/common/Story";

function Nft(props) {
	const isTablet = useIsTablet();
	return (
		<>
			<MainTopBar currentUser={props.currentUser} currentNft={props.currentNft} />
			<Div flex justifyCenter gapX={15}>
				<NftProfile {...props} />
			</Div>
		</>
	);
}

function NftProfile({
	follower_count,
	following_count,
	is_following,
	name,
	story,
	nft_metadatum,
	contract_address,
	token_id,
	collection,
	posts,
	currentNft,
}) {
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
							<Div flex1 flex justifyCenter px20 py5 roundedLg border1 onClick={handleClickNewPost}>
								<Div textBase>게시물 작성</Div>
							</Div>
						) : following ? (
							<Div flex1 flex justifyCenter px20 py5 roundedLg border1 onClick={handleClickUnfollow}>
								<Div textBase>언팔로우</Div>
							</Div>
						) : (
							<Div flex1 flex justifyCenter px20 py5 roundedLg border1 onClick={handleClickFollow}>
								<Div textBase>팔로우</Div>
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

Nft.getInitialProps = async (context: NextPageContext) => {
	const { contractAddress, tokenId } = context.query;
	const res = await apiHelperWithJwtFromContext(context, apis.nft.contractAddressAndTokenId(contractAddress, tokenId), "GET");
	return res.nft;
};

export default Nft;
