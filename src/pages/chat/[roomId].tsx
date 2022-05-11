import Div from "src/components/Div";
import Row from "src/components/Row";
import Col from "src/components/Col";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import { NextPageContext } from "next";
import { apiHelperWithJwtFromContext, apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import Image from "next/image";
import { IMAGES } from "src/modules/images";
import { useEffect, useState, useCallback } from "react";
import Messages from "src/components/chat/messages";
import { useRouter } from "next/router";
import { Alert } from "react-alert";
import { cable } from "src/modules/cable";
import { ChatChannel } from "src/modules/chatChannel";
import { getJwt } from "src/modules/cookieHelper";
import { ArrowLeftIcon, ChevronLeftIcon } from "@heroicons/react/outline";
import ChatRoomItemAvatars from "src/components/chat/chatRoomItemAvatars";
import ReactTextareaAutosize from "react-textarea-autosize";
import EmptyBlock from "src/components/EmptyBlock";

function ChatRoom({ currentNft, jwt, room_info, room_name, room_profile_imgs, init_messages }) {
	const currentNftId = { token_id: currentNft.token_id, contract_address: currentNft.contract_address };
	const currentAvatar = currentNft.nft_metadatum.image_uri;
	const roomId = room_info._id.$oid;
	const { back } = useRouter();

	const [chatSocket, setChatSocket] = useState(null);
	const [enterNfts, setEnterNfts] = useState([]);
	const [messages, setMessages] = useState(init_messages);
	const [text, setText] = useState("");
	const [isNew, setIsNew] = useState(init_messages.length == 0);

	const onChange = (e) => {
		setText(e.target.value);
	};

	const sendMessage = async () => {
		if (chatSocket) {
			const Timestamp = new Date();
			const msg = {
				text: text,
				nft: currentNftId,
				avatar: currentAvatar,
				read_nft_ids: enterNfts,
				created_at: Timestamp,
				updated_at: Timestamp,
			};
			const room = {
				room_info: room_info,
				room_name: room_name,
				room_profile_imgs: room_profile_imgs,
				last_message: text,
			};
			if (isNew) {
				const _ = await chatSocket.sendNew(msg, room);
			} else {
				const _ = await chatSocket.send(msg, room);
			}
		} else {
			Alert.alert("네트워크가 불안정하여 메세지를 보내지 못했습니다");
		}
		setText("");
	};
	const hanldeKeyPress = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			sendMessage();
		}
	};

	useEffect(() => {
		const channel = new ChatChannel({ roomId: roomId });
		const wsConnect = async () => {
			await cable(jwt).subscribe(channel);
			setChatSocket(channel);
			channel.on("enter", (res) => {
				setEnterNfts(res["new_nfts"]);
				setMessages(res["update_msgs"]);
			});
			let _ = await channel.enter(roomId);
			channel.on("message", (res) => {
				setMessages((m) => [...m, res["data"]]);
			});
			channel.on("leave", (res) => {
				if (currentNftId != res["leave_nft"]) {
					setEnterNfts(res["new_nfts"]);
				}
			});
			channel.on("new", (res) => {
				setIsNew(false);
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
	const stickProps = { sticky: true, bottom0: true, bgWhite: true, pt10: true };
	return (
		<Div flex flexCol hScreen>
			<Div bgWhite wFull>
				<Row maxW={650} mxAuto flex itemsCenter py3>
					<Col auto cursorPointer>
						<Div onClick={back} h={45} flex itemsCenter justifyCenter>
							<ChevronLeftIcon height={25}></ChevronLeftIcon>
						</Div>
					</Col>
					<Col auto justifyCenter px0>
						<Div roundedLg overflowHidden h30>
							<ChatRoomItemAvatars h={30} w={30} profileImg={room_profile_imgs} />
						</Div>
					</Col>
					<Col auto justifyCenter>
						<Div>{room_name}</Div>
					</Col>
					<Col />
				</Row>
			</Div>
			<Div hFull bgWhite flex itemsEnd justifyCenter>
				<Div maxW={650} bgWhite relative wFull>
					<Messages messages={messages} currentNftId={currentNftId} numNfts={2} />
					<Div {...stickProps}>
						<Row gapX={0} px15>
							<Col flex itemsCenter justifyCenter cursorPointer>
								<Div wFull roundedLg bgGray200 px15 pt5>
									<ReactTextareaAutosize
										onChange={onChange}
										onKeyPress={hanldeKeyPress}
										placeholder="메세지를 입력해주세요."
										className={"text-sm"}
										value={text}
										style={{ boxShadow: "none", border: "none", resize: "none", width: "100%", padding: 0, background: "transparent" }}
									/>
								</Div>
							</Col>
							<Col flex itemsCenter justifyCenter auto pl0 textBase onClick={sendMessage} cursorPointer>
								전송
							</Col>
						</Row>
						<EmptyBlock h={20} />
					</Div>
				</Div>
			</Div>
		</Div>
	);
}

ChatRoom.getInitialProps = async (context: NextPageContext) => {
	const { roomId } = context.query;
	const res = await apiHelperWithJwtFromContext(context, apis.chat.chatRoom.roomId(roomId), "GET")
	return res;
}

export default ChatRoom