import Div from "src/components/Div";
import Row from "src/components/Row";
import Col from "src/components/Col";


const Messages = ({messages, currentUser}) => {
    return(
        <Div overflowHidden overflowAuto>
            {messages.map((message, index) => {
                return(
                    <Div key={index}>
                        {`user: ${message.user_uuid}, message: ${message.text}`}
                    </Div>
                );
            })}
            
        </Div>
    );
}
export default Messages