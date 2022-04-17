import Div from "src/components/Div";
import Helmet from "react-helmet";
import Confetti from "src/components/modals/Confetti";
import Row from "src/components/Row";
import Col from "src/components/Col";
import Image from "next/image";
import MainTopBar from "src/components/MainTopBar";
import { useEffect, useState, useCallback } from "react";
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

export default function Chat({ nftCollection, proposals, about, user }) {

	const {loggedIn, jwt} = useSelector(
		(root: RootState) => root.auth
	);
	const currentUser = user.uuid;
	const [chatRooms, setChatRooms] = useState([]);
	const [currentRoomId, setCurrentRoomId] = useState(null);

	const updateList = useCallback((newmsg) => {
		let list = [...chatRooms];
		let roomId = newmsg['room_id'];
		let index = list.findIndex(x=>x.room.id === roomId);
		list.splice(0, 0, list.splice(index, 1)[0]);
		list[0].last_message = newmsg['text'];
		list[0].unread_count += 1;
		return list;
	}, [chatRooms]);


	useEffect(() => {
		console.log("hi");
		console.log(user);
		console.log(loggedIn, jwt)
		let channel;
		const wsConnect = async () => {
			channel = new ChatChannel({userUuid: currentUser});
			// await cable(jwt).subscribe(channel);
			// const res = await getPromiseFn({
			// 	url: APIS.chat.chatRoom.main().url,
			// 	token,
			// });
			// if (res?.data) {
			// 	const {chat_rooms} = res.data;
			// 	setChatRooms(chat_rooms);
			// }
			// channel.on('message', res => {
			// 	console.log("list receive", res['data'])
			// 	setChatRooms([... updateList(res['data'])])
			// });
			// channel.on('close', () => console.log('Disconnected list socket connection'));
			// channel.on('disconnect', () => channel.send('Dis'));

			const res = await apiHelperWithToken(apis.chat.chatRoom.main());
			console.log(res);
			setChatRooms(res.chat_rooms);
		};
		wsConnect()
		return () => {
			if(channel) {
				channel.disconnect();
				channel.close();
			}
		}
	}, [])

	const openRoom = (currentRoomId) => {
		console.log("click");
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
						currentRoomId = {currentRoomId}
					/>
					: <Image src={IMAGES.betterWorldBWLogo} height={50} width={50} alt="avatarOne"/>
					}
				</Col>
			</Row>
		</Div>
	);
}
