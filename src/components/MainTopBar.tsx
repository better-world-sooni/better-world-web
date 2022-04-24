import { ChatIcon, GlobeAltIcon, KeyIcon, LockClosedIcon, SearchCircleIcon, SparklesIcon, UserCircleIcon } from "@heroicons/react/outline";
import { useDispatch, useSelector } from "react-redux";
import useIsTablet from "src/hooks/useIsTablet";
import { emailVerificationAction, signInAction, switchAccountModalAction } from "src/store/reducers/modalReducer";
import { RootState } from "src/store/reducers/rootReducer";
import Link from "next/link";
import Col from "./Col";
import Div from "./Div";
import Row from "./Row";
import { useRouter } from "next/router";
import SignInModal from "./modals/SignInModal";
import KlipQRModal from "./modals/KlipQRModal";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import EmailVerificationModal from "./modals/EmailVerificationModal";
import { IMAGES } from "src/modules/images";
import EmptyBlock from "./EmptyBlock";
import { truncateKlaytnAddress } from "src/modules/constants";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import SwitchAvatarModal from "./modals/SwitchAccountModal";
import Helmet from "react-helmet";
import Confetti from "./modals/Confetti";
import SearchNft from "src/modules/searchNft"

const MainTopBar = ({ currentUser, currentNft }) => {
	const { locale } = useRouter();
	const dispatch = useDispatch();
	const isTablet = useIsTablet();
	const onClickLogin = () => {
		dispatch(signInAction({ enabled: true }));
	};
	const onClickEmailVerification = () => {
		dispatch(emailVerificationAction({ enabled: true }));
	};

	return (
		<>
			<Helmet bodyAttributes={{ style: "background-color : rgb(245, 245, 245);" }} />
			<Div fixed bgWhite wFull z100>
				<Row maxW={isTablet ? 650 : 950} mxAuto flex itemsCenter py5>
					<Col auto onClick={() => href(urls.home)} cursorPointer>
						<Div imgTag src={IMAGES.betterWorldBlueLogo} h={50} w={50} style={{ objectFit: "cover" }} />
					</Col>
					<Col textPrimary textLeft onClick={() => href(urls.home)} cursorPointer textBase auto pl0>
						BetterWorld{" "}
						<Div spanTag fontSemibold textPrimary pl2>
							αlpha
						</Div>
					</Col>
					<Col />
					<Col>
						<SearchNft/>
					</Col>
					<Col auto>
						<Div bgWhite bgOpacity70 p5 rounded cursorPointer onClick={()=> href(urls.chat)}>
							<ChatIcon height={20} width={20} scale={1} strokeWidth={2} />
						</Div>
					</Col>
					{currentNft && currentUser && (
						<Col auto cursorPointer pt2>
							<ProfileDropdown currentNft={currentNft} currentUser={currentUser} />
						</Col>
					)}
				</Row>
				<SwitchAvatarModal />
				<SignInModal />
				<EmailVerificationModal />
				<KlipQRModal />
				<Confetti />
			</Div>
			<EmptyBlock h={70} />
		</>
	);
};

function ProfileDropdown({ currentNft, currentUser }) {
	const {} = useRouter();
	const dispatch = useDispatch();
	const handleClickProfile = () => {
		if (currentNft) {
			href(urls.nftProfile.contractAddressAndTokenId(currentNft.contract_address, currentNft.token_id));
		}
	};
	const handleClickSwitchAccount = () => {
		dispatch(
			switchAccountModalAction({
				enabled: true,
				currentNft,
				currentUser,
			}),
		);
	};
	return (
		<Menu as="div">
			<Menu.Button className="justify-center shadow-sm">
				<Div cursorPointer imgTag src={currentNft.nft_metadatum.image_uri} h30 w30 rounded></Div>
			</Menu.Button>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="origin-top-right absolute right-10 mt-2 w-200 rounded shadow-lg bg-white focus:outline-none ">
					<Div w200 textBase>
						<Menu.Item>
							{({ active }) => (
								<Div onClick={handleClickProfile} py10 px10 flex flexRow itemsCenter clx={`${active ? "bg-gray-100 text-black" : "text-gray-800"}`}>
									<Div mr10>
										<UserCircleIcon height={20} width={20} />
									</Div>{" "}
									<Div>프로필</Div>
								</Div>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<Div
									onClick={handleClickSwitchAccount}
									py10
									px10
									flex
									flexRow
									itemsCenter
									clx={`${active ? "bg-gray-100 text-black" : "text-gray-800"}`}
								>
									<Div mr10>
										<SparklesIcon height={20} width={20} />
									</Div>{" "}
									<Div>계정 전환</Div>
								</Div>
							)}
						</Menu.Item>
						{/* <Menu.Item>
							{({ active }) => (
								<Div py10 px10 flex flexRow itemsCenter clx={`${active ? "bg-gray-100 text-black" : "text-gray-800"}`}>
									<Div mr10>
										<KeyIcon height={20} width={20} />
									</Div>{" "}
									<Div>Root Holder</Div>
								</Div>
							)}
						</Menu.Item> */}
						<Menu.Item>
							{({ active }) => (
								<Div borderT1 py10 px10 flex flexRow itemsCenter clx={`${active ? "bg-gray-100 text-black" : "text-gray-800"}`}>
									<Div mr10>
										<LockClosedIcon height={20} width={20} />
									</Div>{" "}
									<Div>로그아웃</Div>
								</Div>
							)}
						</Menu.Item>
					</Div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
export default MainTopBar;
