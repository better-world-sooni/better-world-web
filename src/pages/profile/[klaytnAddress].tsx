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
function NewProposal({ nftCollection, currentUser, currentNft }) {
	console.log(currentUser);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [previewing, setPreviewing] = useState(false);
	const [expandImageModal, setExpandImageModal] = useState(false);
	const handleContentChange = ({ target: { value } }) => {
		setContent(value);
	};
	const handleTitleChange = ({ target: { value } }) => {
		setTitle(value);
	};
	const handleAddFiles = (e) => {
		const targetFilesLength = e.target.files.length;
		if (!e.target.files || targetFilesLength === 0) {
			return;
		}
		if (selectedFiles.length + targetFilesLength > 10) {
			alert("이미지는 10개 이상 선택하실 수 없습니다.");
			return;
		}
		const additionalFiles = [];
		for (let fileIndex = 0; fileIndex < targetFilesLength; fileIndex++) {
			additionalFiles.push(addFile(e.target.files[fileIndex]));
		}
		setSelectedFiles([...selectedFiles, ...additionalFiles]);
	};
	const addFile = (file) => {
		const url = URL.createObjectURL(file);
		const fileObject = {
			type: "image",
			url,
			file,
		};
		return fileObject;
	};
	const handleRemoveFile = (index) => {
		const reducedArray = [...selectedFiles];
		reducedArray.splice(index, 1);
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

	return (
		<Div mxAuto maxW={1100} my20>
			<Div maxW={600} mxAuto>
				{previewing ? (
					<Div roundedXl border1 py20 px20>
						<Row flex itemsCenter>
							<Col auto>
								<Div imgTag src={currentUser.main_nft.nft_metadatum.image_uri} h30 w30 roundedFull></Div>
							</Col>
							<Col auto pl0>
								{/* {nftCollection.name} by {truncateKlaytnAddress(currentUser.username)} */}
							</Col>
							<Col auto></Col>
							<Col />
						</Row>
						<Div textXl fontWeight={500} pt20>
							{title}
						</Div>
						<Div pt10>
							<ReactMarkdown remarkPlugins={[]} children={content} className={"whitespace-pre-wrap"}></ReactMarkdown>
						</Div>
						<Div wFull hAuto flex flexRow itemsCenter overflowXScroll gapX={20} pt20 onClick={handleClickImage}>
							{selectedFiles.map((file, index) => {
								return <Div key={index} imgTag wFull hAuto src={file.url} w300 h300 roundedXl />;
							})}
						</Div>
						<ImageModal
							open={expandImageModal}
							handleCloseModal={handleCloseModal}
							imgSrcArr={selectedFiles.map((file) => {
								return file.url;
							})}
						/>
					</Div>
				) : (
					<>
						<Div flex flexRow gapX={20}>
							{selectedFiles.map((fileObject, index) => {
								return (
									<Div key={index} relative roundedXl overflowHidden cursorPointer onClick={() => handleRemoveFile(index)}>
										<Div imgTag src={fileObject.url} w100 h100></Div>
										<Div wFull hFull absolute z10 top0 flex itemsCenter justifyCenter clx={"opacity-0 bg-grayOpacity-100 hover:opacity-100"}>
											<XCircleIcon height={30} width={30} />
										</Div>
									</Div>
								);
							})}
						</Div>
						<Div>
							<Div
								clx="file-input cursor-pointer rounded-full border-1 px-20 w-full focus:outline-none focus:border-gray-400 mt-20"
								h50
								relative
								flex
								itemsCenter
								justifyCenter
							>
								이미지 업로드
								<input type={"file"} onChange={handleAddFiles} multiple accept="image/png, image/gif, image/jpeg, video/mp4"></input>
							</Div>
						</Div>
						<Div>
							<input
								placeholder="제목"
								value={title}
								className={"rounded-full border-1 px-20 w-full focus:outline-none focus:border-gray-400 mt-20"}
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
				<Div h50 my20 border1 roundedFull flex itemsCenter justifyCenter cursorPointer onClick={handleClickPreview}>
					<Div spanTag>프리뷰</Div>
				</Div>
			</Div>
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
