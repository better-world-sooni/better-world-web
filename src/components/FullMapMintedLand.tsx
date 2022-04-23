import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SALE_STATE } from "src/modules/constants";
import { fullMapActions } from "src/store/reducers/fullMapReducer";
import { RootState } from "src/store/reducers/rootReducer";
import Div from "./Div";

const FullMapMintedLand = ({ x, y, size, coverImgSrc, saleState }) => {
	const { selectedLandCoordinates } = useSelector((state: RootState) => ({
		selectedLandCoordinates: state.fullMap.selectedLandCoordinates,
	}));
	const isClicked = selectedLandCoordinates.x == x && selectedLandCoordinates.y == y;
	const dispatch = useDispatch();
	const color = () => {
		if (isClicked) {
			return "#ff3051";
		} else {
			switch (saleState) {
				case SALE_STATE.NOT_FOR_SALE:
					return "#333d4b";
				case SALE_STATE.MINTABLE:
					return "white";
				case SALE_STATE.MINTED:
					return "#3cd278";
				case SALE_STATE.ON_SALE:
					return "#2a97ff";
				default:
					return "#333d4b";
			}
		}
	};
	const handleClickLand = () => {
		dispatch(
			fullMapActions.setSelectedMap({
				x,
				y,
			}),
		);
	};
	return (
		<Div
			style={{
				gridColumnStart: x,
				gridRowStart: y,
				gridColumnEnd: x + size,
				gridRowEnd: y + size,
				backgroundColor: color(),
			}}
			cursorPointer
			onClick={handleClickLand}
		>
			{coverImgSrc && <Div imgTag src={coverImgSrc} wFull hFull p2 cover border0></Div>}
		</Div>
	);
};

export default memo(FullMapMintedLand);
