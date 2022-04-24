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
import Messages from "src/pages/chat/messages";
import { useRouter } from "next/router";
import { Alert } from 'react-alert'
import { cable } from 'src/modules/cable';
import { ChatChannel } from 'src/pages/chat/chatChannel';
import { getJwt } from 'src/modules/cookieHelper'
import { ArrowLeftIcon } from "@heroicons/react/outline";



function ChatRoom({ currentUser, currentNft }) {
	const currentNftId = {"token_id": currentNft.token_id, "contract_address": currentNft.contract_address}
    const currentAvatar = currentNft.nft_metadatum.image_uri;
	const router = useRouter();
	const currentRoomId = router.query.roomId.toString();
	const jwt = getJwt();

	const [chatSocket, setChatSocket] = useState(null);
  	const [enterNfts, setEnterNfts] = useState([]);
	const [messages, setMessages] = useState([]);
	const [text, setText] = useState("")


	useEffect(() => {
		console.log(enterNfts);


	}, [enterNfts])



    const onChange = (e) => {
        setText(e.target.value)
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
		setText("")
		console.log("send: ", text)
	}


	useEffect(() => {
		const channel = new ChatChannel({ roomId: currentRoomId });
		const wsConnect = async () => {
			await cable(jwt).subscribe(channel);
			setChatSocket(channel);     
			channel.on('enter', res => {
				const newNfts = res['new_nfts'];
				const newMsgs = res["update_msgs"];
				console.log(currentRoomId, "newNft:", newNfts);
				console.log(currentRoomId, "newMsgs:", newMsgs);
				setEnterNfts(newNfts);
				setMessages(newMsgs)
			});
			let _ = await channel.enter(currentRoomId);
			channel.on('message', res => {
				console.log("message receive", res['data'])
				setMessages((m) => [...m, res['data']]);
			});
			channel.on('leave', res => {
				console.log(res['leave_nft'], res['new_nfts'])
				if(currentNftId != res['leave_nft']){
					console.log("here")
					setEnterNfts([...res['new_nfts']])
				}
			})
			channel.on('close', () => console.log('Disconnected from chat'));
			channel.on('disconnect', () => console.log("check disconnect"));
		};
		wsConnect();
		return() => {
		  if(channel) {
			channel.leave(currentRoomId);
			channel.disconnect();
			channel.close();
		  }   
		}
	}, [])

    return(
        <Div flex flexCol itemsStretch >
            <Row flex itemsCenter>
                <Col auto justifyCenter>
                    <Div onClick={()=> href(urls.chat.inbox)}>
						<ArrowLeftIcon height={20} width={20} scale={1} strokeWidth={2} />
                    </Div>
                </Col>
                <Col auto justifyCenter>
                    <Div>
                        {currentRoomId}
                    </Div>
                </Col>
            </Row>
            <Row flex>
                    <Messages
                        messages={messages}
                        currentNftId={currentNftId}
                        numNfts={2}
                    /> 
            </Row>
            <Div footerTag flex flexCol roundedMd border1 borderBlack >
                <textarea
                    placeholder="메세지를 입력해주세요"
                    className="m-5 resize-none border-none focus:outline-none w-full"
                    onChange={e => onChange(e)}
                    rows={5}
                    value={text}
                    onKeyPress={event => {
                        if (event.key === 'Enter') {
                            sendMessage(text);
                        }
                    }}
                ></textarea>
                <Row flex>
                    <Col>
                    </Col>
                    <Col>
                    </Col>
                    <Col></Col>
                    <Col auto px20 pt5 cursorPointer border1 pb8 onClick={()=>sendMessage(text)}>
						전송
					</Col>
                </Row>
            </Div>
        </Div>
       
    );
}


// ChatRoom.getInitialProps = async (context: NextPageContext) => {
// 	const { roomId } = context.query;
// 	const res = await apiHelperWithJwtFromContext(context, apis.nft.contractAddressAndTokenId(contractAddress, tokenId), "GET");
// 	return res.nft;
// };
export default ChatRoom