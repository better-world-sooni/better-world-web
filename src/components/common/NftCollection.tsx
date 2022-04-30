import { CheckCircleIcon, PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import useIsTablet from "src/hooks/useIsTablet";
import { apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { COLORS, NftPrivilege } from "src/modules/constants";
import { createPresignedUrl, fileChecksum, uploadToPresignedUrl } from "src/modules/fileHelper";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import Col from "../Col";
import Div from "../Div";
import Row from "../Row";
import Name from "./Name";
import Posts from "./Posts";
import Spinner from "./Spinner";
import Story from "./Story";

enum ContentType {
	Feed,
	Member,
	About,
}

export default function NftCollection({ nft_collection, currentNft }) {
	const { posts, about, nfts, is_following, follower_count, contract_address } = nft_collection;
	const isTablet = useIsTablet();
	const [following, setFollowing] = useState(is_following);
	const followerOffset = is_following == following ? 0 : !following ? -1 : 1;
	const isRootAdmin = currentNft.privilege == NftPrivilege.ROOT;
	const isAdder = isRootAdmin || currentNft.privilege == NftPrivilege.ADDER;
	const [contentType, setContentType] = useState(ContentType.Feed);
	const handleClickFollowOrUnfollow = async () => {
		const verb = following ? "DELETE" : "POST";
		const res = await apiHelperWithToken(apis.follow.contractAddress(contract_address), verb);
		if (res.success) {
			setFollowing(!following);
		}
	};
	const handleClickFeed = () => {
		setContentType(ContentType.Feed);
	};
	const handleClickAbout = () => {
		setContentType(ContentType.About);
	};
	const handleClickMembers = () => {
		setContentType(ContentType.Member);
	};
	useEffect(() => {
		setFollowing(is_following);
	}, [is_following, currentNft.token_id, currentNft.contract_address]);
	return (
		<Div relative>
			<BackgroundImage edittable={isAdder} imageUri={nft_collection.background_image_uri} contractAddress={contract_address} />
			<Div h150></Div>
			<Div maxW={650} mxAuto bgWhite px15 roundedLg={!isTablet}>
				<Row flex itemsEnd>
					<Col auto>
						<ProfileImage edittable={isAdder} imageUri={nft_collection.image_uri} contractAddress={contract_address} />
					</Col>
					<Col>
						<Div fontWeight={500} textXl>
							<Name nftName={nft_collection.name} nftMetadatumName={null} mine={isRootAdmin} contractAddress={contract_address} />
						</Div>
						<Div textSm>
							<Div spanTag fontWeight={500}>
								{follower_count + followerOffset}
							</Div>{" "}
							<Div spanTag>팔로워</Div>
						</Div>
						<Row gapX={10} mt10 textBase>
							<Col pr0={isRootAdmin}>
								<Div roundedLg flex py5 px15 itemsCenter justifyCenter border1 onClick={handleClickFollowOrUnfollow} cursorPointer>
									<Div textCenter>{following ? "언팔로우" : "팔로우"}</Div>
								</Div>
							</Col>
							{isRootAdmin && (
								<Col pl0>
									<Div
										roundedLg
										border1
										borderPrimary
										flex
										py5
										itemsCenter
										justifyCenter
										cursorPointer
										onClick={() => href(urls.post.admin.contractAddress(contract_address))}
									>
										<Div textCenter textPrimary fontWeight={500}>
											게시물 작성
										</Div>
									</Div>
								</Col>
							)}
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
						<Div h50 flex itemsCenter justifyCenter cursorPointer onClick={handleClickMembers}>
							<Div textCenter>{nfts.length} 멤버</Div>
						</Div>
					</Col>
					<Col>
						<Div h50 flex itemsCenter justifyCenter cursorPointer onClick={handleClickAbout}>
							<Div textCenter>소개</Div>
						</Div>
					</Col>
				</Row>
			</Div>
			<Div maxW={650} bgWhite mxAuto mt10 roundedLg={!isTablet} py10>
				{
					{
						[ContentType.Feed]: <Posts posts={posts} currentNftImage={currentNft.nft_metadatum.image_uri} />,
						[ContentType.Member]: <Members nfts={nfts} />,
						[ContentType.About]: <About collection={nft_collection} edittable={isAdder} />,
					}[contentType]
				}
			</Div>
		</Div>
	);
}

function About({ collection, edittable }) {
	return (
		<Div px15 roundedLg bgWhite pb10>
			<Story initialStory={collection.about} mine={edittable} contractAddress={collection.contract_address} />
			<Row mt10 flex itemsEnd pt10 borderT1>
				<Col textCenter>
					<Div aTag href={collection.website} cursorPointer textGray200={!collection.website}>
						Website
					</Div>
				</Col>
				<Col textCenter>
					<Div aTag href={collection.opensea} cursorPointer textGray200={!collection.opensea}>
						Opensea
					</Div>
				</Col>
				<Col textCenter>
					<Div aTag href={collection.github} cursorPointer textGray200={!collection.github}>
						Github
					</Div>
				</Col>
			</Row>
		</Div>
	);
}

function Members({ nfts }) {
	const isTablet = useIsTablet();
	const hrefToNft = async (contract_address, token_id) => {
		href(urls.nftProfile.contractAddressAndTokenId(contract_address, token_id));
	};
	return (
		<Div gridCols4={!isTablet} gridCols3={isTablet} grid gapX={10} gapY={10} px15>
			{nfts.map((nft, index) => {
				return (
					<Div key={index} cursorPointer roundedLg overflowHidden border1 onClick={() => hrefToNft(nft.contract_address, nft.token_id)}>
						<Div imgTag src={nft.nft_metadatum.image_uri}></Div>
						<Div py5 px10 fontWeight={500} textCenter>
							{nft.name || nft.nft_metadatum.name}
						</Div>
					</Div>
				);
			})}
		</Div>
	);
}

function ProfileImage({ imageUri, contractAddress, edittable }) {
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
		const res = await apiHelperWithToken(apis.nft_collection.contractAddress._(contractAddress), "PUT", {
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
				flex
				itemsEnd
				roundedLg
				justifyEnd
				style={{
					backgroundImage: `url(${imageUri})`,
					backgroundSize: "cover",
					backgroundPositionX: "center",
					backgroundPositionY: "center",
				}}
			>
				<Div my5 mx5>
					{edittable && (
						<Div clx="file-input" bgWhite bgOpacity70 p5 rounded cursorPointer>
							<PencilIcon height={20} width={20} />
							<input type={"file"} onChange={handleAddFile} accept="image/png, image/gif, image/jpeg" className={"cursor-pointer"}></input>
						</Div>
					)}
				</Div>
			</Div>
		);
	}
	return (
		<Div h150 w150 bgGray100 flex itemsCenter justifyCenter roundedLg>
			{edittable && (
				<Div clx="file-input" flex itemsCenter justifyCenter relative textBase wFull hFull>
					이미지 추가
					<input type={"file"} onChange={handleAddFile} accept="image/png, image/gif, image/jpeg" className={"cursor-pointer"}></input>
				</Div>
			)}
		</Div>
	);
}

function BackgroundImage({ imageUri, contractAddress, edittable }) {
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
		const res = await apiHelperWithToken(apis.nft_collection.contractAddress._(contractAddress), "PUT", {
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
					{edittable && (
						<Div clx="file-input" bgWhite bgOpacity70 p5 rounded cursorPointer>
							<PencilIcon height={20} width={20} />
							<input type={"file"} onChange={handleAddFile} accept="image/png, image/gif, image/jpeg" className={"cursor-pointer"}></input>
						</Div>
					)}
				</Div>
			</Div>
		);
	}
	return (
		<Div h200 wFull bgGray200 absolute top0 flex itemsCenter justifyCenter rounded>
			{edittable && (
				<Div clx="file-input" flex itemsCenter justifyCenter relative textBase wFull h200>
					이미지 추가
					<input type={"file"} onChange={handleAddFile} accept="image/png, image/gif, image/jpeg" className={"cursor-pointer"}></input>
				</Div>
			)}
		</Div>
	);
}
