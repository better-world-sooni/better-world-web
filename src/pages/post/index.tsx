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
import ReactTextareaAutosize from "react-textarea-autosize";
import Spinner from "src/components/common/Spinner";

enum FeedState {
	Stale,
	Editting,
	Loading,
}
function Index({ currentUser, currentNft }) {
	return (
		<Div>
			<Helmet bodyAttributes={{ style: "background-color : rgb(250, 250, 250);" }} />
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Confetti />
			<Div mxAuto maxW={700} bgWhite rounded>
				<NewProposal currentNft={currentNft} />
			</Div>
		</Div>
	);
}

function NewProposal({ currentNft }) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [error, setError] = useState("");
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [loading, setLoading] = useState(false);

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
		URL.revokeObjectURL(selectedFiles[index].url);
		reducedArray.splice(index, 1);
		setError("");
		setSelectedFiles(reducedArray);
	};
	const uploadPost = async () => {
		if (loading) {
			return;
		}
		if (!(title || content || selectedFiles.length > 0)) {
			setError("제목, 글, 혹은 이미지 중 하나는 작성하세요.");
			return;
		}
		setLoading(true);
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
			setLoading(false);
			return;
		}
		setError("");
		href(urls.nftProfile.contractAddressAndTokenId(currentNft.contract_address, currentNft.token_id));
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
		<Div py20>
			<Div px15>
				<Row flex itemsCenter pb10>
					<Col auto>
						<Div imgTag src={currentNft.nft_metadatum.image_uri} h30 w30 rounded></Div>
					</Col>
					<Col auto pl0>
						{truncateKlaytnAddress(currentNft.nft_profile?.name || currentNft.nft_metadatum.name)}
					</Col>
					<Col />
					<Col auto>
						<Div relative textBase onClick={uploadPost}>
							{loading ? <Spinner clx={"w-20 h-20"} fill={COLORS.PRIMARY} circleFill={COLORS.GRAY200} /> : "게시하기"}
						</Div>
					</Col>
				</Row>
				{error && (
					<Div mt10 textDanger textSm>
						{error}
					</Div>
				)}
				<Div textXl fontWeight={500} mt10>
					<input
						placeholder="제목"
						value={title}
						className={"rounded w-full focus:outline-none focus:border-gray-400"}
						onChange={handleTitleChange}
					></input>
				</Div>
				<Div mt10>
					<ReactTextareaAutosize
						rows={5}
						onChange={handleContentChange}
						placeholder={"마크다운을 사용하실수 있습니다."}
						className={"text-base"}
						value={content}
						style={{ boxShadow: "none", border: "none", resize: "none", width: "100%", padding: 0, background: "transparent" }}
					/>
				</Div>
			</Div>
			{selectedFiles.length > 0 ? (
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
						{selectedFiles.map((fileObject, index) => {
							return (
								<div key={index}>
									<div
										style={{
											backgroundImage: `url(${fileObject.url})`,
											backgroundSize: "cover",
											backgroundPositionX: "center",
											backgroundPositionY: "center",
											border: "none",
											height: 400,
											cursor: "pointer",
											position: "relative",
										}}
									>
										{fileObject.loading && (
											<Div wFull hFull absolute z10 top0 flex itemsCenter justifyCenter clx={"bg-grayOpacity-100"}>
												<Spinner clx={"w-40 h-40"} fill={COLORS.PRIMARY} circleFill={COLORS.GRAY200} />
											</Div>
										)}
									</div>
									<Div onClick={() => handleRemoveFile(index)} py10 mt10 mx15 textCenter border1 borderDanger textDanger rounded>
										해당 이미지 제거
									</Div>
								</div>
							);
						})}
					</Slide>
				</Div>
			) : (
				<Div clx="file-input" flex itemsCenter justifyCenter relative textBase h400 wFull mt10 bgGray200>
					이미지 추가
					<input type={"file"} onChange={handleAddFiles} multiple accept="image/png, image/gif, image/jpeg" className={"cursor-pointer"}></input>
				</Div>
			)}
		</Div>
	);
}

export default Index;
