import Col from "./Col";
import Div from "./Div";
import Row from "./Row";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import { IMAGES } from "src/modules/images";
import EmptyBlock from "./EmptyBlock";

const OnboardingTopBar = () => {
	return (
		<>
			<Div fixed bgWhite wFull borderB1 px30 z1>
				<Row maxW={1100} mxAuto flex itemsCenter py5 gapX={10}>
					<Col auto px0 onClick={() => href(urls.home())}>
						<Div imgTag src={IMAGES.betterWorldBlueLogo} h={50} w={50} style={{ objectFit: "cover" }} />
					</Col>
					<Col textLg textPrimary auto px0 onClick={() => href(urls.index())} cursorPointer>
						BetterWorld{" "}
						<Div spanTag fontSemibold textPrimary pl2>
							αlpha
						</Div>
					</Col>
					<Col></Col>
				</Row>
			</Div>
			<EmptyBlock h={80} />
		</>
	);
};

export default OnboardingTopBar;
