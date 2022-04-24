import Div from "src/components/Div";
import Row from "src/components/Row";
import Col from "src/components/Col";
import Image from "next/image";
import { IMAGES } from "src/modules/images"

const Messages = ({messages, currentNftId, numNfts}) => {

    const isSameNft = (nft1, nft2) => nft1?.token_id === nft2?.token_id && nft1?.contract_address === nft2?.contract_address; 
    return(
        <Div overflowHidden overflowAuto>
            {messages.map((message, index) => {
                const author = message.nft;
                const isConsecutive = isSameNft(messages[index - 1]?.nft, author);
                const isMyMessage = isSameNft(author, currentNftId)
                const text = message.text;
                const time = new Date(message.created_at);
                const avatar = message.avatar;
                const unreadCount = numNfts - message.read_nft_ids.length;
                console.log(text, isConsecutive)
                return(
                    <Div key={index} >
                        <Row {...(isMyMessage && {flexRowReverse: true})}>
                            <Col auto>
                                {!isConsecutive && 
                                    <Image
                                    alt="back"
                                    src={avatar}
                                    height={25}
                                    width={25}
                                    />
                                }
                            </Col>
                            <Col auto>
                                {text}
                            </Col>
                            <Col auto>
                                {`${time.getHours()}:${time.getMinutes()}`}
                            </Col>

                            <Col auto fontSize={5}>
                                {Boolean(unreadCount) &&
                                    <Div>
                                        {unreadCount}
                                    </Div>
                                }
                            </Col>

                        </Row>
                        
                    </Div>
                );
            })}
            
        </Div>
    );
}
export default Messages