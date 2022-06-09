import { LockClosedIcon, SparklesIcon } from "@heroicons/react/outline";
import { useDispatch } from "react-redux";
import { emailVerificationAction, loginQRModalAction, switchAccountModalAction } from "src/store/reducers/modalReducer";
import Div from "src/components/Div";
import { useRouter } from "next/router";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import { IMAGES } from "src/modules/images";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { PLATFORM, truncateKlaytnAddress } from "src/modules/constants";
import { loginAction, removeAccountAuthAction } from "src/store/reducers/authReducer";
import { getNftProfileImage } from "src/modules/nftUtils";
import { useLoginWithKaikas } from "src/modules/authHelper";
import SwitchAcountModal from "./modals/SwitchAccountModal";
import EmailVerificationModal from "./modals/EmailVerificationModal";
import LoginQRModal from "./modals/LoginQRModal";
import BasicHead from "./BasicHead";

const MainTopBar = ({ currentUser, currentNft }) => {
	const { locale } = useRouter();
	const dispatch = useDispatch();
	const gotoHome = () => {
		href(urls.index());
	};
	const gotoOnboarding = () => {
		href(urls.onboarding.index());
	};
	const loginWithKaikas = useLoginWithKaikas();
	const handleGetQR = () => {
		dispatch(
			loginQRModalAction({
				enabled: true,
			}),
		);
	};
	const handleSetPassword = () => {
		dispatch(
			emailVerificationAction({
				enabled: true,
			}),
		);
	};
	return (
		<>
			<BasicHead />
			<SwitchAcountModal />
			<EmailVerificationModal />
			<LoginQRModal address={currentUser?.klaytn_account?.address} />
			<Div px80 absolute top0 bgWhite bgOpacity90 borderB1 wFull z100>
				<Div maxW={1100} mxAuto>
					<Div flex itemsCenter py4 gapX={8}>
						<Div rounded10 p4 onClick={gotoHome} cursorPointer>
							<Div h44 imgTag src={IMAGES.betterWorldBlueLogo}></Div>
						</Div>
						<Div fontBold onClick={gotoHome} cursorPointer>
							BetterWorld
						</Div>
						<Div flex1 />
						<Div ml8 rounded100 border1 fontSize14 py6 px16 cursorPointer onClick={gotoOnboarding}>
							위비 온보딩
						</Div>
						{currentNft && (
							<Div ml8 rounded100 border1 fontSize14 py6 px16 cursorPointer onClick={handleGetQR}>
								로그인 큐알 발급
							</Div>
						)}
						{currentNft && (
							<Div ml8 rounded100 border1 fontSize14 py6 px16 cursorPointer onClick={handleSetPassword}>
								비밀번호 재설정
							</Div>
						)}
						{currentUser ? (
							<ProfileDropdown currentUser={currentUser} currentNft={currentNft} />
						) : (
							<Div ml8 textWhite bgBlack rounded100 fontSize14 py6 px16 cursorPointer onClick={loginWithKaikas}>
								지갑 연결
							</Div>
						)}
					</Div>
				</Div>
			</Div>
		</>
	);
};

function ProfileDropdown({ currentNft, currentUser }) {
	const dispatch = useDispatch();
	const handleClickSwitchAccount = () => {
		dispatch(
			switchAccountModalAction({
				enabled: true,
				currentNft,
				currentUser,
			}),
		);
	};
	const handleClickRemoveAccount = () => {
		dispatch(removeAccountAuthAction({}));
	};
	return (
		<Menu as="div">
			<Menu.Button>
				{!currentNft ? (
					<Div ml8 textWhite bgBlack rounded100 fontSize14 py6 px16 cursorPointer>
						{truncateKlaytnAddress(currentUser.klaytn_account.address)}
					</Div>
				) : (
					<Div ml8 cursorPointer imgTag src={getNftProfileImage(currentNft, 200, 200)} h32 w32 roundedFull mt6 border1 borderBlack></Div>
				)}
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
				<Menu.Items className="origin-top-right absolute mt-2 rounded-lg border-1 bg-white focus:outline-none ">
					<Div textBase>
						{currentNft && (
							<Menu.Item>
								{({ active }) => (
									<Div
										onClick={handleClickSwitchAccount}
										py12
										px16
										flex
										flexRow
										itemsCenter
										cursorPointer
										clx={`${active ? "bg-gray-100 text-black" : "text-gray-800"}`}
									>
										<Div mr10>
											<SparklesIcon height={20} width={20} />
										</Div>{" "}
										<Div>계정 전환</Div>
									</Div>
								)}
							</Menu.Item>
						)}
						<Menu.Item>
							{({ active }) => (
								<Div
									onClick={handleClickRemoveAccount}
									borderT1
									py12
									px16
									flex
									flexRow
									itemsCenter
									cursorPointer
									clx={`${active ? "bg-gray-100 text-black" : "text-gray-800"}`}
								>
									<Div mr10>
										<LockClosedIcon height={20} width={20} />
									</Div>{" "}
									<Div>연결 해제</Div>
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
