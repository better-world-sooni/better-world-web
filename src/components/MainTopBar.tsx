import { ChatAlt2Icon, ChevronLeftIcon, LockClosedIcon, SparklesIcon, UserCircleIcon } from "@heroicons/react/outline";
import { useDispatch } from "react-redux";
import { switchAccountModalAction } from "src/store/reducers/modalReducer";
import Div from "src/components/Div";
import Row from "src/components/Row";
import Col from "src/components/Col";
import { useRouter } from "next/router";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import { IMAGES } from "src/modules/images";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

const MainTopBar = ({ currentUser, currentNft, backable = false, messageable = false }) => {
	const { back } = useRouter();
	const handleClikChat = () => {
		href(urls.chat.index());
	};
	return (
		<Div fixed bgWhite wFull z100>
			<Row maxW={650} mxAuto flex itemsCenter py3>
				<Col auto cursorPointer>
					{backable ? (
						<Div onClick={back} h={45} flex itemsCenter justifyCenter>
							<ChevronLeftIcon height={25}></ChevronLeftIcon>
						</Div>
					) : (
						<Div imgTag src={IMAGES.betterWorldBlueLogo} h={45} style={{ objectFit: "cover" }} />
					)}
				</Col>
				{backable ? (
					<Col textBase auto px0 cursorPointer onClick={back} fontWeight={500} mt3>
						뒤로
					</Col>
				) : (
					<Col textBase textPrimary auto px0 cursorPointer fontWeight={500}>
						BetterWorld
					</Col>
				)}
				<Col />
				{messageable && (
					<Col auto onClick={handleClikChat} textPrimary>
						<ChatAlt2Icon height={25} />
					</Col>
				)}
			</Row>
		</Div>
	);
};

function ProfileDropdown({ currentNft, currentUser }) {
	const {} = useRouter();
	const dispatch = useDispatch();
	const handleClickProfile = () => {
		if (currentNft) {
			href(urls.nftProfile.index());
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
			<Menu.Button className="shadow-sm">
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
