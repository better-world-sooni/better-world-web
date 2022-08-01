import { LockClosedIcon, SparklesIcon, CogIcon } from "@heroicons/react/outline";
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
			<LoginQRModal address={currentUser?.address} />
			<Div px80 absolute top0 bgWhite borderB1 wFull z100>
				<Div maxW={1100} mxAuto>
					<Div flex itemsCenter py12 gapX={8}>
						<Div rounded10 onClick={gotoHome} cursorPointer>
							<Div w44 imgTag src={IMAGES.betterWorldBold}></Div>
						</Div>
						<Div w120 imgTag src={IMAGES.betterWorldWord} onClick={gotoHome} cursorPointer>
						</Div>
						<Div textSecondary italic>αlpha</Div>
						<Div flex1 />
						<Div ml8 roundedFull fontSize15 py6 px20 cursorPointer onClick={gotoOnboarding}>
							WeBe 온보딩
						</Div>
						{currentNft && (
							<Div ml8 roundedFull border1 fontSize15 py6 px20 cursorPointer onClick={handleGetQR}>
								로그인용 QR 발급
							</Div>
						)}
						{currentNft && (
							<Div ml8 roundedFull border1 fontSize15 py6 px20 cursorPointer onClick={handleSetPassword}>
								비밀번호 재설정
							</Div>
						)}
						{currentUser ? (
							<ProfileDropdown currentUser={currentUser} currentNft={currentNft} />
						) : (
							<Div flex itemsCenter ml8 textWhite fontBold bgPrimary roundedFull fontSize15 py6 px23 cursorPointer onClick={loginWithKaikas}>
								앱 로그인
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
	const gotoAdmin = () => {
		href(urls.admin.index());
	};
	return (
		<Menu as="div">
			<Menu.Button>
				{!currentNft ? (
					<Div ml8 textWhite bgBlack rounded100 fontSize14 py6 px16 cursorPointer>
						{truncateKlaytnAddress(currentUser.address)}
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
					{currentNft?.privilege && (
							<Menu.Item>
								{({ active }) => (
									<Div
										onClick={gotoAdmin}
										py12
										px16
										flex
										flexRow
										itemsCenter
										cursorPointer
										clx={`${active ? "bg-gray-100 text-black" : "text-gray-800"}`}
									>
										<Div mr10>
											<CogIcon height={20} width={20} />
										</Div>{" "}
										<Div>ADMIN</Div>
									</Div>
								)}
							</Menu.Item>
						)}
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
