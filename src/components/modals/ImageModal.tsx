import Div from "../Div";
import Modal from "./Modal";

export default function ImageModal({ open, imgSrcArr = [], handleCloseModal }) {
	return (
		<Modal open={open} onClose={handleCloseModal} bdClx={"bg-black/30"}>
			<Div w800 my20>
				{imgSrcArr.map((imgSrc, index) => {
					return <Div key={index} imgTag wFull hAuto src={imgSrc} roundedXl mb20 />;
				})}
			</Div>
		</Modal>
	);
}
