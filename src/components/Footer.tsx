import { useRouter } from "next/router";
import { IMAGES } from "src/modules/images";
import useIsTablet from "src/hooks/useIsTablet";
import Div from "./Div";
import Row from "./Row";
import Col from "./Col";

export default function Footer() {
	const handleClickGomz = () => {
		// href(urls.index);
	};
	const isTablet = useIsTablet();

	if (isTablet) {
		return (
			<Div px20 bgWhite bgOpacity90 borderT1>
				<Div mxAuto maxW={1100} py20>
					<Row itemsCenter>
						<Col auto p30 onClick={handleClickGomz}>
							<Div imgTag src={IMAGES.betterWorldBlueLogo} w100></Div>
						</Col>
						<Col py20 fontSize14>
							<Row py5>
								<Col auto>
									<Div spanTag>WeBe from </Div>
									<Div spanTag textSecondary aTag href={"https://soonilabs.com"}>
										SOONI Labs
									</Div>
								</Col>
								<Col></Col>
							</Row>
							<Row fontSize12>
								<Col auto>
									<Div spanTag>
										COPYRIGHT ©<br></br>WeBe. ALL RIGHTS RESERVED
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
					<Col auto p10 onClick={handleClickGomz}>
						<Div imgTag src={IMAGES.betterWorldBold} h35></Div>
					</Col>
					<Col textSecondary py10>
						<Row py2>
							<Col auto>
								<Div spanTag>
									<Div spanTag fontBold>
										BetterWorld
									</Div>{" "}
									from{" "}
								</Div>
								<Div spanTag aTag href={"https://soonilabs.com"} fontBold>
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
