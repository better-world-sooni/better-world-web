import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";
import Bubbles from "src/components/Bubbles";
import MainTopBar from "src/components/MainTopBar";
import Footer from "src/components/Footer";
export default function Home({ currentUser, currentNft }) {
	return (
		<>
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Div hScreen px80 flex itemsCenter justifyCenter>
				{/* <Bubbles /> */}
				<Div maxW={1100} mb100 py50 px100>
					<Div flex justifyCenter itemsEnd gapX={10}>
						<Div fontBold>
							BetterWorld{" "}
							<Div spanTag italic fontSize12 textPrimary>
								αlpha
							</Div>{" "}
							with
						</Div>
						<Div imgTag w80 src={"https://dkwhovxeipvs0.cloudfront.net/images/logos/webeLogo.png"} />
					</Div>
					<Div textCenter fontSize14 mt10 italic mb20>
						위비의 모바일 자치 조직
					</Div>
					<Div fontSize56 textCenter maxW={800} mxAuto fontSemibold bgWhite roundedFull py20>
						애장하는 PFP의{" "}
						<Div spanTag textPrimary>
							특권과 혜택
						</Div>
						, 베터월드에서 수행하고 공유해요.
					</Div>
					<Div flex justifyCenter mt20 gapX={20}>
						<Div imgTag h50 src={IMAGES.downloadOnAppStore}></Div>
						<Div imgTag h50 src={IMAGES.downloadOnGooglePlay}></Div>
					</Div>
				</Div>
			</Div>
			<Footer />
		</>
	);
}
