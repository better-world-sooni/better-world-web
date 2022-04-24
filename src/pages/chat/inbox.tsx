import Div from "src/components/Div";
import Row from "src/components/Row";
import Col from "src/components/Col";
import Helmet from "react-helmet";
import Confetti from "src/components/modals/Confetti";
import MainTopBar from "src/components/MainTopBar";
import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import { cable } from 'src/modules/cable';
import { ChatChannel } from 'src/pages/chat/chatChannel';
import ChatRoomItem from 'src/pages/chat/chatRoomItem';
import ChatRoom from 'src/pages/chat/chatRoom'
import { IMAGES } from "src/modules/images";
import { getJwt } from 'src/modules/cookieHelper'
import { Alert } from 'react-alert'
import { NextPageContext } from "next";
import { apiHelperWithJwtFromContext, apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";


function Inbox({ currentUser, currentNft, chat_rooms }) {
	const jwt = getJwt();
	const currentNftId = {"token_id": currentNft.token_id, "contract_address": currentNft.contract_address}

	const [chatRooms, setChatRooms] = useState(chat_rooms);
	const [chatSocket, setChatSocket] = useState(null);

	const updateRoomList = useCallback((newMsg, roomId) => {
		const roomList = [...chatRooms];
		const index = roomList.findIndex(x=>x.room_info._id.$oid === roomId);
		roomList.splice(0, 0, roomList.splice(index, 1)[0]);
		roomList[0].last_message = newMsg['text'];
		roomList[0].unread_count += 1;
		console.log(roomList[0]);
	
		return roomList;
	}, [chatRooms]);


	useEffect(() => {
		const channel = new ChatChannel(currentNftId);;
		const wsConnect = async () => {
			await cable(jwt).subscribe(channel);
			setChatSocket(channel);     

			channel.on('message', res => {
				const newRoomList = updateRoomList(res['data'], res['room'])
			});

			channel.on('close', () => console.log('Disconnected from chat'));
			channel.on('disconnect', () => console.log("check disconnect"));
		};
		wsConnect()
		return () => {
			if(channel) {
				channel.disconnect();
				channel.close();
			}
		}
	}, [])

	
	const openRoom = async (openRoomId, numNfts) => {
		console.log("room click");
	}



	return (
		<Div>
			<Helmet bodyAttributes={{ style: "background-color : white;" }} />
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Confetti />

			<Row flex px30>
				<Col itemsCenter>
					<Div flex1 borderBlack borderB2>
						<input placeholder="Search..." />
					</Div>
					<Div>
						{chatRooms.length && chatRooms.map((room, index) => {
							return (
								<ChatRoomItem 
									key={index}
									onclick={openRoom}
									room={room}
								/>
							);
						})}

					</Div>
				</Col>
			</Row>
		</Div>
	);
}




Inbox.getInitialProps = async (context: NextPageContext) => {
	const res = await apiHelperWithJwtFromContext(context, apis.chat.chatRoom.main(), "GET");
	return res;
};
export default Inbox;