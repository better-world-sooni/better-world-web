import Div from "../Div";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { DialogTitle } from "@mui/material";
import { useState } from "react";
import LINKS from "src/modules/links";
import { setSuperPrivilege } from "src/hooks/queries/admin/userlist";
import { DeleteEvent, setStatus } from "src/hooks/queries/admin/events";

const CheckModal = (Title = "", Label, YesAction = null, yesLabel = "예", NoAction = null, noLabel = "") => {
  const [CheckModalEnabled, setCheckModalEnabled] = useState(false);
  const HandleNo = () => {
    setCheckModalEnabled(false);
    if (NoAction) NoAction();
  };
  const HandleYes = () => {
    setCheckModalEnabled(false);
    if (YesAction) YesAction();
  };
  const openModal = () => {
    setCheckModalEnabled(true);
  };
  const Modal = () => (
    <CheckModalEntry
      Title={Title}
      Label={Label}
      CheckModalEnabled={CheckModalEnabled}
      HandleYes={HandleYes}
      HandleNo={HandleNo}
      yesLabel={yesLabel}
      noLabel={noLabel}
    />
  );

  return {
    Modal,
    openModal,
  };
};

const CheckModalEntry = ({ Title, Label, CheckModalEnabled, HandleYes, HandleNo, yesLabel, noLabel }) => {
  return (
    <Dialog open={CheckModalEnabled} onClose={HandleNo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{Title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Div textBlack>{Label}</Div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {yesLabel && (
          <Div w={100} textCenter bgBWLight fontSize13 py5 cursorPointer rounded clx={"hover:bg-bw hover:text-white hover:font-bold"} onClick={HandleYes}>
            {yesLabel}
          </Div>
        )}
        {noLabel && (
          <Div w={100} textCenter fontSize13 py5 cursorPointer rounded clx={"hover:bg-gray-100 hover:font-bold"} onClick={HandleNo}>
            {noLabel}
          </Div>
        )}
      </DialogActions>
    </Dialog>
  );
};

export function MakeCommentModal(DeleteCommentAction) {
  const { isLoading, mutate } = DeleteCommentAction();
  return { ...CheckModal("댓글 삭제", "이 댓글을 삭제할까요? 이 작업은 되돌릴 수 없습니다.", mutate, "예", null, "아니오"), isLoading };
}

export function MakeSuperPrivilegeModal(address, superPrivilege, queryClient) {
  const { isLoading, mutate } = setSuperPrivilege(address, superPrivilege, queryClient);
  return { ...CheckModal("Super Privilege 권한 부여", "이 계정에 Super Privilege 권한을 부여할까요?", mutate, "예", null, "아니오"), isLoading, mutate };
}

export function DeleteEventModal(eventId, queryClient) {
  const { isLoading, mutate } = DeleteEvent(eventId, queryClient);
  return { ...CheckModal("이벤트 삭제", "이 이벤트를 삭제할까요? 이 작업은 되돌릴 수 없습니다", mutate, "예", null, "아니오"), isLoading, mutate };
}
export function MakePostModal(DeletePostAction) {
  const { isLoading, mutate } = DeletePostAction();
  return { ...CheckModal("게시물 삭제", "이 게시물을 삭제할까요? 이 작업은 되돌릴 수 없습니다.", mutate, "예", null, "아니오"), isLoading };
}

export function MakeBrowserModal() {
  const { Modal: BrowserModal, openModal: openBrowserModal } = CheckModal(
    "브라우저 설치",
    <Div>
      <Div spanTag fontBold textPrimary underline cursorPointer aTag href={LINKS.installchrome}>
        Chrome
      </Div>{" "}
      또는{" "}
      <Div spanTag fontBold textPrimary underline cursorPointer aTag href={LINKS.installedge}>
        Edge
      </Div>{" "}
      브라우저를 이용해주시기 바랍니다.
    </Div>,
    null,
    "확인"
  );
  return { BrowserModal, openBrowserModal };
}

export function MakeKaikasModal() {
  const { Modal: KaikasModal, openModal: openKaikasModal } = CheckModal(
    "카이카스 지갑 설치",
    <Div>
      <Div spanTag fontBold textPrimary underline cursorPointer aTag href={LINKS.installkaikas}>
        카이카스 지갑
      </Div>
      을 설치하여 주시기 바랍니다.{" "}
    </Div>,
    null,
    "확인"
  );
  return { KaikasModal, openKaikasModal };
}

export default CheckModal;
