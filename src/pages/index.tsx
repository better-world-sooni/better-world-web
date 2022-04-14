import Div from "src/components/Div";
import Helmet from "react-helmet";
import Confetti from "src/components/modals/Confetti";
import TopBar from "src/components/HomeTopBar";
import EmptyBlock from "src/components/EmptyBlock";
import Row from "src/components/Row";
import Col from "src/components/Col";
import { IMAGES } from "src/modules/images";
import { truncateKlaytnAddress } from "src/modules/constants";

export default function Home({ user }) {
	return (
		<Div>
			<Helmet bodyAttributes={{ style: "background-color : white;" }} />
			<TopBar user={user} />
			<Confetti />
			<Div>
				<EmptyBlock h={200} />
				<Div mxAuto maxW={700} px30 text2xl textCenter fontSemibold>
					당신은 보유한 NFT에게{" "}
					<Div spanTag textPrimary>
						케릭터
					</Div>
					와{" "}
					<Div spanTag textPrimary>
						인생
					</Div>
					을 만들어 줄 수 있습니다.
				</Div>
				<EmptyBlock h={30} />
				<Div textCenter maxW={800} px30 mxAuto textLg>
					BetterWorld 는 인생이 주어진 아바타 끼리 만드는{" "}
					<Div spanTag textPrimary>
						더 나은 세상{" "}
					</Div>
					입니다.
				</Div>
				<EmptyBlock h={100} />
			</Div>
			<Div mxAuto maxW={1100} px30>
				<EmptyBlock h={200} />
				<Div>© 2022 Sooni Labs</Div>
				<EmptyBlock h={20} />
			</Div>
		</Div>
	);
}
