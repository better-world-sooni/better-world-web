import { ChatIcon, GlobeAltIcon, KeyIcon, LockClosedIcon, SearchCircleIcon, SparklesIcon, UserCircleIcon } from "@heroicons/react/outline";
import { useDispatch, useSelector } from "react-redux";
import useIsTablet from "src/hooks/useIsTablet";
import { emailVerificationAction, signInAction } from "src/store/reducers/modalReducer";
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
	const onClickChat = () => {
		href(urls.chat);
	};

	return (
		<>
			<Div fixed bgWhite wFull borderB1 px15 z100>
				<Row maxW={700} mxAuto flex itemsCenter py5>
					<Col auto onClick={() => href(urls.index)} cursorPointer>
						<Div imgTag src={IMAGES.betterWorldBlueLogo} h={50} w={50} style={{ objectFit: "cover" }} />
					</Col>
					<Col textPrimary textLeft onClick={() => href(urls.index)} cursorPointer textBase auto pl0>
						BetterWorld{" "}
						<Div spanTag fontSemibold textPrimary pl2>
							αlpha
						</Div>
					</Col>
					<Col />
					{currentNft && currentUser && (
						<Col auto cursorPointer pt2>
							<ProfileDropdown currentNft={currentNft} currentUser={currentUser} />
						</Col>
					)}
				</Row>
				<SignInModal />
				<EmailVerificationModal />
				<KlipQRModal />
			</Div>
			<EmptyBlock h={70} />
		</>
	);
};

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

function ProfileDropdown({ currentNft, currentUser }) {
	console.log(currentUser);
	const onClickProfile = () => {
		if (currentNft) {
			href(urls.nftProfile.contractAddressAndTokenId(currentNft.contract_address, currentNft.token_id));
		}
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
								<Div onClick={onClickProfile} py10 px10 flex flexRow itemsCenter clx={`${active ? "bg-gray-100 text-black" : "text-gray-800"}`}>
									<Div mr10>
										<UserCircleIcon height={20} width={20} />
									</Div>{" "}
									<Div>Profile</Div>
								</Div>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<Div py10 px10 flex flexRow itemsCenter clx={`${active ? "bg-gray-100 text-black" : "text-gray-800"}`}>
									<Div mr10>
										<SparklesIcon height={20} width={20} />
									</Div>{" "}
									<Div>Switch Avatar</Div>
								</Div>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<Div py10 px10 flex flexRow itemsCenter clx={`${active ? "bg-gray-100 text-black" : "text-gray-800"}`}>
									<Div mr10>
										<KeyIcon height={20} width={20} />
									</Div>{" "}
									<Div>Root Holder</Div>
								</Div>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<Div borderT1 py10 px10 flex flexRow itemsCenter clx={`${active ? "bg-gray-100 text-black" : "text-gray-800"}`}>
									<Div mr10>
										<LockClosedIcon height={20} width={20} />
									</Div>{" "}
									<Div>Log out</Div>
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
