import { GlobeAltIcon } from "@heroicons/react/outline";
import { useDispatch, useSelector } from "react-redux";
import useIsTablet from "src/hooks/useIsTablet";

import { RootState } from "src/store/reducers/rootReducer";
import Link from "next/link";
import Col from "./Col";
import Div from "./Div";
import Row from "./Row";
import { urls } from "src/modules/urls";
import { moveTo } from "src/modules/routeHelper";
import LocaleDropdown from "./LocaleDropDown";
import { useRouter } from "next/router";
import { pagesWording } from "src/wording/pages";

const TopBar = ({ mode }) => {
	const isTablet = useIsTablet();
	const { locale, pathname } = useRouter();
	const textColorProp = mode == "dark" ? { textWhite: true } : { textBlack: true };
	return (
		<Div absolute wFull z100 {...textColorProp}>
			<Row flex justifyCenter py20 mx30={!isTablet} mx10={isTablet}>
				<Col />
				{isTablet ? (
					<>
						<Col auto flex itemsCenter cursorPointer>
							<LocaleDropdown />
						</Col>
					</>
				) : (
					<>
						<Col auto flex itemsCenter cursorPointer>
							<LocaleDropdown />
						</Col>
					</>
				)}
			</Row>
		</Div>
	);
};

export default TopBar;
