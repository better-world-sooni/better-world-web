import Div from "src/components/Div";
import Helmet from "react-helmet";
import Confetti from "src/components/modals/Confetti";
import EmptyBlock from "src/components/EmptyBlock";
import Row from "src/components/Row";
import Col from "src/components/Col";
import { IMAGES } from "src/modules/images";
import { truncateKlaytnAddress } from "src/modules/constants";
import MainTopBar from "src/components/MainTopBar";

export default function Home() {
	return (
		<Div>
			<Helmet bodyAttributes={{ style: "background-color : white;" }} />
			<MainTopBar mode={"light"} />
			<Confetti />
			<Div mxAuto maxW={1100} px30>
				<Row>
					<Col></Col>
				</Row>
				<EmptyBlock h={200} />
				<Div>© 2022 Sooni Labs</Div>
				<EmptyBlock h={20} />
			</Div>
		</Div>
	);
}
