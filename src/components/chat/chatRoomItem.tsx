import Div from "src/components/Div";
import Row from "src/components/Row";
import Col from "src/components/Col";
import { useCallback } from "react";
import { kmoment } from "src/modules/constants";
import ChatRoomItemAvatars from "./chatRoomItemAvatars";
import TruncatedText from "../common/TruncatedText";

export default function ChatRoomItem({ onClick, room, length, index }) {
	const isLast = length - 1 == index;
	const roomId = room.room_info._id.$oid;
	const category = room.room_info.category;
	const updatedAt = room.room_info.updated_at;
	const roomName = room.room_name;
	const numNfts = room.room_info.participants.length;
	const unreadMessageCount = room.unread_count;
	const lastMessage = room.last_message;
	const profileImg = room.room_profile_imgs;

	const updatedAtText = useCallback((updatedAt) => {
		if (updatedAt) {
			const calendar = kmoment(updatedAt).calendar();
			const calendarArr = calendar.split(" ");
			if (calendarArr[0] == "오늘") {
				return calendarArr[1] + " " + calendarArr[2];
			}
			if (calendarArr[0] == "어제") {
				return calendarArr[0];
			}
			return calendarArr[0] + " " + calendarArr[1];
		}
		return null;
	}, []);

	return (
		<Div>
			<Row bgWhite onClick={() => onClick(roomId, numNfts)} py5 cursorPointer>
				<Col auto relative>
					<Div roundedLg overflowHidden h50>
						<ChatRoomItemAvatars profileImg={profileImg} />
					</Div>
				</Col>
				<Col>
					<Row>
						<Col pr10 auto maxW={"60%"}>
							<Div textBase>{roomName}</Div>
						</Col>
						<Col>
							<Div textSm textRight>
								{updatedAtText(updatedAt)}
							</Div>
						</Col>
					</Row>
					<Row w={"100%"} pt2>
						<Col pr10>
							<Div fontSize={15}>{TruncatedText({ text: lastMessage, maxLength: 30 })}</Div>
						</Col>
						{unreadMessageCount > 0 && (
							<Col auto fontSize={15} rounded30 bgDanger px5 justifyCenter>
								<Div color={"white"}>{unreadMessageCount >= 100 ? "99+" : unreadMessageCount}</Div>
							</Col>
						)}
					</Row>
				</Col>
			</Row>
		</Div>
	);
}
