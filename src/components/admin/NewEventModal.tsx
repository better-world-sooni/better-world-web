import Div from "../Div";
import Modal from "../modals/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store/reducers/rootReducer";
import { newEventModalAction } from "src/store/reducers/modalReducer";
import Tooltip from "@mui/material/Tooltip";
import { getAllCollectionsQuery } from "src/hooks/queries/admin/events";
import { ProfileImage } from "../common/ImageHelper";
import { useState } from "react";
import DefaultTransition from "../common/defaulttransition";
import { CheckIcon, SearchIcon } from "@heroicons/react/outline";
import { SwitchToggle } from "./userlist";
import useEdittableText from "src/hooks/useEdittableText";
import useEdittableToggle from "src/hooks/useEdittableToggle";
import useUploadDrawEvent, { EventType } from "src/hooks/useUploadDrawEvent";
import ReactTextareaAutosize from "react-textarea-autosize";

export default function NewEventModal({}) {
  const { enabled } = useSelector((state: RootState) => ({
    enabled: state.modal.newEventModal.enabled,
  }));
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(newEventModalAction({ enabled: false }));
  };

  return (
    <Modal open={enabled} onClose={closeModal} bdClx={"bg-black/50"} clx={"bg-white w-full"}>
      <EventDetails closeModal={closeModal} />
    </Modal>
  );
}

function EventDetails({ closeModal }) {
  const {
    collection,
    selectCollection,
    type,
    setType,
    error,
    loading,
    applicationCategories,
    handleAddApplicationCategory,
    handleRemoveApplicationCategory,
    handleAddApplicationOption,
    handleRemoveApplicationOption,
    enableApplicationLink,
    toggleEnableApplicationLink,
    discordLink,
    handleDiscordLinkChange,
    applicationLink,
    handleApplicationLinkChange,
    expiresAt,
    setExpiresAt,
    name,
    handleNameChange,
    description,
    handleDescriptionChange,
    uploadDrawEvent,
  } = useUploadDrawEvent({ initialHasApplication: true });
  return (
    <Div zIndex={-1000} wFull hFull flex itemsCenter justifyCenter>
      <Div wFull mb10 flex flexCol px30 py30>
        <Div wFull flex flexRow py10 borderB1>
          <Div wFull selfCenter fontBold fontSize30 selfStart textBW>
            새 Event 작성
          </Div>
          <Div selfCenter>
            <Tooltip title="창 닫기" arrow>
              <Div fontBold selfEnd px10 cursorPointer py5 bgBWLight textBW rounded10 clx="hover:bg-bw hover:text-white" onClick={closeModal}>
                닫기
              </Div>
            </Tooltip>
          </Div>
        </Div>
        <Div mt10 px10 wFull selfCenter flex flexCol justifyCneter border1 gapY={10} minH={"50vh"} maxH={"60vh"}>
          <Div flex flexRow gapX={5}>
            <Div selfCenter justifyStart>
              <SelectCollection collection={collection} selectCollection={selectCollection} />
            </Div>
            <Div selfCenter justifyEnd>
              <SelectEventType type={type} setType={setType} />
            </Div>
            <Div selfCenter wFull px10 py5>
              <Title name={name} handleNameChange={handleNameChange} />
            </Div>
          </Div>
          <Div flex flexCol justifyCenter gapY={10} overflowYScroll noScrollBar hFull>
            <Div flex flexRow gapX={5}>
              <Descriptions description={description} handleDescriptionChange={handleDescriptionChange} />
            </Div>
          </Div>
        </Div>
        <Div wFull flex flexRow justifyEnd mt30>
          <Div selfCenter>
            <Tooltip title="이벤트 업로드" arrow>
              <Div fontBold bgOpacity80 bgBW selfEnd px10 cursorPointer py5 bgBWLight textWhite rounded10 clx="hover:bg-bw" onClick={closeModal}>
                업로드
              </Div>
            </Tooltip>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

function Descriptions({ description, handleDescriptionChange }) {
  return (
    <ReactTextareaAutosize
      rows={5}
      onChange={handleDescriptionChange}
      placeholder={"내용 작성"}
      className={"px-5 ml-10 self-center w-full bg-white rounded-md text-center"}
      value={description}
      style={{ resize: "none", border: "none", height: 500 }}
    />
  );
}

function Title({ name, handleNameChange }) {
  return (
    <input
      placeholder="제목을 입력해주세요."
      value={name}
      className={"self-center w-full focus:outline-none focus:border-gray-400 bg-white rounded-md ml-10 mr-10 font-semibold border-1 px-5 py-5"}
      style={{ width: "wFull", boxShadow: "none", marginLeft: 10, marginRight: 10, fontSize: 20 }}
      onChange={handleNameChange}
    ></input>
  );
}

function SelectEventType({ type, setType }) {
  return (
    <Div clx="bg-bw-light" cursorPointer rounded flex flexRow fontSize14 fontSemibold overflowHidden>
      <Div px10 py5 selfCenter bgBW={type == EventType.NOTICE} textWhite={type == EventType.NOTICE} onClick={() => setType(EventType.NOTICE)}>
        공지
      </Div>
      <Div px10 py5 selfCenter bgBW={type == EventType.EVENT} textWhite={type == EventType.EVENT} onClick={() => setType(EventType.EVENT)}>
        이벤트
      </Div>
    </Div>
  );
}

function SelectCollection({ collection, selectCollection }) {
  const { isError: error, data: collectionList } = getAllCollectionsQuery();
  const [click, setClick] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const isError = error || !collectionList?.success || !collectionList?.collections || collectionList?.collections.length == 0;
  const [collectionListFiltered, setcollectionList] = useState(!isError && collectionList?.collections);
  const onClick = () => {
    setClick(!click);
  };
  const clickCollection = (name, contractAddress, imageUri) => {
    selectCollection(name, contractAddress, imageUri);
    handleChangeSearchKey({ target: { value: "" } });
    onClick();
  };
  const handleChangeSearchKey = ({ target: { value } }) => {
    !isError &&
      setcollectionList(
        collectionList?.collections.filter(
          (collection) =>
            (collection?.name && collection?.name.toLowerCase().includes(value)) ||
            (collection?.contract_address && collection?.contract_address.includes(value)) ||
            (collection?.symbol && collection?.symbol.toLowerCase().includes(value))
        )
      );
    setSearchKey(value);
  };

  return (
    <Div relative>
      <Div
        relative
        flex
        flexRow
        justifyCenter
        gapX={10}
        px20
        py5
        bgWhite={!click}
        bgGray100={click}
        rounded={!click}
        roundedB={click}
        cursorPointer
        onClick={onClick}
        clx="hover:bg-gray-100"
      >
        <ProfileImage width={50} height={50} nft={{ image_uri: collection?.imageUri }} rounded={true} resize={true} />
        <Div w={250} selfCenter fontSemibold textStart overflowEllipsis overflowHidden whitespaceNowrap>
          {collection?.name == null ? "Collection 선택" : collection?.name}
        </Div>
      </Div>
      <DefaultTransition
        show={click}
        duration={0.2}
        content={
          <Div
            cursorPointer
            z100
            absolute
            bgGray100
            overflowYScroll
            noScrollBar
            style={{ maxHeight: "50vh" }}
            wFull
            top={"100%"}
            roundedB
            flex
            flexCol
            py5
            gapY={3}
          >
            {isError ? (
              <Div px10 py5 fontSemibold>
                {" "}
                페이지를 다시 로드해주세요.
              </Div>
            ) : (
              <>
                <Div px10 py5 borderB1 flex flexRow>
                  {" "}
                  <Div selfCenter w={20} h={20}>
                    <SearchIcon height={20} width={20} className="max-h-20 max-w-20" />
                  </Div>{" "}
                  <input
                    placeholder="Collection 이름/심볼/주소로 검색"
                    value={searchKey}
                    className={"px-5 ml-10 self-center w-full focus:outline-none focus:border-gray-400 bg-white rounded-md"}
                    style={{ width: "wFull", boxShadow: "none", border: "none" }}
                    onChange={handleChangeSearchKey}
                  ></input>
                </Div>
                <Div px20 flex flexCol overflowYScroll noScrollBar>
                  {collectionListFiltered &&
                    collectionListFiltered.length != 0 &&
                    collectionListFiltered.map((value, index) => (
                      <Div
                        key={index}
                        flex
                        flexRow
                        justifyStart
                        borderGray200
                        borderB1={index != collectionListFiltered.length - 1}
                        gapX={20}
                        py2
                        onClick={() => clickCollection(value?.name, value?.contract_address, value?.image_uri)}
                      >
                        <Div w={50} h={50} selfCenter>
                          <ProfileImage width={50} height={50} nft={{ image_uri: value?.image_uri }} rounded={true} resize={true} />
                        </Div>
                        <Div wFull selfCenter fontSemibold textStart overflowEllipsis overflowHidden whitespaceNowrap>
                          {value?.name}
                        </Div>
                        {collection?.name == value?.name && collection?.contractAddress == value?.contract_address && (
                          <Div selfCenter w={30} h={30} textSuccess>
                            <CheckIcon height={30} width={30} className="max-h-30 max-w-30" />
                          </Div>
                        )}
                      </Div>
                    ))}
                </Div>
              </>
            )}
          </Div>
        }
      />
    </Div>
  );
}
