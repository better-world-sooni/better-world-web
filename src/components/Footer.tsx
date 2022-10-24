import { useRouter } from "next/router";
import { IMAGES } from "src/modules/images";
import useIsTablet from "src/hooks/useIsTablet";
import Div from "./Div";
import Row from "./Row";
import Col from "./Col";
import LINKS from "src/modules/links";

export default function Footer({showLogo=true}) {
	const isTablet = useIsTablet();

	if (isTablet) {
		return (
			<Div wFull px20 bgWhite bgOpacity90 borderT1>
				<Div mxAuto maxW={1100} py20>
					<Row itemsCenter>
						{showLogo && <Col auto p30>
							<Div imgTag src={IMAGES.betterWorldBlueLogo} w100></Div>
						</Col>}
						<Col py20 fontSize14>
							<Row py5>
								<Col auto>
									<Div spanTag>BetterWorld from </Div>
									<Div spanTag textSecondary aTag href={LINKS.soonilabs}>
										SOONI Labs
									</Div>
								</Col>
								<Col></Col>
							</Row>
							<Row fontSize12>
								<Col auto>
									<Div spanTag>
										© BetterWorld. ALL RIGHTS RESERVED
									</Div>
								</Col>
								<Col></Col>
							</Row>
						</Col>
					</Row>
				</Div>
			</Div>
		);
	}

	return (
		<Div px80>
			<Div mxAuto maxW={1100} pb30>
				<Row itemsCenter>
					{showLogo && <Col auto p10>
						<Div imgTag src={IMAGES.betterWorl_colorLogo} h50></Div>
					</Col>}
					<Col textBlack py10>
						<Row py2>
							<Col auto>
								<Div spanTag>
									<Div spanTag fontBold>
										BetterWorld
									</Div>{" "}
									from{" "}
								</Div>
								<Div spanTag aTag href={LINKS.soonilabs} fontBold>
									SOONI Labs
								</Div>
							</Col>
							<Col></Col>
						</Row>
						<Row textSm>
							<Col auto>
								<Div spanTag>COPYRIGHT © BetterWorld. ALL RIGHTS RESERVED</Div>
							</Col>
							<Col></Col>
						</Row>
					</Col>
				</Row>
			</Div>
		</Div>
	);
}
