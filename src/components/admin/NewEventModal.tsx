import Div from "../Div";
import Modal from "../modals/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store/reducers/rootReducer";
import { newEventModalAction } from "src/store/reducers/modalReducer";
import Tooltip from "@mui/material/Tooltip";
import { getAllCollectionsQuery } from "src/hooks/queries/admin/events";
import { ProfileImage, UploadImage } from "../common/ImageHelper";
import { Fragment, useState } from "react";
import DefaultTransition from "../common/defaulttransition";
import { ArrowRightIcon, CheckIcon, ChevronDownIcon, GlobeAltIcon, MinusIcon, PencilAltIcon, PlusIcon, SearchIcon } from "@heroicons/react/outline";
import useUploadDrawEvent, { EventApplicationInputType, EventType, OrderableType } from "src/hooks/useUploadDrawEvent";
import ReactTextareaAutosize from "react-textarea-autosize";
import { DefaultText } from "../common/ModifiedTruncatedMarkdown";
import { FaBars, FaDiscord, FaTwitter } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useQueryClient } from "react-query";
import { Oval } from "react-loader-spinner";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";

import "react-datepicker/dist/react-datepicker.css";
import { Menu, Transition } from "@headlessui/react";
import useLink from "src/hooks/useLink";

export const useOpenNewEventModal = (data = null) => {
  const dispatch = useDispatch();
  const openNewEventModal = () => dispatch(newEventModalAction({ enabled: true, event: data }));
  return openNewEventModal;
};

export default function NewEventModal({}) {
  const { enabled, event } = useSelector((state: RootState) => ({
    enabled: state.modal.newEventModal.enabled,
    event: state.modal.newEventModal.event,
  }));
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(newEventModalAction({ enabled: false, event: null }));
  };

  return (
    <Modal
      open={enabled}
      onClose={() => {
        return;
      }}
      bdClx={"bg-black/50"}
      clx={"bg-white w-full"}
    >
      <EventDetails closeModal={closeModal} event={event} />
    </Modal>
  );
}

function EventDetails({ closeModal, event }) {
  const queryClient = useQueryClient();
  const {
    canModifyCollection,
    collection,
    selectCollection,
    type,
    setType,
    canModifyType,
    error,
    loading,
    applicationCategories,
    handleAddApplicationCategory,
    handleRemoveApplicationCategory,
    handleAddApplicationOption,
    handleRemoveApplicationOption,
    handleChangeApplicationCategoryName,
    handleChangeApplicationName,
    handleChangeApplicationInputType,
    canModifyApplicationCategories,
    orderableType,
    setOrderableType,
    discordLink,
    handleDiscordLinkChange,
    handleClickDiscordLink,
    discordLinkError,
    expiresAt,
    setExpiresAt,
    createdAt,
    enableCreatedAt,
    setCreatedAt,
    setEnableCreatedAt,
    name,
    handleNameChange,
    description,
    handleDescriptionChange,
    imageUrls,
    handleAddImages,
    handleChangeImage,
    handleRemoveImage,
    canModifyImages,
    fileLimit,
    uploadDrawEvent,
    eanbleExpires,
    setEnableExpires,
  } = useUploadDrawEvent({ queryClient, uploadSuccessCallback: closeModal, event });
  console.log(applicationCategories);
  return (
    <Div zIndex={-1000} wFull hFull flex itemsCenter justifyCenter>
      <Div wFull mb10 flex flexCol px30 py30>
        <Div wFull flex flexRow py10 borderB1>
          <Div wFull selfCenter fontBold fontSize30 selfStart textBW>
            {event ? "Event 수정" : "새 Event 작성"}
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
              <SelectCollection collection={collection} selectCollection={selectCollection} loading={canModifyCollection ? loading : true} />
            </Div>
            <Div selfCenter justifyEnd>
              <SelectEventType type={type} setType={setType} loading={canModifyType ? loading : true} />
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
            <Div wFull />
            <Div selfStart wFull flex flexRow justifyEnd gapX={20}>
              {enableCreatedAt && (
                <Div selfCenter w190>
                  <DatePicker
                    className={"self-center h-full w-full focus:outline-none focus:border-gray-400 bg-transparent rounded-md border-none"}
                    selected={createdAt}
                    onChange={!loading && ((date) => setCreatedAt(date))}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    locale={ko}
                    timeCaption="time"
                    dateFormat="yyyy/MM/dd aa h:mm "
                  />
                </Div>
              )}
              <Div selfCenter mt3 mb3>
                <SelectCreatedAt enableCreatedAt={enableCreatedAt} toggleCreatedAt={() => setEnableCreatedAt((prev) => !prev)} loading={loading} />
              </Div>
            </Div>
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
              loading={canModifyImages ? loading : true}
            />
            <DefaultTransition
              show={type == EventType.EVENT}
              content={
                <Options
                  orderableType={orderableType}
                  setOrderableType={setOrderableType}
                  applicationCategories={applicationCategories}
                  handleAddApplicationCategory={handleAddApplicationCategory}
                  handleRemoveApplicationCategory={handleRemoveApplicationCategory}
                  handleAddApplicationOption={handleAddApplicationOption}
                  handleRemoveApplicationOption={handleRemoveApplicationOption}
                  handleChangeApplicationCategoryName={handleChangeApplicationCategoryName}
                  handleChangeApplicationInputType={handleChangeApplicationInputType}
                  handleChangeApplicationName={handleChangeApplicationName}
                  canModifyApplicationCategories={canModifyApplicationCategories}
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
          <Div selfCenter>
            <DefaultTransition
              show={error != ""}
              content={
                <Div textDanger fontBold mr10>
                  {error}
                </Div>
              }
            />
          </Div>
          <Div selfCenter>
            {loading ? (
              <Div fontBold bgBW selfEnd px10 py5 bgBWLight textWhite rounded10>
                <Oval height="14" width="14" color="#4738FF" secondaryColor="#FFFFFF" strokeWidth="5" />
              </Div>
            ) : (
              <Tooltip title={event ? "이벤트 수정" : "이벤트 업로드"} arrow>
                <Div fontBold bgOpacity80 bgBW selfEnd px10 cursorPointer py5 bgBWLight textWhite rounded10 clx="hover:bg-bw" onClick={uploadDrawEvent}>
                  {event ? "수정" : "업로드"}
                </Div>
              </Tooltip>
            )}
          </Div>
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
  orderableType,
  setOrderableType,

  applicationCategories,
  handleAddApplicationCategory,
  handleRemoveApplicationCategory,
  handleAddApplicationOption,
  handleRemoveApplicationOption,
  canModifyApplicationCategories,
  handleChangeApplicationCategoryName,
  handleChangeApplicationInputType,
  handleChangeApplicationName,

  expiresAt,
  setExpiresAt,
  eanbleExpires,
  setEnableExpires,

  loading,
}) {
  return (
    <Div wFull flex flexCol justifyCenter mt20 gapY={20} mb200>
      <Div flex flexRow justifyStart gapX={20}>
        <SelectExpires enableExpires={eanbleExpires} toggleExpires={() => setEnableExpires((prev) => !prev)} loading={loading} />
        <DefaultTransition
          show={eanbleExpires}
          content={
            <Div mt3 selfCenter w200>
              <DatePicker
                className={"self-center h-full w-full focus:outline-none focus:border-gray-400 bg-transparent rounded-md border-none"}
                selected={expiresAt}
                onChange={!loading && ((date) => setExpiresAt(date))}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                locale={ko}
                timeCaption="time"
                dateFormat="yyyy/MM/dd H:mm"
              />
            </Div>
          }
        />
      </Div>
      <Div wFull flex flexRow justifyStart gapX={20}>
        <SelectOrderableType orderableType={orderableType} setOrderableType={setOrderableType} loading={loading} />
      </Div>
      <Div relative selfCenter flex flexCol wFull jsutifyStart gapX={10} flexWrap gapY={10} ml30>
        <AnimatePresence>
          {applicationCategories
            ? applicationCategories.map((value, index) => (
                <ModifyOption
                  index={index}
                  option={value}
                  length={applicationCategories.length}
                  onClick={() => handleRemoveApplicationCategory(index)}
                  key={value?.index}
                  handleChangeApplicationCategoryName={(categoryName) => handleChangeApplicationCategoryName(index, categoryName)}
                  handleChangeApplicationInputType={(inputType: EventApplicationInputType) => handleChangeApplicationInputType(index, inputType)}
                  handleAddApplicationOption={(optionName) => handleAddApplicationOption(index, optionName)}
                  handleRemoveApplicationOption={(optionIndex) => handleRemoveApplicationOption(index, optionIndex)}
                  loading={canModifyApplicationCategories ? loading : true}
                  handleChangeApplicationName={(applicationName) => handleChangeApplicationName(index, applicationName)}
                />
              ))
            : null}
          {!(canModifyApplicationCategories ? loading : true) && (
            <Div flex flexRow gapX={20}>
              <Div w={"10vw"} />
              <AddOptions handleAddApplicationCategory={handleAddApplicationCategory} />
            </Div>
          )}
        </AnimatePresence>
      </Div>
    </Div>
  );
}

function ModifyOption({
  length,
  index,
  option,
  onClick,
  handleAddApplicationOption,
  handleRemoveApplicationOption,
  handleChangeApplicationName,
  handleChangeApplicationInputType,
  loading,
  handleChangeApplicationCategoryName,
}) {
  const [optionInput, handleChangeOptionInputText] = useState("");
  const [error, setError] = useState(false);
  const handleChangeApplicationCategoryNameText = ({ target: { value } }) => {
    !loading && handleChangeApplicationCategoryName(value);
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
    <motion.div
      initial={animation.unmount}
      animate={animation.mount}
      exit={animation.unmount}
      transition={animation.transition}
      style={{ position: "relative" }}
    >
      <Div relative wFull flex flexRow justifyStart gapX={20}>
        <Div flex flexRow justifyEnd w={"10vw"} pr10>
          {!loading && length != 1 && (
            <Div wFull selfCenter>
              <Div
                selfCenter
                rounded15
                w30
                h30
                bgDangerLight
                textCenter
                flex
                flexRow
                justifyCenter
                clx="hover:bg-danger"
                cursorPointer
                onClick={!loading && onClick}
              >
                <Div selfCenter>
                  <MinusIcon height={12} width={12} className="max-h-12 max-w-12" />
                </Div>
              </Div>
            </Div>
          )}
          <Div whitespaceNowrap selfCenter textRight fontBold>
            참여 조건{" " + (index + 1)}
          </Div>
        </Div>
        <Div selfCenter justifyStart w={"25vw"} px20 py10 textCenter bgGray200>
          <input
            placeholder={"참여 조건 " + (index + 1) + " 입력"}
            value={option.category}
            className={"self-center h-full w-full focus:outline-none focus:border-gray-400 bg-transparent rounded-md"}
            style={{ boxShadow: "none", border: "none" }}
            onChange={handleChangeApplicationCategoryNameText}
          ></input>
        </Div>
        <ChooseInputType loading={loading} inputType={option.inputType} handleChangeApplicationInputType={handleChangeApplicationInputType} />
        {option.inputType == EventApplicationInputType.LINK && (
          <OptionLink loading={loading} handleChangeApplicationName={handleChangeApplicationName} link={option.name} />
        )}
      </Div>
    </motion.div>
  );
}

function OptionLink({ loading, handleChangeApplicationName, link }) {
  const { linkError, handleChangeLink, handleClickLink } = useLink("", false);
  const handleChangeApplicationLink = ({ target: { value } }) => {
    !loading && handleChangeApplicationName(value);
    !loading && handleChangeLink({ target: { value } });
  };
  return (
    <Div flex flexRow w={"37vw"}>
      <Div wFull selfCenter justifyStart px20 py10 textCenter bgGray200 border1={linkError != ""} borderDanger>
        <input
          placeholder={"https://..."}
          value={link}
          className={"self-center h-full w-full focus:outline-none focus:border-gray-400 bg-transparent rounded-md"}
          style={{ boxShadow: "none", border: "none" }}
          onChange={handleChangeApplicationLink}
        ></input>
      </Div>
      <Div selfCenter ml10 px10 py5 bgInfo bgOpacity50 rounded10 textWhite cursorPointer clx="hover:bg-info" onClick={handleClickLink}>
        {" "}
        <ArrowRightIcon height={20} width={20} className="max-h-20 max-w-20" />
      </Div>
    </Div>
  );
}

function ChooseInputType({ loading, inputType, handleChangeApplicationInputType }) {
  const MenuItem = (props) => {
    return (
      <Div
        borderT1
        borderGray300
        fontSize12
        selfCenter
        justifyCenter
        w={130}
        px10
        py5
        textCenter
        bgGray200
        relative
        clx={`${props.active ? "bg-gray-300 font-bold" : "text-gray-800"}`}
        cursorPointer
        {...props}
      >
        {props.children}
      </Div>
    );
  };
  return loading ? (
    <Div relative fontSize16 selfCenter justifyCenter w={130} px10 py10 textCenter bgGray200>
      {inputType == EventApplicationInputType.LINK
        ? "링크"
        : inputType == EventApplicationInputType.SELECT
        ? "선택 카테고리"
        : inputType == EventApplicationInputType.CUSTOM_INPUT
        ? "유저 입력란"
        : inputType == EventApplicationInputType.DISCORD_ID
        ? "디스코드 아이디"
        : inputType == EventApplicationInputType.TWITTER_ID
        ? "트위터 아이디"
        : "옵션 선택"}
    </Div>
  ) : (
    <Div relative>
      <Menu as="div">
        <Menu.Button className="relative">
          <Div relative fontSize16 selfCenter justifyCenter w={130} px10 py10 textCenter bgGray200 clx="hover:bg-gray-300">
            {inputType == EventApplicationInputType.LINK
              ? "링크"
              : inputType == EventApplicationInputType.SELECT
              ? "선택 카테고리"
              : inputType == EventApplicationInputType.CUSTOM_INPUT
              ? "유저 입력란"
              : inputType == EventApplicationInputType.DISCORD_ID
              ? "디스코드 아이디"
              : inputType == EventApplicationInputType.TWITTER_ID
              ? "트위터 아이디"
              : "옵션 선택"}
          </Div>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute bg-gray-200 focus:outline-none " style={{ zIndex: 100 }}>
            <Div relative textBase fontSize12>
              <Menu.Item>
                {({ active }) => (
                  <MenuItem active={active} onClick={() => handleChangeApplicationInputType(EventApplicationInputType.LINK)}>
                    링크
                  </MenuItem>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <MenuItem active={active} onClick={() => handleChangeApplicationInputType(EventApplicationInputType.SELECT)}>
                    선택 카테고리
                  </MenuItem>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <MenuItem active={active} onClick={() => handleChangeApplicationInputType(EventApplicationInputType.CUSTOM_INPUT)}>
                    유저 입력란
                  </MenuItem>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <MenuItem active={active} onClick={() => handleChangeApplicationInputType(EventApplicationInputType.DISCORD_ID)}>
                    디스코드 아이디
                  </MenuItem>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <MenuItem active={active} onClick={() => handleChangeApplicationInputType(EventApplicationInputType.TWITTER_ID)}>
                    트위터 아이디
                  </MenuItem>
                )}
              </Menu.Item>
            </Div>
          </Menu.Items>
        </Transition>
      </Menu>
    </Div>
  );
}

function AddOptions({ handleAddApplicationCategory }) {
  return (
    <Div
      justifyStart
      w={"25vw"}
      px20
      py10
      textCenter
      bgGray200
      fontSize20
      fontBold
      onClick={handleAddApplicationCategory}
      cursorPointer
      clx="hover:bg-gray-300"
    >
      +
    </Div>
  );
}

function DiscordLink({ discordLink, handleDiscordLinkChange, handleClickDiscordLink, discordLinkError }) {
  return (
    <Div selfCenter flex flexRow gapX={10}>
      <Div mt5 fontSemibold whitespaceNowrap>
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

function SelectOrderableType({ orderableType, setOrderableType, loading }) {
  return (
    <Div selfStart>
      <SelectEntry
        firstText={"홀더만 응모 가능"}
        secondText={"누구나 응모 가능"}
        clickFirst={() => setOrderableType(OrderableType.HOLDER_ONLY)}
        clickSecond={() => setOrderableType(OrderableType.ALL)}
        isFirst={orderableType == OrderableType.HOLDER_ONLY}
        isSecond={orderableType == OrderableType.ALL}
        enable={!loading}
      />
    </Div>
  );
}

function SelectExpires({ enableExpires, toggleExpires, loading }) {
  return (
    <Div selfCenter mt5 mb5>
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

function SelectCreatedAt({ enableCreatedAt, toggleCreatedAt, loading }) {
  return (
    <Div selfCenter>
      <SelectEntry
        firstText={"작성 날짜 설정"}
        secondText={"미설정"}
        clickFirst={toggleCreatedAt}
        clickSecond={toggleCreatedAt}
        isFirst={enableCreatedAt}
        isSecond={!enableCreatedAt}
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
      value != null &&
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
  const collectionListShowed =
    searchKey == ""
      ? collectionListFiltered && collectionListFiltered.length == 0 && collectionList?.collections && collectionList?.collections.length != 0
        ? collectionList?.collections
        : collectionListFiltered
      : collectionListFiltered;
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
                  {collectionListShowed &&
                    collectionListShowed.length != 0 &&
                    collectionListShowed.map((value, index) => (
                      <Div
                        key={index}
                        flex
                        flexRow
                        justifyStart
                        borderGray200
                        borderB1={index != collectionListShowed.length - 1}
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
