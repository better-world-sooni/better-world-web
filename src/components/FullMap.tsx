import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import FullMapGridElements from "./FullMapGridElements";
import FullMapMintedLand from "./FullMapMintedLand";
import Div from "./Div";
import { RootState } from "src/store/reducers/rootReducer";
import { useSelector } from "react-redux";

const FullMap = ({ lands }) => {
	return (
		<TransformWrapper
			initialScale={1}
			initialPositionX={0}
			initialPositionY={0}
			minPositionX={0}
			maxPositionX={100}
			minPositionY={0}
			maxPositionY={100}
			limitToBounds={false}
			minScale={0.2}
		>
			<TransformComponent>
				<Div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(400, 5px)",
						gridTemplateRows: "repeat(400, 5px)",
						gridGap: "1px",
						// backgroundColor: "#191f28",
						width: "2399px",
						height: "2399px",
					}}
				>
					<FullMapGridElements />
					<Div
						style={{
							gridColumnStart: 150,
							gridRowStart: 150,
							gridColumnEnd: 249,
							gridRowEnd: 249,
							outline: "1px solid white",
						}}
					></Div>
					{lands.map((elem) => {
						const id = `${elem.x}, ${elem.y}`;
						return <FullMapMintedLand x={elem.x} y={elem.y} saleState={elem.saleState} size={elem.size} coverImgSrc={elem.coverImgSrc} key={id} />;
					})}
				</Div>
			</TransformComponent>
		</TransformWrapper>
	);
};

export default FullMap;
