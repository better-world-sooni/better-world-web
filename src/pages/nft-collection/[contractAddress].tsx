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
import { BellIcon } from "@heroicons/react/outline";
import { NextPageContext } from "next";

function Forum({ proposals }) {
	const length = proposals.length;
	if (length == 0) {
		return (
			<Div textCenter py30>
				아직 업로드가 된 제안서가 없습니다. 처음이 되어 보세요!
			</Div>
		);
	}
	return (
		<Div mxAuto maxW={1100} px10>
			{proposals.map((proposal, index) => {
				return <Div key={index}>{proposal}</Div>;
			})}
		</Div>
	);
}
function About({ about }) {
	return (
		<Div mxAuto maxW={1100} flex flexRow my20>
			<Div w400 mr20 roundedXl border1 px20 py20>
				<Div fontWeight={500} textLg>
					About
				</Div>
				<Div my10>{about.about}</Div>
				<Div fontWeight={500} textLg mt10>
					Network
				</Div>
				<Div my10>{about.network}</Div>
				<Div fontWeight={500} textLg mt10 textGray400={!about.website}>
					Website
				</Div>
				<Div my10>{about.website}</Div>
				<Div fontWeight={500} textLg mt10 textGray400={!about.github}>
					Github
				</Div>
				<Div my10>{about.github}</Div>
				<Div fontWeight={500} textLg mt10 textGray400={!about.opensea}>
					Website
				</Div>
				<Div my10>{about.opensea}</Div>
			</Div>
			<Div flex1></Div>
		</Div>
	);
}

function NftCollection({ nftCollection, proposals, about }) {
	const [contentIndex, setContentIndex] = useState(0);
	const handleClickForum = () => {
		setContentIndex(0);
	};
	const handleClickCapsules = () => {
		setContentIndex(1);
	};
	const handleClickAbout = () => {
		setContentIndex(2);
	};
	return (
		<Div>
			<Helmet bodyAttributes={{ style: "background-color : white;" }} />
			<MainTopBar mode={"light"} />
			<Confetti />
			<EmptyBlock h={20} />
			<Div px30>
				{nftCollection && (
					<Div mxAuto maxW={1100} px10>
						<Row flex itemsCenter roundedXl border1 py20 px20>
							<Col auto borderR1 pr20>
								<Row flex itemsCenter>
									<Col auto>
										<Div imgTag src={nftCollection.image_uri} bgGray200 h50 w50 roundedFull></Div>
									</Col>
									<Col auto>
										<Div fontWeight={500} textLg>
											{nftCollection.name}
										</Div>
										<Div>{nftCollection.collection_member_count} 멤버</Div>
									</Col>
								</Row>
							</Col>
							<Col auto pl20 pr5>
								<Div h50 roundedFull px20 flex itemsCenter justifyCenter border1 cursorPointer onClick={handleClickForum}>
									<Div textCenter>Forum</Div>
								</Div>
							</Col>
							<Col auto px5>
								<Div h50 roundedFull px20 flex itemsCenter justifyCenter border1 cursorPointer onClick={handleClickCapsules}>
									<Div textCenter>Capsules</Div>
								</Div>
							</Col>
							<Col auto px5>
								<Div h50 roundedFull px20 flex itemsCenter justifyCenter border1 cursorPointer onClick={handleClickAbout}>
									<Div textCenter>About</Div>
								</Div>
							</Col>
							<Col></Col>
							<Col auto px5>
								<Div h50 roundedFull px20 flex itemsCenter justifyCenter border1>
									<Div textCenter>+ New Proposal</Div>
								</Div>
							</Col>
							<Col auto px5>
								<Div h50 w50 roundedFull flex itemsCenter justifyCenter border1>
									<BellIcon height={20} width={20} />
								</Div>
							</Col>
							<Col auto px5>
								<Div h50 roundedFull px20 flex itemsCenter justifyCenter border1>
									<Div>{nftCollection.joined ? "참여중" : "참여"}</Div>
								</Div>
							</Col>
						</Row>
					</Div>
				)}
				<Div mxAuto maxW={1100}>
					{[<Forum key={0} proposals={proposals} />, <Forum key={1} proposals={proposals} />, <About key={2} about={about} />][contentIndex]}
				</Div>
			</Div>
		</Div>
	);
}

NftCollection.getInitialProps = async (context: NextPageContext) => {
	const { contractAddress } = context.query;
	const res = await apiHelperWithJwtFromContext(context, apis.nft_collection.contractAddress(contractAddress), "GET");
	return {
		nftCollection: res.nft_collection,
		proposals: res.proposals,
		about: res.about,
	};
};

export default NftCollection;
