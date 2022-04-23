import { range } from "lodash";
import { useDispatch } from "react-redux";
import { fullMapActions } from "src/store/reducers/fullMapReducer";
import Div from "./Div";

const FullMapGridElements = () => {
	const dispatch = useDispatch();
	return (
		<>
			{[
				range(160000).map((number) => {
					const colStart = number % 400;
					const rowStart = Math.floor(number / 400) + 1;
					return (
						<Div
							bgGray500
							key={number}
							style={{
								gridColumnStart: colStart,
								gridRowStart: rowStart,
								gridColumnEnd: colStart + 1,
								gridRowEnd: rowStart + 1,
							}}
						></Div>
					);
				}),
			]}
		</>
	);
};

export default FullMapGridElements;
