import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";
import MainTopBar from "src/components/MainTopBar";
import Footer from "src/components/Footer";
import React from 'react';
import ReactCardCarousel from "react-card-carousel";
import TypeAnimation from "react-type-animation";
import Fade from 'react-reveal/Fade';
export default function Home({ currentUser, currentNft }) {
	return (
		<>
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Div hScreen px80 flex itemsCenter justifyCenter>
				<Div maxW={1100} mb100 py50 px100>
					{/* <Div flex justifyCenter itemsEnd gapX={10}>
						<Div>
							BetterWorld{" "}
							<Div spanTag italic fontSize12 textPrimary>
								αlpha
							</Div>{" "}
							with
						</Div>
						<Div imgTag w80 src={"https://dkwhovxeipvs0.cloudfront.net/images/logos/webeLogo.png"} />
					</Div> */}
					<Div relative mt200 mb330>
						<ReactCardCarousel autoplay={true} autoplay_speed={2500} spread={"wide"}>
							<Div boxBorder h200 w200 roundedLg imgTag src={IMAGES.webeDraft}></Div>
							<Div boxBorder h200 w200 roundedLg imgTag src={IMAGES.webeDraft2}></Div>
							<Div boxBorder h200 w200 roundedLg imgTag src={IMAGES.webeDraft3}></Div>
						</ReactCardCarousel>
					</Div>
					<Div fontSize48 textCenter mxAuto fontBold bgWhite roundedFull py20>
						애장하는 PFP의{" "}
						<Div spanTag textPrimary>
							특권과 혜택
						</Div>
						,<br></br>이젠 BetterWorld에서 간편하게 누리세요.
					</Div>
					<Div flex justifyCenter mt20 gapX={20}>
						<Div imgTag h50 src={IMAGES.downloadOnAppStore}></Div>
						<Div imgTag h50 src={IMAGES.downloadOnGooglePlay}></Div>
					</Div>
				</Div>
			</Div>
			<Fade up>
				<Div my100 flex justifyCenter itemsCenter>
					<Div flexCol>
						<Div fontBold fontSize32 textCenter> 커뮤니티 포럼 </Div>
						<Div textGray500 mt20 fontSize20 textCenter maxW280>가나다라마바사 가나다라마바,아아아아아, 하이나여노세요. 이제는 이라조다아리다입니다.</Div>
					</Div>
					<Div shadow2xl border5 borderBlack roundedXl ml200 maxW270 imgTag src={IMAGES.appDraft}></Div>
				</Div>
			</Fade>
			<Fade up>
				<Div my100 flex justifyCenter itemsCenter>
					<Div shadow2xl border5 borderBlack roundedXl maxW270 imgTag src={IMAGES.appDraft2}></Div>
					<Div ml200 flexCol>
						<Div fontBold fontSize32 textCenter> 커뮤니티 일정 관리 </Div>
						<Div textGray500 mt20 fontSize20 textCenter maxW280>가나다라마바사 가나다라마바,아아아아아, 하이나여노세요. 이제는 이라조다아리다입니다.</Div>
					</Div>
				</Div>
			</Fade>
			<Fade up>
				<Div my100 flex justifyCenter itemsCenter>
					<Div flexCol>
						<Div fontBold fontSize32 textCenter> 간단한 QR 홀더 인증 </Div>
						<Div textGray500 mt20 fontSize20 textCenter maxW280>가나다라마바사 가나다라마바,아아아아아, 하이나여노세요. 이제는 이라조다아리다입니다.</Div>
					</Div>
					<Div shadow2xl border5 borderBlack roundedXl ml200 maxW270 imgTag src={IMAGES.appDraft3}></Div>
				</Div>
			</Fade>
			<Fade up>
				<Div my100 flex justifyCenter itemsCenter>
					<Div shadow2xl border5 borderBlack roundedXl maxW270 imgTag src={IMAGES.appDraft4}></Div>
					<Div ml200 flexCol>
						<Div fontBold fontSize32 textCenter> 자유로운 익명 소통 </Div>
						<Div textGray500 mt20 fontSize20 textCenter maxW280>가나다라마바사 가나다라마바,아아아아아, 하이나여노세요. 이제는 이라조다아리다입니다.</Div>
					</Div>
				</Div>
			</Fade>
			<Div hScreen wFull flex itemsCenter justifyCenter bgPrimaryLight relative>
				<Div flexCol>
					<Div textSecondary uniSans fontSize={"7vw"} textCenter lineHeight={"6.5vw"}>
						<TypeAnimation cursor={false} sequence={["BetterWorld", 2000, "BetterTogether", 2000, "BetterWorld"]} repeat={3} wrapper="span"></TypeAnimation>
					</Div>
					<Div mt20 uniSans fontSize={"2vw"} textPrimary textCenter>
						Through Non-fungible PFP Communities
					</Div>
					<Div flex justifyCenter mt30 gapX={20}>
						<Div imgTag h50 src={IMAGES.downloadOnAppStore}></Div>
						<Div imgTag h50 src={IMAGES.downloadOnGooglePlay}></Div>
					</Div>
				</Div>
				<Div absolute bottom0 left0>
					<Footer />
				</Div>
			</Div>
		</>
	);
}
