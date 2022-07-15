import Div from "src/components/Div";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loadingAction } from "src/store/reducers/adminReducer";
export default function Joblist({frame}) {
    const dispatch = useDispatch();
    dispatch(loadingAction({loading: false, error: false, success: false}));
    const [adminComponent, setaadminComponent] = useState(frame[0])
	return (
        <Div hFull wFull px80 flex itemsStart justifyStart bgBlack auto bgWhite my60>
        <Div absolute minW={200} maxW={300} rounded px20 bgWhite bgOpacity90 borderR1>
            <Div textBlack bgWhite fontSize24 py8 justifyCenter fontBold borderB1 my20>
                    Index
            </Div>
            {frame.map((frame, index) => (
                <Div key={index} textBlack bgWhite fontSize20 px5 rounded10 py5 justifyCenter cursorPointer clx={"hover:bg-gray-100"}onClick={() => {setaadminComponent(frame)}}>
                    {frame.props.name}
                </Div>
            ))}
        </Div>
            {adminComponent}
    </Div>
	);
}
