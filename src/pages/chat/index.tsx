import Div from "src/components/Div";
import Row from "src/components/Row";
import Col from "src/components/Col";
import Helmet from "react-helmet";
import MainTopBar from "src/components/MainTopBar";
import { useEffect, useState, useCallback, useRef } from "react";
import { cable } from "src/modules/cable";
import { ChatChannel } from "src/modules/chatChannel";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { apiHelperWithJwtFromContext, apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import WebviewWrapper from "src/components/WebviewWrapper";
import useRefreshContent from "src/hooks/useRefeshContent";
import ChatRoomItem from "src/components/chat/chatRoomItem";

function Inbox({ currentUser, currentNft, chat_rooms, jwt }) {
	const currentNftId = { token_id: currentNft.token_id, contract_address: currentNft.contract_address };
	const [chatRooms, setChatRooms] = useState(chat_rooms);
	const [chatSocket, setChatSocket] = useState(null);
	const updateListRef = useRef(null);
	const refreshQuery = async () => {
		const res = await apiHelperWithToken(apis.chat.chatRoom.all(), "GET");
		return res.chat_rooms;
	};

	useEffect(() => {
		const updateList = (newRoom) => {
			const index = chatRooms.findIndex((x) => x.room_info._id.$oid === newRoom.room_info._id.$oid);
			newRoom.unread_count = 1;
			if (index > -1) {
				if (chatSocket) chatSocket.newRoomOpen(newRoom.room_info._id.$oid);
				newRoom.unread_count = chatRooms[index].unread_count + 1;
				setChatRooms((prev) => [newRoom, ...prev.filter((_, i) => i != index)]);
			} else {
				setChatRooms((prev) => [newRoom, ...prev]);
			}
		};
		updateListRef.current = updateList;
	}, [chatRooms]);

	useEffect(() => {
		const channel = new ChatChannel(currentNftId);
		const wsConnect = async () => {
			await cable(jwt).subscribe(channel);
			setChatSocket(channel);
			channel.on("message", (res) => {
				updateListRef.current(res["room"]);
			});
			channel.on("close", () => console.log("Disconnected from chat"));
			channel.on("disconnect", () => console.log("check disconnect"));
		};
		wsConnect();
		return () => {
			if (channel) {
				channel.disconnect();
				channel.close();
			}
		};
	}, []);

	const openRoom = async (openRoomId, numNfts) => {
		href(urls.chat.room(openRoomId));
	};

	return (
		<WebviewWrapper currentNft={currentNft} currentUser={currentUser} pullable={false} backable>
			<Div px15>
				{chatRooms.length > 0 &&
					chatRooms.map((room, index, arr) => {
						return <ChatRoomItem key={index} onClick={openRoom} room={room} index={index} length={arr.length} />;
					})}
			</Div>
		</WebviewWrapper>
	);
}

Inbox.getInitialProps = async (context: NextPageContext) => {
	const res = await apiHelperWithJwtFromContext(context, apis.chat.chatRoom.all(), "GET");
	return res;
};
export default Inbox;