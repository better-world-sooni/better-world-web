import Div from "src/components/Div";
import Row from "src/components/Row";
import Col from "src/components/Col";
import MainTopBar from "src/components/MainTopBar";
import { useEffect, useState } from "react";
import apis from "src/modules/apis";
import { apiHelperWithJwtFromContext, apiHelperWithToken } from "src/modules/apiHelper";
import { BellIcon, CheckCircleIcon, PencilIcon, TrashIcon, XCircleIcon } from "@heroicons/react/outline";
import { NextPageContext } from "next";
import { createPresignedUrl, fileChecksum, uploadToPresignedUrl } from "src/modules/fileHelper";
import Spinner from "src/components/common/Spinner";
import { COLORS } from "src/modules/constants";

function NftCollection({ nft_collection, posts, about, currentUser, currentNft }) {
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
		<>
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Div mxAuto maxW={950}>
				<Div relative h250>
					<BackgroundImage imageUri={nft_collection.background_image_uri} contractAddress={nft_collection.contract_address} />
					<Div h150></Div>
					<Div maxW={650} mxAuto bgWhite px15 roundedLg>
						<Row flex itemsEnd>
							<Col auto>
								<ProfileImage imageUri={nft_collection.image_uri} contractAddress={nft_collection.contract_address} />
							</Col>
							<Col>
								<Div fontWeight={500} textXl>
									{nft_collection.name}
								</Div>
								<Row gapX={10} mt10 textBase>
									<Col pr0>
										<Div roundedLg flex py5 px15 itemsCenter justifyCenter border1 onClick={handleClickProposal}>
											<Div textCenter>팔로우</Div>
										</Div>
									</Col>
									<Col pl0>
										<Div roundedLg flex py5 itemsCenter justifyCenter>
											<Div textCenter textPrimary fontWeight={500}>
												게시물 작성
											</Div>
										</Div>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row flex itemsCenter px15 mt10 textBase borderT1>
							<Col>
								<Div h50 flex itemsCenter justifyCenter cursorPointer onClick={handleClickFeed}>
									<Div textCenter>피드</Div>
								</Div>
							</Col>
							<Col>
								<Div h50 flex itemsCenter justifyCenter cursorPointer onClick={handleClickFeed}>
									<Div textCenter>멤버</Div>
								</Div>
							</Col>
							<Col>
								<Div h50 flex itemsCenter justifyCenter cursorPointer onClick={handleClickFeed}>
									<Div textCenter>소개</Div>
								</Div>
							</Col>
						</Row>
					</Div>
				</Div>
			</Div>
			<Div></Div>
		</>
	);
}

function ProfileImage({ imageUri, contractAddress }) {
	const [selectedFile, setSelectedFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const handleAddFile = (e) => {
		const targetFilesLength = e.target.files.length;
		if (!e.target.files || targetFilesLength != 1) {
			return;
		}
		setSelectedFile(createFileObject(e.target.files[0]));
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
	const handleRemoveFile = () => {
		URL.revokeObjectURL(selectedFile.url);
		setSelectedFile(null);
	};
	const updateBackgroundImage = async () => {
		if (loading) {
			return;
		}
		setLoading(true);
		const signedId = await uploadSelectedFile();
		const res = await apiHelperWithToken(apis.nft_collection.contractAddress(contractAddress), "PUT", {
			property: "image",
			value: signedId,
		});
		if (!res.success) {
			alert("배경 업데이트중 문제가 발생하였습니다.");
			setLoading(false);
			return;
		}
		location.reload();
	};
	const uploadSelectedFile = async () => {
		try {
			const signedId = await uploadFile();
			return signedId;
		} catch {
			setSelectedFileLoading(false);
			alert("이미지 업로드중 문제가 발생하였습니다.");
			return null;
		}
	};
	const uploadFile = async () => {
		setSelectedFileLoading(true);
		const res = await upload(selectedFile.file);
		setSelectedFileLoading(false);
		return res;
	};
	const setSelectedFileLoading = (bool) => {
		const loadingFile = { ...selectedFile };
		loadingFile.loading = bool;
		setSelectedFile(loadingFile);
	};
	const upload = async (file) => {
		const checksum = await fileChecksum(file);
		const createPresignedUrlRes = await createPresignedUrl(file.name, file.type, file.size, checksum, "nft_collection");
		const uploadToPresignedUrlRes = await uploadToPresignedUrl(createPresignedUrlRes.presigned_url_object, file);
		if (!uploadToPresignedUrlRes) throw new Error();
		return createPresignedUrlRes.presigned_url_object.blob_signed_id;
	};
	if (selectedFile) {
		return (
			<Div
				h150
				w150
				bgGray100
				flex
				itemsEnd
				roundedLg
				justifyEnd
				style={{
					backgroundImage: `url(${selectedFile.url})`,
					backgroundSize: "cover",
					backgroundPositionX: "center",
					backgroundPositionY: "center",
					backgroundColor: "white",
				}}
			>
				{selectedFile.loading ? (
					<Div wFull hFull absolute z10 top0 flex itemsCenter justifyCenter clx={"bg-grayOpacity-100"}>
						<Spinner clx={"w-40 h-40"} fill={COLORS.PRIMARY} circleFill={COLORS.GRAY200} />
					</Div>
				) : (
					<Div my5 mx5>
						<Row flex itemsCenter>
							<Col flex itemsCenter justifyCenter onClick={handleRemoveFile} cursorPointer rounded pr0>
								<Div bgWhite bgOpacity70 p5 rounded>
									<TrashIcon height={20} width={20} />
								</Div>
							</Col>
							<Col flex itemsCenter justifyCenter onClick={updateBackgroundImage} cursorPointer>
								<Div bgWhite bgOpacity70 p5 rounded>
									<CheckCircleIcon height={20} width={20} />
								</Div>
							</Col>
						</Row>
					</Div>
				)}
			</Div>
		);
	}
	if (imageUri) {
		return (
			<Div
				h150
				w150
				bgGray100
				flex
				itemsEnd
				roundedLg
				justifyEnd
				style={{
					backgroundImage: `url(${imageUri})`,
					backgroundSize: "cover",
					backgroundPositionX: "center",
					backgroundPositionY: "center",
					backgroundColor: "white",
				}}
			>
				<Div my5 mx5>
					<Div clx="file-input" bgWhite bgOpacity70 p5 rounded cursorPointer>
						<PencilIcon height={20} width={20} />
						<input type={"file"} onChange={handleAddFile} accept="image/png, image/gif, image/jpeg" className={"cursor-pointer"}></input>
					</Div>
				</Div>
			</Div>
		);
	}
	return (
		<Div h150 w150 bgGray100 flex itemsCenter justifyCenter roundedLg>
			<Div clx="file-input" flex itemsCenter justifyCenter relative textBase wFull hFull>
				이미지 추가
				<input type={"file"} onChange={handleAddFile} accept="image/png, image/gif, image/jpeg" className={"cursor-pointer"}></input>
			</Div>
		</Div>
	);
}

function BackgroundImage({ imageUri, contractAddress }) {
	const [selectedFile, setSelectedFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const handleAddFile = (e) => {
		const targetFilesLength = e.target.files.length;
		if (!e.target.files || targetFilesLength != 1) {
			return;
		}
		setSelectedFile(createFileObject(e.target.files[0]));
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
	const handleRemoveFile = () => {
		URL.revokeObjectURL(selectedFile.url);
		setSelectedFile(null);
	};
	const updateBackgroundImage = async () => {
		if (loading) {
			return;
		}
		setLoading(true);
		const signedId = await uploadSelectedFile();
		const res = await apiHelperWithToken(apis.nft_collection.contractAddress(contractAddress), "PUT", {
			property: "background_image",
			value: signedId,
		});
		if (!res.success) {
			alert("배경 업데이트중 문제가 발생하였습니다.");
			setLoading(false);
			return;
		}
		location.reload();
	};
	const uploadSelectedFile = async () => {
		try {
			const signedId = await uploadFile();
			return signedId;
		} catch {
			setSelectedFileLoading(false);
			alert("이미지 업로드중 문제가 발생하였습니다.");
			return null;
		}
	};
	const uploadFile = async () => {
		setSelectedFileLoading(true);
		const res = await upload(selectedFile.file);
		setSelectedFileLoading(false);
		return res;
	};
	const setSelectedFileLoading = (bool) => {
		const loadingFile = { ...selectedFile };
		loadingFile.loading = bool;
		setSelectedFile(loadingFile);
	};
	const upload = async (file) => {
		const checksum = await fileChecksum(file);
		const createPresignedUrlRes = await createPresignedUrl(file.name, file.type, file.size, checksum, "nft_collection");
		const uploadToPresignedUrlRes = await uploadToPresignedUrl(createPresignedUrlRes.presigned_url_object, file);
		if (!uploadToPresignedUrlRes) throw new Error();
		return createPresignedUrlRes.presigned_url_object.blob_signed_id;
	};
	if (selectedFile) {
		return (
			<Div
				rounded
				h200
				wFull
				absolute
				top0
				flex
				itemsEnd
				justifyEnd
				style={{
					backgroundImage: `url(${selectedFile.url})`,
					backgroundSize: "cover",
					backgroundPositionX: "center",
					backgroundPositionY: "center",
					backgroundColor: "white",
				}}
			>
				{selectedFile.loading ? (
					<Div wFull hFull absolute z10 top0 flex itemsCenter justifyCenter clx={"bg-grayOpacity-100"}>
						<Spinner clx={"w-40 h-40"} fill={COLORS.PRIMARY} circleFill={COLORS.GRAY200} />
					</Div>
				) : (
					<Div my10 mx15>
						<Row flex itemsCenter>
							<Col flex itemsCenter justifyCenter onClick={handleRemoveFile} cursorPointer rounded pr0>
								<Div bgWhite bgOpacity70 p5 rounded>
									<TrashIcon height={20} width={20} />
								</Div>
							</Col>
							<Col flex itemsCenter justifyCenter onClick={updateBackgroundImage} cursorPointer>
								<Div bgWhite bgOpacity70 p5 rounded>
									<CheckCircleIcon height={20} width={20} />
								</Div>
							</Col>
						</Row>
					</Div>
				)}
			</Div>
		);
	}
	if (imageUri) {
		return (
			<Div
				rounded
				h200
				wFull
				bgGray200
				absolute
				top0
				flex
				itemsEnd
				justifyEnd
				style={{
					backgroundImage: `url(${imageUri})`,
					backgroundSize: "cover",
					backgroundPositionX: "center",
					backgroundPositionY: "center",
					backgroundColor: "white",
				}}
			>
				<Div my10 mx15 py5 px10>
					<Div clx="file-input" bgWhite bgOpacity70 p5 rounded cursorPointer>
						<PencilIcon height={20} width={20} />
						<input type={"file"} onChange={handleAddFile} accept="image/png, image/gif, image/jpeg" className={"cursor-pointer"}></input>
					</Div>
				</Div>
			</Div>
		);
	}
	return (
		<Div h200 wFull bgGray200 absolute top0 flex itemsCenter justifyCenter rounded>
			<Div clx="file-input" flex itemsCenter justifyCenter relative textBase wFull h200>
				이미지 추가
				<input type={"file"} onChange={handleAddFile} accept="image/png, image/gif, image/jpeg" className={"cursor-pointer"}></input>
			</Div>
		</Div>
	);
}

NftCollection.getInitialProps = async (context: NextPageContext) => {
	const { contractAddress } = context.query;
	const res = await apiHelperWithJwtFromContext(context, apis.nft_collection.contractAddress(contractAddress), "GET");
	return res;
};

export default NftCollection;
