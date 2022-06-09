import React from "react";

export default function CarouselControl({ index, total, loop, prevHandler, nextHandler }) {
	return (
		<div
			style={{
				position: "absolute",
				width: "100%",
				zIndex: "100",
				bottom: "0",
				textAlign: "center",
			}}
		>
			{(loop || index !== 0) && (
				<div
					style={{
						width: "30px",
						height: "30px",
						cursor: "pointer",
						userSelect: "none",
						position: "absolute",
						bottom: "0",
						font: "16px/30px sans-serif",
						color: "rgba(255,255,255,0.8)",
						left: "0",
					}}
					onClick={prevHandler}
				>
					◀
				</div>
			)}
			{(loop || index !== total - 1) && (
				<div
					style={{
						width: "30px",
						height: "30px",
						cursor: "pointer",
						userSelect: "none",
						position: "absolute",
						bottom: "0",
						font: "16px/30px sans-serif",
						color: "rgba(255,255,255,0.8)",
						right: "0",
					}}
					onClick={nextHandler}
				>
					▶
				</div>
			)}
		</div>
	);
}
