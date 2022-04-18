import Div from "src/components/Div";
import Helmet from "react-helmet";
import Confetti from "src/components/modals/Confetti";
import Row from "src/components/Row";
import Col from "src/components/Col";
import Image from "next/image";
import MainTopBar from "src/components/MainTopBar";
import { useEffect, useState, useCallback, useRef } from "react";
import apis from "src/modules/apis";
import { apiHelperWithToken } from "src/modules/apiHelper";
import { RootState } from 'src/store/reducers/rootReducer';
import { useSelector } from "react-redux";
// import Box from '@mui/material/Box';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import Divider from '@mui/material/Divider';
// import InboxIcon from '@mui/icons-material/Inbox';
// import DraftsIcon from '@mui/icons-material/Drafts';
import { cable } from 'src/modules/cable';
import { ChatChannel } from 'src/pages/chat/chatChannel';
import ChatRoomItem from 'src/pages/chat/chatRoomItem';
import Messages from 'src/pages/chat/messages'
import { IMAGES } from "src/modules/images";
import { getJwt } from 'src/modules/cookieHelper'
import { Alert } from 'react-alert'

export default function Chat({ nftCollection, proposals, about, user }) {

	const jwt = getJwt();
	const userUuid = user.uuid;
	const userAvatar = user.main_nft.nft_metadatum.image_uri;
	const [chatRooms, setChatRooms] = useState([]);
	const [currentRoomId, setCurrentRoomId] = useState(null);
	const [chatSocket, setChatSocket] = useState(null);
	const [enterUsers, setEnterUsers] = useState([]);
	const [messages, setMessages] = useState([]);
	const enterUserFunRef = useRef(null);
	const receiveMessageFunRef = useRef(null);
	const receiveListFunRef = useRef(null);
	const leaveRoomFunRef = useRef(null);

	useEffect(() =>{
		const updateList = newMsg => {
			let roomList = [...chatRooms];
			const roomId = newMsg['room_id'];
			const index = roomList.findIndex(x=>x.room_info.id === roomId);
			roomList.splice(0, 0, roomList.splice(index, 1)[0]);
			roomList[0].last_message = newMsg['text'];
			if(roomId != currentRoomId) {
				console.log(roomList[0]);
				console.log("here", roomId, currentRoomId)
				roomList[0].unread_count += 1;
				console.log(roomList[0]);
			}
			return roomList;
		}
		receiveListFunRef.current = updateList;
	},[chatRooms, currentRoomId])

	useEffect(() => {
		console.log("roomId change", currentRoomId)
		const enterUser = res => {
			if(currentRoomId === res['room']) {
				const newUsers = res['new_users'];
				const newMsgs = res["update_msgs"];
				console.log(currentRoomId, "newUser:", newUsers);
				console.log(currentRoomId, "newMsgs:", newMsgs);
				setEnterUsers(newUsers);
				// setMessages(newMsgs)
			}
		}
		const receiveMessage = res => {

			if(currentRoomId === res['room']) {
				console.log("message receive", res['data']);
				// setMessages((m) => [res['data'], ...m]);
			}
			setChatRooms([...receiveListFunRef.current(res['data'])])

		}
		const leaveRoom = res => {
			if(currentRoomId === res['room']) {
				if(userUuid != res['leave_user']){
					setEnterUsers([...res['new_users']]);
				}
			}
		}
		enterUserFunRef.current = enterUser;
		receiveMessageFunRef.current = receiveMessage;
		leaveRoomFunRef.current = leaveRoom;
	}, [currentRoomId])

	
	useEffect(() => {
		let channel;
		const wsConnect = async () => {
			channel = new ChatChannel({userUuid: userUuid});
			await cable(jwt).subscribe(channel);
			setChatSocket(channel);     
			const res = await apiHelperWithToken(apis.chat.chatRoom.main());
			console.log(res);
			if (res?.chat_rooms) {
				setChatRooms(res.chat_rooms);
			}
			channel.on('enter', res => {
				enterUserFunRef.current(res);
			});
			// let _ = await channel.enter();
			channel.on('message', res => {
				receiveMessageFunRef.current(res);
			});
			channel.on('leave', res => {
				leaveRoomFunRef.current(res);
			})
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

	const refreshUnreadCount = useCallback((roomId) => {
		let roomList = [...chatRooms];
		const index = roomList.findIndex(x=>x.room_info.id === roomId);
		roomList[index].unread_count = 0;
		return roomList;
	}, [chatRooms]);

	const openRoom = async (openRoomId) => {
		console.log(currentRoomId);
		if(currentRoomId != openRoomId) {
			if(currentRoomId != null) {
				let _ = await chatSocket.leave(currentRoomId);
			}
			console.log("open");
			let _ = await chatSocket.enter(openRoomId);
			setCurrentRoomId(openRoomId);
			setChatRooms(refreshUnreadCount(openRoomId));
		}
	}
	const closeRoom = async () => {
		console.log("close");
		let _ = await chatSocket.leave(currentRoomId);
		setCurrentRoomId(null);
		setEnterUsers([]);
		setMessages([]);
	}

	const sendMessage = async(text) => {
		const msg = {
			room_id: currentRoomId,
			user_uuid: userUuid,
			avatar: userAvatar,
			text: text,
			read_user_ids: enterUsers,
		};
		console.log("send", msg);
		if(chatSocket) {
			const _ = await chatSocket.send(msg, currentRoomId);
		} else {
			Alert.alert('네트워크가 불안정하여 메세지를 보내지 못했습니다');
		}
	}


	return (
		<Div>
			<Helmet bodyAttributes={{ style: "background-color : white;" }} />
			<MainTopBar user={user} />
			<Confetti />
			
			<Row flex px30>
				<Col style={{flex:3}} itemsCenter>
					<Div flex1 borderBlack borderB2>
						<input placeholder="Search..."/>
					</Div>
					<Div>
						{chatRooms.length && chatRooms.map((room, index) => {
							const chatRoomId = room.room_info.id;
							const category = room.room_info.category;
							const createdAt = room.room_info.created_at;
							const title = room.room_info.name;
							const numUsers = room.num_users;
							const unreadMessageCount = room.unread_count;
							const lastMessage = room.last_message;
							const firstUserAvatar=room.profile_imgs[0];
							const secondUserAvatar=room.profile_imgs[1];
							const thirdUserAvatar=room.profile_imgs[2];
							const fourthUserAvatar=room.profile_imgs[3];
							return (
								<ChatRoomItem 
									key={index}
									onclick={openRoom}
									chatRoomId={chatRoomId}
									category={category}
									createdAt={createdAt}
									title={title}
									numUsers = {numUsers}
									unreadMessageCount={unreadMessageCount}
									lastMessage={lastMessage}
									firstUserAvatar={firstUserAvatar}
									secondUserAvatar={secondUserAvatar}
									thirdUserAvatar={thirdUserAvatar}
									fourthUserAvatar={fourthUserAvatar}
								/>
							);
						})}
					</Div>
				</Col>
				<Col style={{flex:7}} justifyCenter itemsCenter>
					{currentRoomId ? 
					<Messages
						currentRoomId={currentRoomId}
						userUuid={userUuid}
						userAvatar={userAvatar}
						closeOnClick={closeRoom}
						sendOnClick={sendMessage}
					/>
					: 
					<Image src={IMAGES.betterWorldBWLogo} height={50} width={50} alt="avatarOne"/>
					}
				</Col>
			</Row>
		</Div>
	);
}
