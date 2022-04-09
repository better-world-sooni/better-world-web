import Div from "src/components/Div";
import Helmet from "react-helmet";
import Confetti from "src/components/modals/Confetti";
import TopBar from "src/components/HomeTopBar";
import EmptyBlock from "src/components/EmptyBlock";
import Row from "src/components/Row";
import Col from "src/components/Col";
import { IMAGES } from "src/modules/images";
import { truncateKlaytnAddress } from "src/modules/constants";

export default function Home() {
	return (
		<Div>
			<Helmet bodyAttributes={{ style: "background-color : white;" }} />
			<TopBar mode={"light"} />
			<Confetti />
			<Div>
				<EmptyBlock h={200} />
				<Div mxAuto maxW={700} px30 textXxl textCenter fontSemibold>
					BetterWorld 는 당신의 NFT 와 함께 만드는{" "}
					<Div spanTag textPrimary>
						더 나은 세상{" "}
					</Div>
					입니다.
				</Div>
				<EmptyBlock h={50} />
				<Div textSm textCenter maxW={800} px30 mxAuto>
					αlpha 의 3가지 매채는 web3 탈중앙성과 web2 유저 친화적 기반을 사용하여 NFT 생태계를{" "}
					<Div spanTag textPrimary>
						단결된 커뮤니티
					</Div>
					로 탈바꿈할 것입니다.
				</Div>
				<EmptyBlock h={100} />
			</Div>
			<Div mxAuto maxW={1100} px30>
				<Div>
					<Row my20>
						<Col />
						<Col auto>
							<Div textCenter textLg roundedFull px30 py20 cursorPointer border1>
								KIP17Enumerable Forum 과 DAO
							</Div>
						</Col>
						<Col />
					</Row>
					<Div imgTag src={IMAGES.gomzDAOExample}></Div>
				</Div>
				<EmptyBlock h={100} />
				<Div>
					<Row my20>
						<Col />
						<Col auto>
							<Div textCenter textLg roundedFull px30 py20 cursorPointer border1>
								웹/앱 2d 메타소셜 공간
							</Div>
						</Col>
						<Col />
					</Row>
					<Div maxW={800} mxAuto overflowHidden rounded3xl p50 bgBlack>
						<video autoPlay width="100%" muted loop>
							<source src={IMAGES.metaverse} type="video/mp4" />
						</video>
					</Div>
				</Div>
				<EmptyBlock h={100} />
				<Div>
					<Row my20>
						<Col />
						<Col auto>
							<Div textCenter textLg roundedFull px30 py20 cursorPointer border1>
								입증된 홀더들과 채팅
							</Div>
						</Col>
						<Col />
					</Row>
					<Div maxW={800} mxAuto overflowHidden rounded3xl p50 bgBlack>
						<video autoPlay width="100%" muted loop>
							<source src={IMAGES.metaverse} type="video/mp4" />
						</video>
					</Div>
				</Div>
				<EmptyBlock h={200} />
				<Div>© 2022 Sooni Labs</Div>
				<EmptyBlock h={20} />
			</Div>
		</Div>
	);
}
