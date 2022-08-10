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
import { IdentificationIcon, KeyIcon, QrcodeIcon, UserCircleIcon } from "@heroicons/react/solid";
import { SvgIcon, Tooltip, Typography } from "@mui/material";

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

	function TopBarEntry({Content, onClick, tooltip}) {
		return (
			<Tooltip title={tooltip} placement="bottom" arrow><Div opacity40 selfCenter ml20 cursorPointer h32 w32 roundedFull onClick={onClick}>
				<Div style={{color: "-webkit-linear-gradient(45deg, #AA37FF 30%, #4738FF 90%)"}}> {Content} </Div>
			  </Div></Tooltip>
		)
	}

	return (
		<>
			<BasicHead />
			<SwitchAcountModal />
			<EmailVerificationModal />
			<LoginQRModal address={currentUser?.address} />
			<Div px80 absolute top0 wFull z100>
				<Div wFull mxAuto>
					<Div flex itemsCenter py12 gapX={8}>
						<Div flex itemsCenter py12 gapX={8} onClick={gotoHome}>
						<Div rounded10 cursorPointer>
							<Div w36 imgTag src={IMAGES.betterWorl_colorLogo}></Div>
						</Div>
						<Div w120 imgTag src={IMAGES.betterWorldWord} cursorPointer>
						</Div></Div>
						<Div flex1 />
						<TopBarEntry onClick={gotoOnboarding} tooltip={"Webe 온보딩"} Content={
								<IdentificationIcon/>
							}/>
						{currentNft && (
							<TopBarEntry onClick={handleGetQR} tooltip={"로그인용 QR 발급"} Content={
								<QrcodeIcon/>
							}/>
						)}
						{currentNft && (
							<TopBarEntry onClick={handleSetPassword} tooltip={"비밀번호 재설정"} Content={
								<KeyIcon/>
							}/>
						)}
						{currentUser ? (
							<ProfileDropdown currentUser={currentUser} currentNft={currentNft} />
						) : (
							<TopBarEntry onClick={loginWithKaikas} tooltip={"앱 로그인"} Content={
								<UserCircleIcon/>
							}/>
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
					<Div ml20 selfCenter cursorPointer imgTag src={getNftProfileImage(currentNft, 200, 200)} h32 w32 roundedFull mt6 border1 borderBlack></Div>
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
