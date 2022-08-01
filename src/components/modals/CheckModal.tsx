import Div from "../Div";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { DialogTitle } from "@mui/material";
import { useState } from "react";

const CheckModal=(Title="", Label, YesAction=null, NoAction=null, yesLabel="예", noLabel="아니오") => {

	const [ CheckModalEnabled, setCheckModalEnabled ] = useState(false);
	const HandleNo = () => {
        setCheckModalEnabled(false);
        if (NoAction) NoAction()
	};
    const HandleYes = () => {
        setCheckModalEnabled(false);
        if (YesAction) YesAction();
    }
    const openModal = () => {
        setCheckModalEnabled(true);
    }

	return (
		{Modal: 
            ()=><CheckModalEntry Title={Title} Label={Label} CheckModalEnabled={CheckModalEnabled} HandleYes={HandleYes} HandleNo={HandleNo} yesLabel={yesLabel} noLabel={noLabel}/>
        ,
        openModal: openModal}
	);
}


const CheckModalEntry=({Title, Label, CheckModalEnabled, HandleYes, HandleNo, yesLabel, noLabel})=>{
    return (
        <Dialog
        open={CheckModalEnabled}
        onClose={HandleNo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
          {Title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {Label}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Div w={100} textCenter bgPrimaryLight py5 cursorPointer rounded clx={"hover:bg-primary hover:text-white hover:font-bold"} onClick={HandleYes}>
                {yesLabel}
            </Div>
            <Div w={100} textCenter py5 cursorPointer rounded clx={"hover:bg-gray-100 hover:font-bold"} onClick={HandleNo}>
                {noLabel}
            </Div>
        </DialogActions>
      </Dialog>
    )
}

export function MakeCommentModal(DeleteCommentAction) {
  const {isLoading, mutate} = DeleteCommentAction()
  return {...CheckModal("댓글 삭제", "이 댓글을 삭제할까요? 이 작업은 되돌릴 수 없습니다.", mutate), isLoading}
}

export function MakePostModal(DeletePostAction) {
  const {isLoading, mutate} = DeletePostAction()
  return {...CheckModal("게시물 삭제", "이 게시물을 삭제할까요? 이 작업은 되돌릴 수 없습니다.", mutate), isLoading}
}

export default CheckModal