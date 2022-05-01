import { COLORS, truncateKlaytnAddress } from "src/modules/constants";
import webviewPostMessage from "src/modules/webviewPostMessage";
import Div from "../Div";
import EmptyBlock from "../EmptyBlock";
import TruncatedText from "./TruncatedText";

export default function ActiveCapsules({ capsule_owners, currentNft }) {
	return (
		<Div
			style={{ whiteSpace: "nowrap", overflow: "auto", borderBottom: "0.1px solid", borderColor: COLORS.GRAY400 }}
			clx={"scrollbar-off"}
			bgWhite
			py5
		>
			<ActiveCapsule capsuleOwner={currentNft} mine />
			{capsule_owners.map((capsuleOwner, index) => {
				return <ActiveCapsule capsuleOwner={capsuleOwner} key={index} />;
			})}
		</Div>
	);
}

function ActiveCapsule({ capsuleOwner, mine = false }) {
	const handleClickCapsule = () => {
		webviewPostMessage({
			action: "handleClickCapsule",
			params: { contractAddress: capsuleOwner.contract_address, tokenId: capsuleOwner.token_id },
		});
	};
	return (
		<Div w60 inlineBlock mx10 onClick={handleClickCapsule}>
			<Div imgTag src={capsuleOwner.nft_metadatum.image_uri} w60 h60 roundedFull></Div>
			<EmptyBlock h={5} />
			<Div textCenter textXs>
				{mine ? "내 캡슐 입장" : TruncatedText({ text: capsuleOwner.name || capsuleOwner.nft_metadatum.name, maxLength: 12 })}
			</Div>
		</Div>
	);
}
