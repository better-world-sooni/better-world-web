import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";
import { useRef } from "react";
import { useDispatch } from "react-redux";

export default function TestAdmin() {
	return (
		<Div maxW={800} rounded1000 bgWhite bgOpacity90>
		<Div fontSize20 textStart maxW={800} mxAuto fontSemibold>
			<Div spanTag textBW>
				TEST
			</Div>
			{" "}입니다.
		</Div>
	</Div>
	);
}