import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiHelper } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { RootState } from "src/store/reducers/rootReducer";
import Div from "./Div";
import EmptyBlock from "./EmptyBlock";

const FullMapDetailsShelf = () => {
	const { selectedLandCoordinates } = useSelector((state: RootState) => ({
		selectedLandCoordinates: state.fullMap.selectedLandCoordinates,
	}));
	const [landDetails, setLandDetails] = useState({
		name: "Welcome to GomzSpace!",
		coverImgSrc: null,
		description: null,
		x: null,
		y: null,
		ownerTag: "@Gomz",
		size: null,
	});
	const setNewLand = async () => {
		const res = await apiHelper(apis.land.get(selectedLandCoordinates.x, selectedLandCoordinates.y));
		setLandDetails(res.data);
	};

	useEffect(() => {
		if (selectedLandCoordinates.x && selectedLandCoordinates.y) {
			setNewLand();
		} else {
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedLandCoordinates.x, selectedLandCoordinates.y]);

	return (
		<Div fixed hFull w400 px30 overflowScroll right0>
			<EmptyBlock h={80} />
			<Div overflowHidden w={"100%"} z10 rounded20 shadowLg>
				{landDetails.coverImgSrc ? (
					<Div imgTag src={landDetails.coverImgSrc} wFull hFull></Div>
				) : (
					<Div bgBlack p30>
						<video autoPlay width="100%" muted loop>
							<source src="/gomRoomz.mp4" type="video/mp4" />
						</video>
					</Div>
				)}
			</Div>
			<Div bgColor={"rgb(21, 21, 23)"} shadowLg rounded20 py15 mt15 px15>
				<Div textGray200 fontBold>{`Space at ${selectedLandCoordinates.x} ${selectedLandCoordinates.y}`}</Div>
				<Div textInfo mb10>
					{landDetails.ownerTag}
				</Div>
				<Div textGray200 fontLight>
					{landDetails.description}
				</Div>
				<Div rounded10 bgSuccess textWhite mx15 mt15 p15 textCenter>
					Enter
				</Div>
			</Div>
			<Div flexRow flex gapX10 mt15>
				<Div flex1 bgGray200 shadowLg rounded20 py15 px15>
					<Div textGray700 textSm fontLight>
						Location
					</Div>
					<Div textSuccess fontBold mt5>
						{`${landDetails.x} ${landDetails.y}`}
					</Div>
				</Div>
				<Div flex1 bgGray200 shadowLg rounded20 py15 px15>
					<Div textGray700 textSm fontLight>
						Size
					</Div>
					<Div textGray900 fontBold mt5>
						{landDetails.size}
					</Div>
				</Div>
			</Div>
			<Div bgColor={"rgb(21, 21, 23)"} shadowLg rounded20 mt15 overflowHidden>
				<iframe src={"https://www.youtube.com/embed/sFLihNpBsrc"} title="@irlyglo" width="100%" height={400}></iframe>
			</Div>
		</Div>
	);
};

export default FullMapDetailsShelf;
