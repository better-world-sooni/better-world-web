import Div from "src/components/Div";
import Row from "src/components/Row";
import Col from "src/components/Col";
import Helmet from "react-helmet";
import Confetti from "src/components/modals/Confetti";
import MainTopBar from "src/components/MainTopBar";
import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import apis from "src/modules/apis";
import { apiHelperWithToken } from "src/modules/apiHelper";
import { cable } from 'src/modules/cable';
import { ChatChannel } from 'src/pages/chat/chatChannel';
import ChatRoomItem from 'src/pages/chat/chatRoomItem';
import ChatRoom from 'src/pages/chat/chatRoom'
import { IMAGES } from "src/modules/images";
import { getJwt } from 'src/modules/cookieHelper'
import { Alert } from 'react-alert'

export default function Chat({ nftCollection, proposals, about, currentUser, currentNft }) {
	console.log("chat start")
	const jwt = getJwt();
	const currentNftId = {"token_id": currentNft.token_id, "contract_address": currentNft.contract_address}
	const currentAvatar = currentNft.nft_metadatum.image_uri;
	const [chatRooms, setChatRooms] = useState([]);
	const [currentRoomId, setCurrentRoomId] = useState(null);
	const [chatSocket, setChatSocket] = useState(null);
	const [enterNfts, setEnterNfts] = useState([]);
	const [messages, setMessages] = useState([]);
	const [currentRoomNfts, setCurrentRoomNfts] = useState(null);
	const enterNftFunRef = useRef(null);
	const receiveMessageFunRef = useRef(null);
	const receiveListFunRef = useRef(null);
	const leaveRoomFunRef = useRef(null);

	useEffect(() => {
		console.log("nfts: ", enterNfts);
	}, [enterNfts])

	useEffect(() => {
		const updateList = (newMsg, roomId) => {
			let roomList = [...chatRooms];
			const index = roomList.findIndex(x=>x.room_info._id.$oid === roomId);
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
		const enterNft = res => {
			if(currentRoomId === res['room']) {
				const newNfts = res['new_nfts'];
				const newMsgs = res["update_msgs"];
				console.log(currentRoomId, "newNft:", newNfts);
				console.log(currentRoomId, "newMsgs:", newMsgs);
				setEnterNfts(newNfts);
				setMessages(newMsgs)
			}
		}
		const receiveMessage = res => {
			if(currentRoomId === res['room']) {
				console.log("message receive", res['data']);
				setMessages((m) => [...m, res['data']]);
			}
			setChatRooms([...receiveListFunRef.current(res['data'], res['room'])])
		}
		const leaveRoom = res => {
			if(currentRoomId === res['room']) {
				if(currentNftId != res['leave_nft']){
					const newNfts = res['new_nfts'];
					console.log(newNfts);
					setEnterNfts(newNfts);
				}
			}
		}
		enterNftFunRef.current = enterNft;
		receiveMessageFunRef.current = receiveMessage;
		leaveRoomFunRef.current = leaveRoom;
	}, [currentRoomId])

	
	useEffect(() => {
		let channel;
		const wsConnect = async () => {
			const res = await apiHelperWithToken(apis.chat.chatRoom.main());
			if (res?.chat_rooms) {
				setChatRooms(res.chat_rooms);
			}
			channel = new ChatChannel(currentNftId);
			await cable(jwt).subscribe(channel);
			setChatSocket(channel);     
			channel.on('enter', res => {
				enterNftFunRef.current(res);
			});
			channel.on('message', res => {
				receiveMessageFunRef.current(res);
			});
			channel.on('leave', res => {
				console.log(res)
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
		const index = roomList.findIndex(x=>x.room_info._id.$oid === roomId);
		roomList[index].unread_count = 0;
		return roomList;
	}, [chatRooms]);

	const openRoom = async (openRoomId, numNfts) => {
		console.log(currentRoomId);
		if(currentRoomId != openRoomId) {
			if(currentRoomId != null) {
				let _ = await chatSocket.leave(currentRoomId);
			}
			console.log("open");
			let _ = await chatSocket.enter(openRoomId);
			setCurrentRoomId(openRoomId);
			setChatRooms(refreshUnreadCount(openRoomId));
			setCurrentRoomNfts(numNfts);
		}
	}
	const closeRoom = async () => {
		console.log("close");
		let _ = await chatSocket.leave(currentRoomId);
		setCurrentRoomId(null);
		setEnterNfts([]);
		setMessages([]);
		setCurrentRoomNfts(null);
	}

	const sendMessage = async(text) => {
		const Timestamp = new Date();
		const msg = {
			text: text,
			nft: currentNftId,
			avatar: currentAvatar,
			read_nft_ids: enterNfts,
			created_at: Timestamp,
			updated_at: Timestamp
		};
		if(chatSocket) {
			const _ = await chatSocket.send(msg, currentRoomId);
		} else {
			Alert.alert('네트워크가 불안정하여 메세지를 보내지 못했습니다');
		}
	}


	return (
		<Div>
			<Helmet bodyAttributes={{ style: "background-color : white;" }} />
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Confetti />

			<Row flex px30>
				<Col style={{ flex: 3 }} itemsCenter>
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
				<Col style={{flex:7}} justifyCenter itemsCenter hScreen>
					{currentRoomId ? 
					<ChatRoom
						currentRoomId={currentRoomId}
						currentNftId={currentNftId}
						messages={messages}
						numNfts={currentRoomNfts}
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
