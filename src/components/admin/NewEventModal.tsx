import Div from "../Div";
import Modal from "../modals/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store/reducers/rootReducer";
import { newEventModalAction } from "src/store/reducers/modalReducer";
import Tooltip from "@mui/material/Tooltip";
import { getAllCollectionsQuery } from "src/hooks/queries/admin/events";
import { ProfileImage, UploadImage } from "../common/ImageHelper";
import { useState } from "react";
import DefaultTransition from "../common/defaulttransition";
import { ArrowRightIcon, CheckIcon, ChevronDownIcon, GlobeAltIcon, MinusIcon, PencilAltIcon, PlusIcon, SearchIcon } from "@heroicons/react/outline";
import useUploadDrawEvent, { EventApplicationInputType, EventType } from "src/hooks/useUploadDrawEvent";
import ReactTextareaAutosize from "react-textarea-autosize";
import { DefaultText } from "../common/ModifiedTruncatedMarkdown";
import { FaBars, FaDiscord, FaTwitter } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useQueryClient } from "react-query";
import { Oval } from "react-loader-spinner";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";

import "react-datepicker/dist/react-datepicker.css";

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
  const queryClient = useQueryClient();
  const {
    collection,
    selectCollection,
    type,
    setType,
    error,
    loading,
    canUploadDrawEvent,
    applicationCategories,
    handleAddApplicationCategory,
    handleRemoveApplicationCategory,
    handleAddApplicationOption,
    handleRemoveApplicationOption,
    enableApplicationLink,
    toggleEnableApplicationLink,
    discordLink,
    handleDiscordLinkChange,
    handleClickDiscordLink,
    discordLinkError,
    applicationLink,
    handleApplicationLinkChange,
    handleClickApplicationLink,
    applicationLinkError,
    expiresAt,
    setExpiresAt,
    name,
    handleNameChange,
    description,
    handleDescriptionChange,
    imageUrls,
    handleAddImages,
    handleChangeImage,
    handleRemoveImage,
    fileLimit,
    uploadDrawEvent,
    eanbleExpires,
    setEnableExpires,
  } = useUploadDrawEvent({ queryClient, uploadSuccessCallback: closeModal });
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
        <Div mt10 px10 wFull selfCenter flex flexCol justifyCneter border1 gapY={10} minH={"50vh"} maxH={"60vh"} overflowHidden>
          <Div flex flexRow gapX={5}>
            <Div selfCenter justifyStart>
              <SelectCollection collection={collection} selectCollection={selectCollection} loading={loading} />
            </Div>
            <Div selfCenter justifyEnd>
              <SelectEventType type={type} setType={setType} loading={loading} />
            </Div>
            <Div selfCenter wFull px10 py5>
              <Title
                name={name}
                handleNameChange={
                  !loading
                    ? handleNameChange
                    : () => {
                        return;
                      }
                }
              />
            </Div>
          </Div>
          <Div wFull flex flexRow justifyStart>
            <DiscordLink
              discordLink={discordLink}
              handleDiscordLinkChange={
                !loading
                  ? handleDiscordLinkChange
                  : () => {
                      return;
                    }
              }
              handleClickDiscordLink={handleClickDiscordLink}
              discordLinkError={discordLinkError}
            />
          </Div>
          <Div gapY={10} overflowYScroll noScrollBar hFull>
            <Div wFull flex flexRow gapX={5} borderB1>
              <Descriptions
                description={description}
                handleDescriptionChange={
                  !loading
                    ? handleDescriptionChange
                    : () => {
                        return;
                      }
                }
              />
            </Div>

            <Images
              imageUrls={imageUrls}
              handleAddImages={handleAddImages}
              handleChangeImage={handleChangeImage}
              handleRemoveImage={handleRemoveImage}
              fileLimit={fileLimit}
              loading={loading}
            />
            <DefaultTransition
              show={type == EventType.EVENT}
              content={
                <Options
                  applicationLink={applicationLink}
                  handleApplicationLinkChange={handleApplicationLinkChange}
                  enableApplicationLink={enableApplicationLink}
                  toggleEnableApplicationLink={toggleEnableApplicationLink}
                  handleClickApplicationLink={handleClickApplicationLink}
                  applicationLinkError={applicationLinkError}
                  applicationCategories={applicationCategories}
                  handleAddApplicationCategory={handleAddApplicationCategory}
                  handleRemoveApplicationCategory={handleRemoveApplicationCategory}
                  handleAddApplicationOption={handleAddApplicationOption}
                  handleRemoveApplicationOption={handleRemoveApplicationOption}
                  expiresAt={expiresAt}
                  setExpiresAt={setExpiresAt}
                  loading={loading}
                  eanbleExpires={eanbleExpires}
                  setEnableExpires={setEnableExpires}
                />
              }
            />
          </Div>
        </Div>
        <Div wFull flex flexRow justifyEnd mt30>
          {canUploadDrawEvent && (
            <Div selfCenter>
              {loading ? (
                <Div fontBold bgBW selfEnd px10 py5 bgBWLight textWhite rounded10>
                  <Oval height="14" width="14" color="#4738FF" secondaryColor="#FFFFFF" strokeWidth="5" />
                </Div>
              ) : (
                <Tooltip title="이벤트 업로드" arrow>
                  <Div fontBold bgOpacity80 bgBW selfEnd px10 cursorPointer py5 bgBWLight textWhite rounded10 clx="hover:bg-bw" onClick={uploadDrawEvent}>
                    업로드
                  </Div>
                </Tooltip>
              )}
            </Div>
          )}
        </Div>
      </Div>
    </Div>
  );
}

function Images({ imageUrls, handleAddImages, handleChangeImage, handleRemoveImage, fileLimit, loading }) {
  const size = 150;
  const animation = {
    mount: { opacity: 1, scale: 1 },
    unmount: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 },
  };
  return (
    <Div wFull flex flexRow overflowXScroll relative gapX={20} py20>
      <AnimatePresence>
        {imageUrls.map((image, index) => (
          <motion.div key={image?.key} initial={animation.unmount} animate={animation.mount} exit={animation.unmount} transition={animation.transition}>
            <UploadImage
              width={size}
              height={size}
              uri={image?.url}
              onClick={() => handleChangeImage(index)}
              onRemove={() => handleRemoveImage(index)}
              enable={!loading}
              loading={image?.loading}
            />
          </motion.div>
        ))}
        {imageUrls.length < fileLimit && !loading && (
          <motion.div initial={animation.unmount} animate={animation.mount} exit={animation.unmount} transition={animation.transition}>
            <UploadImage width={size} height={size} uri={null} onClick={handleAddImages} loading={false} enable={!loading} />
          </motion.div>
        )}
      </AnimatePresence>
    </Div>
  );
}

function Options({
  enableApplicationLink,
  toggleEnableApplicationLink,
  applicationLink,
  handleApplicationLinkChange,
  handleClickApplicationLink,
  applicationLinkError,

  applicationCategories,
  handleAddApplicationCategory,
  handleRemoveApplicationCategory,
  handleAddApplicationOption,
  handleRemoveApplicationOption,

  expiresAt,
  setExpiresAt,
  eanbleExpires,
  setEnableExpires,

  loading,
}) {
  return (
    <Div wFull flex flexCol justifyCenter mt20 gapY={20}>
      <Div wFull flex flexRow justifyStart gapX={20}>
        <SelectExpires enableExpires={eanbleExpires} toggleExpires={() => setEnableExpires((prev) => !prev)} loading={loading} />
        {eanbleExpires && (
          <Div selfCenter w300>
            <DatePicker
              className={"self-center h-full w-full focus:outline-none focus:border-gray-400 bg-transparent rounded-md border-none"}
              selected={expiresAt}
              onChange={!loading && ((date) => setExpiresAt(date))}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              locale={ko}
              minDate={new Date()}
              timeCaption="time"
              dateFormat="yyyy/MM/dd aa h:mm "
            />
          </Div>
        )}
      </Div>
      <Div wFull flex flexRow justifyStart gapX={20}>
        <SelectApplication enableApplicationLink={enableApplicationLink} toggleEnableApplicationLink={toggleEnableApplicationLink} loading={loading} />
        {enableApplicationLink && (
          <DefaultTransition
            show={enableApplicationLink}
            content={
              <ApplicationLink
                applicationLink={applicationLink}
                handleApplicationLinkChange={
                  !loading
                    ? handleApplicationLinkChange
                    : () => {
                        return;
                      }
                }
                handleClickApplicationLink={handleClickApplicationLink}
                applicationLinkError={applicationLinkError}
              />
            }
          />
        )}
        {!enableApplicationLink && !loading && (
          <DefaultTransition show={!enableApplicationLink} content={<AddOptions handleAddApplicationCategory={handleAddApplicationCategory} />} />
        )}
      </Div>
      {!enableApplicationLink && (
        <DefaultTransition
          show={!enableApplicationLink}
          content={
            <Div selfCenter flex flexRow wFull jsutifyStart gapX={10} flexWrap gapY={10}>
              <AnimatePresence>
                {applicationCategories
                  ? applicationCategories.map((value, index) => (
                      <ModifyOption
                        option={value}
                        onClick={() => handleRemoveApplicationCategory(index)}
                        key={value?.index}
                        handleAddApplicationOption={(optionName) => handleAddApplicationOption(index, optionName)}
                        handleRemoveApplicationOption={(optionIndex) => handleRemoveApplicationOption(index, optionIndex)}
                        loading={loading}
                      />
                    ))
                  : null}
              </AnimatePresence>
            </Div>
          }
        />
      )}
    </Div>
  );
}

function ModifyOption({ option, onClick, handleAddApplicationOption, handleRemoveApplicationOption, loading }) {
  const [click, setClick] = useState(false);
  const canClick = option?.inputType == EventApplicationInputType.SELECT;
  const [optionInput, handleChangeOptionInputText] = useState("");
  const handleChangeOptionInput = ({ target: { value } }) => {
    handleChangeOptionInputText(value);
  };
  const animation = {
    mount: { opacity: 1, scale: 1 },
    unmount: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 },
  };
  const onEnterOptions = (e) => {
    if (e.key === "Enter" && optionInput != "") {
      handleAddApplicationOption(optionInput);
      handleChangeOptionInputText("");
    }
  };
  return (
    <motion.div initial={animation.unmount} animate={animation.mount} exit={animation.unmount} transition={animation.transition}>
      <Div relative>
        <Div
          selfStart
          px10
          py5
          bgGray100={!click}
          bgGray200={click}
          rounded={!click}
          roundedT={click}
          textBlack
          flex
          flexRow
          justifyCenter
          relative
          onClick={!loading && (!canClick ? () => onClick() : () => setClick(!click))}
          cursorPointer={!loading}
          clx={!loading && "hover:bg-gray-200"}
        >
          <Div relative selfCenter>
            {option?.inputType == EventApplicationInputType.DISCORD_ID ? (
              <FaDiscord size={18} />
            ) : option?.inputType == EventApplicationInputType.TWITTER_ID ? (
              <FaTwitter size={18} />
            ) : option?.inputType == EventApplicationInputType.CUSTOM_INPUT ? (
              <PencilAltIcon height={18} width={18} className="max-h-18 max-w-18" />
            ) : (
              <FaBars size={18} />
            )}
          </Div>
          <Div relative selfCenter fontSize12 ml5 fontSemibold>
            {option?.name}
          </Div>
          {!loading && (
            <Div relative selfCenter fontSize12 ml5 fontSemibold onClick={canClick && !click && onClick} px5 py5>
              {!click ? (
                <MinusIcon height={12} width={12} className="max-h-12 max-w-12" />
              ) : (
                <ChevronDownIcon height={12} width={12} className="max-h-12 max-w-12" />
              )}
            </Div>
          )}
        </Div>
        <DefaultTransition
          show={click && canClick}
          duration={0.2}
          content={
            <Div cursorPointer={!loading} z100 bgGray200 absolute breakAll style={{ maxHeight: "500%" }} minWFull roundedB px10 flex flexCol py5 gapY={3}>
              {!loading && (
                <Div wFull textLeft fontSize12 borderGray400 flex flexRow selfCenter gapY={2} gapX={5} justifyStart>
                  <Div wFull textLeft>
                    <input
                      placeholder="옵션 입력"
                      value={optionInput}
                      className={"self-center h-full w-full focus:outline-none focus:border-gray-400 bg-transparent rounded-md"}
                      style={{ boxShadow: "none", border: "none" }}
                      onChange={handleChangeOptionInput}
                      onKeyPress={onEnterOptions}
                    ></input>
                  </Div>
                  <Div
                    selfCenter
                    fontSize12
                    ml5
                    fontSemibold
                    textRight
                    onClick={
                      optionInput != "" &&
                      (() => {
                        handleAddApplicationOption(optionInput);
                        handleChangeOptionInputText("");
                      })
                    }
                  >
                    <PlusIcon height={12} width={12} className="max-h-12 max-w-12" />
                  </Div>
                </Div>
              )}
              <Div overflowYScroll noScrollBar>
                {option?.options.map((value, index) => (
                  <Div
                    key={`${value}-${index}`}
                    relative
                    textRight
                    wFull
                    fontSize12
                    borderGray400
                    borderB1={index != option?.options.length - 1}
                    onClick={!loading && (() => handleRemoveApplicationOption(index))}
                    flex
                    flexRow
                    selfCenter
                    gapY={2}
                    gapX={5}
                  >
                    <Div wFull textLeft>
                      {value}
                    </Div>
                    {!loading && (
                      <Div selfCenter fontSize12 ml5 fontSemibold textRight>
                        <MinusIcon height={12} width={12} className="max-h-12 max-w-12" />
                      </Div>
                    )}
                  </Div>
                ))}
              </Div>
            </Div>
          }
        />
      </Div>
    </motion.div>
  );
}

function AddOptions({ handleAddApplicationCategory }) {
  const [cutomInput, handleChangeCustomInputText] = useState("");
  const [select, handleChangeSelectText] = useState("");
  const handleChangeCustomInput = ({ target: { value } }) => {
    handleChangeCustomInputText(value);
  };
  const handleChangeSelect = ({ target: { value } }) => {
    handleChangeSelectText(value);
  };
  const onEnterCustomInput = (e) => {
    if (e.key === "Enter" && cutomInput != "") {
      handleChangeCustomInputText("");
      handleAddApplicationCategory(cutomInput, EventApplicationInputType.CUSTOM_INPUT);
    }
  };
  const onEnterCategories = (e) => {
    if (e.key === "Enter" && select != "") {
      handleChangeSelectText("");
      handleAddApplicationCategory(select, EventApplicationInputType.SELECT);
    }
  };
  return (
    <Div flex flexRow justifyStart gapX={10}>
      <Div relative selfCenter cursorPointer onClick={() => handleAddApplicationCategory("트위터 아이디", EventApplicationInputType.TWITTER_ID)}>
        <Div selfStart px10 py5 bgGray100 rounded textBlack flex flexRow justifyCenter relative clx={"hover:bg-gray-200"}>
          <Div relative selfCenter>
            <FaTwitter size={18} />
          </Div>
          <Div relative selfCenter fontSize12 ml5 fontSemibold>
            트위터
          </Div>
          <Div relative selfCenter fontSize12 ml5 fontSemibold px5 py5>
            <PlusIcon height={12} width={12} className="max-h-12 max-w-12" />
          </Div>
        </Div>
      </Div>
      <Div relative selfCenter cursorPointer onClick={() => handleAddApplicationCategory("디스코드 아이디", EventApplicationInputType.DISCORD_ID)}>
        <Div selfStart px10 py5 bgGray100 rounded textBlack flex flexRow justifyCenter relative clx={"hover:bg-gray-200"}>
          <Div relative selfCenter>
            <FaDiscord size={18} />
          </Div>
          <Div relative selfCenter fontSize12 ml5 fontSemibold>
            디스코드
          </Div>
          <Div relative selfCenter fontSize12 ml5 fontSemibold px5 py5>
            <PlusIcon height={12} width={12} className="max-h-12 max-w-12" />
          </Div>
        </Div>
      </Div>
      <Div relative selfCenter>
        <Div selfStart px10 py5 bgGray100 rounded textBlack flex flexRow justifyCenter relative clx={"hover:bg-gray-200"}>
          <Div relative selfCenter>
            <PencilAltIcon height={18} width={18} className="max-h-18 max-w-18" />
          </Div>
          <Div relative selfCenter fontSize12 ml5 fontSemibold w={250}>
            <input
              placeholder="커스텀 입력"
              value={cutomInput}
              className={"self-center h-full w-full focus:outline-none focus:border-gray-400 bg-transparent rounded-md"}
              style={{ boxShadow: "none", border: "none" }}
              onChange={handleChangeCustomInput}
              onKeyPress={onEnterCustomInput}
            ></input>
          </Div>
          <Div
            relative
            selfCenter
            fontSize12
            ml5
            fontSemibold
            cursorPointer
            px5
            py5
            onClick={
              cutomInput != "" &&
              (() => {
                handleChangeCustomInputText("");
                handleAddApplicationCategory(cutomInput, EventApplicationInputType.CUSTOM_INPUT);
              })
            }
          >
            <PlusIcon height={12} width={12} className="max-h-12 max-w-12" />
          </Div>
        </Div>
      </Div>
      <Div relative selfCenter>
        <Div selfStart px10 py5 bgGray100 rounded textBlack flex flexRow justifyCenter relative clx={"hover:bg-gray-200"}>
          <Div relative selfCenter>
            <FaBars size={18} />
          </Div>
          <Div relative selfCenter fontSize12 ml5 fontSemibold w={250}>
            <input
              placeholder="옵션 선택 카테고리"
              value={select}
              className={"self-center h-full w-full focus:outline-none focus:border-gray-400 bg-transparent rounded-md"}
              style={{ boxShadow: "none", border: "none" }}
              onChange={handleChangeSelect}
              onKeyPress={onEnterCategories}
            ></input>
          </Div>
          <Div
            relative
            selfCenter
            fontSize12
            ml5
            fontSemibold
            cursorPointer
            px5
            py5
            onClick={
              select != "" &&
              (() => {
                handleChangeSelectText("");
                handleAddApplicationCategory(select, EventApplicationInputType.SELECT);
              })
            }
          >
            <PlusIcon height={12} width={12} className="max-h-12 max-w-12" />
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

function ApplicationLink({ applicationLink, handleApplicationLinkChange, handleClickApplicationLink, applicationLinkError }) {
  return (
    <Div selfCenter flex flexRow gapX={10}>
      <Div mt5 fontSemibold>
        <GlobeAltIcon height={20} width={20} className="max-h-20 max-w-20" />
      </Div>
      <Div flex flexCol justifyStart gapY={5}>
        <Div px10 py5 bgWhite roundedLg textBlack w300>
          <input
            placeholder="https://..."
            value={applicationLink}
            className={"self-center h-full w-full focus:outline-none focus:border-gray-400 bg-transparent rounded-md"}
            style={{ boxShadow: "none", border: "none" }}
            onChange={handleApplicationLinkChange}
          ></input>
        </Div>
        <Div textLeft textDanger fontBold fontSize12 ml10 mb18={!applicationLinkError}>
          <DefaultTransition show={applicationLinkError ? true : false} content={applicationLinkError} />
        </Div>
      </Div>
      <DefaultTransition
        show={!applicationLinkError}
        content={
          <Div selfStart px10 py5 bgInfo bgOpacity50 rounded10 textWhite cursorPointer clx="hover:bg-info" onClick={handleClickApplicationLink}>
            {" "}
            <ArrowRightIcon height={20} width={20} className="max-h-20 max-w-20" />
          </Div>
        }
      />
    </Div>
  );
}

function DiscordLink({ discordLink, handleDiscordLinkChange, handleClickDiscordLink, discordLinkError }) {
  return (
    <Div selfCenter flex flexRow gapX={10}>
      <Div mt5 fontSemibold>
        본문 링크
      </Div>
      <Div flex flexCol justifyStart gapY={5}>
        <Div px10 py5 bgWhite roundedLg textBlack w500>
          <input
            placeholder="https://..."
            value={discordLink}
            className={"self-center h-full w-full focus:outline-none focus:border-gray-400 bg-transparent rounded-md"}
            style={{ boxShadow: "none", border: "none" }}
            onChange={handleDiscordLinkChange}
          ></input>
        </Div>
        <Div textLeft textDanger fontBold fontSize12 ml10 mb18={!discordLinkError}>
          <DefaultTransition show={discordLinkError ? true : false} content={discordLinkError} />
        </Div>
      </Div>
      <DefaultTransition
        show={!discordLinkError}
        content={
          <Div selfStart px10 py5 bgInfo bgOpacity50 rounded10 textWhite cursorPointer clx="hover:bg-info" onClick={handleClickDiscordLink}>
            {" "}
            <ArrowRightIcon height={20} width={20} className="max-h-20 max-w-20" />
          </Div>
        }
      />
    </Div>
  );
}

function Descriptions({ description, handleDescriptionChange }) {
  return (
    <>
      <Div wFull borderR1>
        <Div wFull flex flexRow justifyCenter fontSize15 fontSemibold>
          원문
        </Div>
        <ReactTextareaAutosize
          rows={5}
          onChange={handleDescriptionChange}
          placeholder={"내용 작성"}
          className={"text-base"}
          value={description}
          style={{ boxShadow: "none", border: "none", resize: "none", width: "100%", padding: 0, background: "transparent" }}
        />
      </Div>
      <Div wFull textLeft>
        <Div wFull textCenter flex flexRow justifyCenter fontSize15 fontSemibold>
          View
        </Div>
        <Div wFull textGray400={description == ""}>
          <DefaultText text={description == "" ? "*Description 예시*" : description} />
        </Div>
      </Div>
    </>
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

function SelectApplication({ enableApplicationLink, toggleEnableApplicationLink, loading }) {
  return (
    <Div selfStart>
      <SelectEntry
        firstText={"응모 링크"}
        secondText={"옵션"}
        clickFirst={toggleEnableApplicationLink}
        clickSecond={toggleEnableApplicationLink}
        isFirst={enableApplicationLink}
        isSecond={!enableApplicationLink}
        enable={!loading}
      />
    </Div>
  );
}

function SelectExpires({ enableExpires, toggleExpires, loading }) {
  return (
    <Div selfCenter>
      <SelectEntry
        firstText={"마감 기한 설정"}
        secondText={"미설정"}
        clickFirst={toggleExpires}
        clickSecond={toggleExpires}
        isFirst={enableExpires}
        isSecond={!enableExpires}
        enable={!loading}
      />
    </Div>
  );
}

function SelectEventType({ type, setType, loading }) {
  return (
    <SelectEntry
      firstText={"공지"}
      secondText={"이벤트"}
      clickFirst={() => setType(EventType.NOTICE)}
      clickSecond={() => setType(EventType.EVENT)}
      isFirst={type == EventType.NOTICE}
      isSecond={type == EventType.EVENT}
      enable={!loading}
    />
  );
}

function SelectEntry({ firstText, secondText, clickFirst, clickSecond, isFirst, isSecond, enable }) {
  return (
    <Div clx="bg-bw-light" cursorPointer={enable} rounded flex flexRow fontSize14 fontSemibold overflowHidden selfCenter>
      <Div px10 py5 selfCenter bgBW={isFirst} textWhite={isFirst} onClick={enable && clickFirst} whitespaceNowrap>
        {firstText}
      </Div>
      <Div px10 py5 selfCenter bgBW={isSecond} textWhite={isSecond} onClick={enable && clickSecond} whitespaceNowrap>
        {secondText}
      </Div>
    </Div>
  );
}

function SelectCollection({ collection, selectCollection, loading }) {
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
        cursorPointer={!loading}
        onClick={!loading && onClick}
        clx={!loading && "hover:bg-gray-100"}
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
            style={{ maxHeight: "40vh" }}
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
