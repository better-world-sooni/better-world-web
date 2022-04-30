import Div from "src/components/Div";
import Row from "src/components/Row";
import Col from "src/components/Col";
import Image from "next/image";
import { IMAGES } from "src/modules/images";

const Messages = ({ messages, currentNftId, numNfts }) => {
	const isSameNft = (nft1, nft2) => nft1?.token_id === nft2?.token_id && nft1?.contract_address === nft2?.contract_address;
	return (
		<Div overflowHidden overflowAuto px20>
			{messages.map((message, index) => {
				const author = message.nft;
				const isConsecutive = isSameNft(messages[index - 1]?.nft, author);
				const isMine = isSameNft(author, currentNftId);
				const text = message.text;
				const time = new Date(message.created_at);
				const avatar = message.avatar;
				const unreadCount = numNfts - message.read_nft_ids.length;
				return (
					<Div key={index}>
						<Row {...(isMine && { flexRowReverse: true })} itemsEnd py3>
							<Col auto w28 px0 mb3>
								{!isConsecutive && <Div roundedLg imgTag src={avatar} h28 w28 />}
							</Col>
							<Col style={{ flex: 5, wordBreak: "break-all" }} flex flexRow {...(isMine && { flexRowReverse: true })} itemsEnd>
								<Div bgGray100={!isMine} bgPrimary={isMine} textWhite={isMine} roundedXl px15 py5>
									{text}
								</Div>
								<Div px10 textXs>
									{Boolean(unreadCount) && <Div>{unreadCount}</Div>}
								</Div>
							</Col>
							<Col style={{ flex: 1 }}></Col>
						</Row>
					</Div>
				);
			})}
		</Div>
	);
};
export default Messages;
