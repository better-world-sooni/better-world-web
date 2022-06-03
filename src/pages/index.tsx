import Col from "src/components/Col";
import Div from "src/components/Div";
import Row from "src/components/Row";
import { elastic as Menu } from "react-burger-menu";
import { IMAGES } from "src/modules/images";
import TypeAnimation from "react-type-animation";
import { MenuIcon } from "@heroicons/react/outline";
import { COLORS } from "src/modules/constants";
import Slider from "react-slick";
const burgerStyles = {
	bmBurgerButton: {
		position: "fixed",
		width: "36px",
		height: "30px",
		left: "36px",
		top: "36px",
	},
	bmBurgerBars: {
		background: "black",
	},
	bmBurgerBarsHover: {
		background: COLORS.GRAY700,
	},
	bmCrossButton: {
		height: "24px",
		width: "24px",
	},
	bmCross: {
		background: "white",
	},
	bmMenuWrap: {
		position: "fixed",
		height: "100%",
	},
	bmMenu: {
		background: "black",
		padding: "2.5em 1.5em 0",
		fontSize: "1.15em",
	},
	bmMorphShape: {
		fill: "black",
	},
	bmItemList: {
		color: "#b8b7ad",
		padding: "0.8em",
	},
	bmItem: {
		display: "inline-block",
	},
	bmOverlay: {
		background: "rgba(0, 0, 0, 0.3)",
	},
};
export default function Home() {
	return (
		<>
			<Div px80 sticky top0 background bgWhite bgOpacity90>
				<Div maxW={1100} mxAuto>
					<Div flex itemsCenter py4 gapX={8}>
						<Div rounded10 p4>
							<Div h44 imgTag src={IMAGES.betterWorldBlueLogo}></Div>
						</Div>
						<Div fontBold>BetterWorld</Div>
						<Div flex1 />
						<Div px8 fontSize14>
							위비 온보딩
						</Div>
						<Div px8 fontSize14>
							앱 로그인 큐알 재발급
						</Div>
						<Div px8 fontSize14>
							앱 비밀번호 재설정
						</Div>
						<Div ml8 textWhite bgBlack rounded100 fontSize14 py8 px16>
							지갑 연결
						</Div>
					</Div>
				</Div>
			</Div>
			<Div hScreen px80>
				<Div maxW={1100} mxAuto>
					<Div flex justifyCenter itemsCenter gapX={10} mt100>
						<Div h50 imgTag src={IMAGES.betterWorldBlueLogo}></Div>
						<Div fontBold>
							BetterWorld{" "}
							<Div spanTag italic fontSize12>
								αlpha
							</Div>
						</Div>
					</Div>
					<Div textCenter fontSize24>
						위비들의 모바일 자치 조직
					</Div>
					<Div fontSize56 textCenter maxW={800} mxAuto fontSemibold mt100>
						애장하는 PFP의{" "}
						<Div spanTag textPrimary>
							특권과 혜택
						</Div>
						, 베터월드에서 수행하고 공유해요.
					</Div>
					<Div flex justifyCenter mt40 gapX={20}>
						<Div imgTag h50 src={IMAGES.downloadOnAppStore}></Div>
						<Div imgTag h50 src={IMAGES.downloadOnGooglePlay}></Div>
					</Div>
				</Div>
			</Div>
			<Div hScreen wScreen flex itemsCenter justifyCenter bgPrimaryLight>
				<Div>
					<Div uniSans fontSize={"7vw"} textCenter lineHeight={"6.5vw"}>
						<TypeAnimation cursor={false} sequence={["BetterWorld", 2000, "BetterTogether", 2000, "BetterWorld"]} repeat={3} wrapper="span" />
					</Div>
					<Div uniSans fontSize={"2vw"} textPrimary textCenter>
						through Nonfungible PFP Communities
					</Div>
					<Div fontSize20 mt40 textCenter>
						앱을 다운로드 하세요
					</Div>
					<Div flex justifyCenter py15 gapX={20}>
						<Div imgTag h50 src={IMAGES.downloadOnAppStore}></Div>
						<Div imgTag h50 src={IMAGES.downloadOnGooglePlay}></Div>
					</Div>
				</Div>
			</Div>
		</>
	);
}
