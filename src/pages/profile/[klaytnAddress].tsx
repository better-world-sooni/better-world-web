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
import { BellIcon, XCircleIcon } from "@heroicons/react/outline";
import { NextPageContext } from "next";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import ImageModal from "src/components/modals/ImageModal";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";

function Nfts({ nfts }) {
	const length = nfts.length;
	console.log(nfts);
	if (length == 0) {
		return (
			<Div textCenter py30>
				NFT를 보유하고 계시지 않군요. 아바타를 하나 장만해 보세요!
			</Div>
		);
	}
	return (
		<Div mxAuto maxW={1100} grid gridCols4 gap20 py20>
			{nfts.map((nft, index) => {
				return (
					<Div key={index}>
						<Div
							cursorPointer
							roundedXl
							overflowHidden
							border1
							onClick={() => href(urls.nftProfile.contractAddressAndTokenId(nft.contract_address, nft.token_id))}
						>
							<Div imgTag src={nft.nft_metadatum.image_uri}></Div>
							<Div py20 px20 fontWeight={500}>
								{nft.nft_metadatum.name}
							</Div>
						</Div>
					</Div>
				);
			})}
		</Div>
	);
}

function NftCollection({ profile, currentUser, currentNft }) {
	const mainNft = profile.main_nft ? profile.main_nft : profile.nfts[0];
	const imageUri = mainNft?.nft_metadatum?.image_uri;
	const [contentIndex, setContentIndex] = useState(0);
	const handleClickFeed = () => {
		setContentIndex(0);
	};
	const handleClickCapsules = () => {
		setContentIndex(1);
	};
	const handleClickAbout = () => {
		setContentIndex(2);
	};
	const handleClickProposal = () => {
		setContentIndex(3);
	};
	return (
		<Div>
			<Helmet bodyAttributes={{ style: "background-color : white;" }} />
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Confetti />
			<EmptyBlock h={20} />
			<Div px30>
				<Div mxAuto maxW={1100} px10>
					<Row flex itemsCenter roundedXl border1 py20 px20>
						<Col auto borderR1 pr20>
							<Row flex itemsCenter>
								<Col auto>
									<Div imgTag src={imageUri} bgGray200 h50 w50 roundedFull></Div>
								</Col>
								<Col auto>
									<Div fontWeight={500} textLg>
										{truncateKlaytnAddress(currentUser.username)}
									</Div>
								</Col>
							</Row>
						</Col>
						<Col auto pl20 pr5>
							<Div h50 roundedFull px20 flex itemsCenter justifyCenter border1 cursorPointer onClick={handleClickFeed}>
								<Div textCenter>PFPs</Div>
							</Div>
						</Col>
						<Col auto px5>
							<Div h50 roundedFull px20 flex itemsCenter justifyCenter border1 cursorPointer onClick={handleClickCapsules}>
								<Div textCenter>Capsules</Div>
							</Div>
						</Col>
						<Col></Col>
					</Row>
				</Div>
				<Div mxAuto maxW={1100}>
					{[<Nfts key={0} nfts={profile.nfts} />][contentIndex]}
				</Div>
			</Div>
		</Div>
	);
}

NftCollection.getInitialProps = async (context: NextPageContext) => {
	const { klaytnAddress } = context.query;
	const res = await apiHelperWithJwtFromContext(context, apis.profile.klaytnAddress(klaytnAddress), "GET");
	return {
		profile: res.user,
	};
};

export default NftCollection;
