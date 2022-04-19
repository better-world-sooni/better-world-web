import Div from "src/components/Div";
import Row from "src/components/Row";
import Col from "src/components/Col";
import Image from "next/image";

const Messages = ({messages, currentUser}) => {
    return(
        <Div overflowHidden overflowAuto>
            {messages.map((message, index) => {
                const author = message.user_uuid;
                const isSameUser = messages[index + 1]?.user_uuid === author;
                const isMyMessage = author === currentUser.uuid;
                const text = message.text;
                const time = message.created_at;
                const avatar = message.avatar;

                return(
                    <Div key={index} >
                        <Row {...(isMyMessage && {flexRowReverse: true})}>
                            <Col auto>
                                {!isSameUser && 
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