import Div from "src/components/Div";
import Row from "src/components/Row";
import Col from "src/components/Col";
import Image from "next/image";
import { IMAGES } from "src/modules/images"

const Messages = ({messages, currentNftId}) => {
    return(
        <Div overflowHidden overflowAuto>
            {messages.map((message, index) => {
                const author = message.nft;
                const isSameNft = messages[index + 1]?.nft === author;
                const isMyMessage = author === currentNftId;
                const text = message.text;
                const time = message.created_at;
                // const avatar = message.avatar;

                return(
                    <Div key={index} >
                        <Row {...(isMyMessage && {flexRowReverse: true})}>
                            <Col auto>
                                {!isSameNft && 
                                    <Image
                                    alt="back"
                                    src={IMAGES.characters.default}
                                    height={25}
                                    width={25}
                                    />
                                }
                            </Col>
                            <Col auto>
                                {text}
                            </Col>
                            <Col auto>
                                {time}
                            </Col>

                        </Row>
                        
                    </Div>
                );
            }).reverse()}
            
        </Div>
    );
}
export default Messages