import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";
import { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";

export default function Dashboard() {
	return (
	<Div maxW={800} rounded1000 bgWhite bgOpacity90>
		<Div fontSize20 testStart maxW={800} mxAuto fontSemibold>
			<Div spanTag textPrimary>
				Dashboard
			</Div>
			가 될 곳입니다.
		</Div>
	</Div>
	);
}