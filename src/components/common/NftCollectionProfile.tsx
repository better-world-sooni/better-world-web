import { BadgeCheckIcon } from "@heroicons/react/outline";
import { memo } from "react";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import Col from "../Col";
import Div from "../Div";
import EmptyBlock from "../EmptyBlock";
import Row from "../Row";

function NftCollectionProfile({ image_uri, name, contract_address, collection_member_count, joined, verified }) {
	const handleClickProfile = () => {
		href(urls.collection.contractAddress(contract_address));
	};
	return (
		<Div w250 mxAuto roundedXl border1 py30 px20 cursorPointer onClick={handleClickProfile}>
			<Div w100 h100 imgTag src={image_uri} mxAuto roundedFull bgGray200></Div>
			<Row fontSemibold textLg flex itemsCenter>
				<Col />
				<Col auto px0>
					{name}
				</Col>
				{verified && (
					<Col auto pl2 pr0>
						<BadgeCheckIcon height={20} width={20} />
					</Col>
				)}
				<Col />
			</Row>
			<Div textCenter>{collection_member_count} 멤버</Div>
			<Div h50 mxAuto roundedFull mt20 flex itemsCenter justifyCenter border1>
				<Div>{joined ? "참여중" : "참여"}</Div>
			</Div>
		</Div>
	);
}

export default memo(NftCollectionProfile);
