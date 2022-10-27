import Div from "src/components/Div";
import { useState } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store/reducers/rootReducer";
import { Disclosure, Transition, Switch } from "@headlessui/react";
import { Oval } from "react-loader-spinner";
import { ChevronUpIcon, RefreshIcon, UserCircleIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon, CheckIcon } from "@heroicons/react/outline";
import Pagination from "@mui/material/Pagination";
import { useDispatch } from "react-redux";
import { collectionsAction } from "src/store/reducers/adminReducer";
import { useQueryClient } from "react-query";
import Tooltip from "@mui/material/Tooltip";
import TimerText from "../common/timertext";
import PaginationPageSizebox from "../common/paginationpagesizebox";
import DataEntry from "../common/DataEntry";
import { ProfileImage, SizedImage } from "../common/ImageHelper";
import SearchBar from "src/hooks/SearchBar";
import { cancelCollectionsListQuery, getCollectionsListQuery, patchImageInfo } from "src/hooks/queries/admin/collections";
import DefaultTransition from "../common/defaulttransition";
import { motion } from "framer-motion";
import useName, { useSymbol } from "src/hooks/useName";
import EmptyBlock from "../EmptyBlock";
import useStory from "src/hooks/useStory";
import ReactTextareaAutosize from "react-textarea-autosize";
import useUploadImageUriKey from "src/hooks/useUploadImageUriKey";
import Spinner from "../common/Spinner";
import { COLORS } from "src/modules/constants";
import { createPresignedUrl, fileChecksum, uploadToPresignedUrl } from "src/modules/fileHelper";
import { Slide } from "react-slideshow-image";
import { apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";

function CollectionsScreen() {
  const { page_size, offset, search_key } = useSelector((state: RootState) => ({
    page_size: state.admin.collectionsPage.page_size,
    offset: state.admin.collectionsPage.offset,
    search_key: state.admin.collectionsPage.search_key,
  }));
  const {
    isLoading: loading,
    isFetching: fetching,
    isError: error,
    data: collections,
    refetch,
  } = getCollectionsListQuery(page_size, offset, search_key, () => setLoadingButton(true));
  const [LoadingButtonOn, setLoadingButton] = useState(false);
  const loading_status = fetching && !loading;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const refetchCollectionsList = (page_size, offset, search_key) => {
    cancelCollectionsListQuery(queryClient);
    dispatch(collectionsAction({ page_size: page_size, offset: offset, search_key: search_key }));
  };
  const handlePaginationOffsetChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (offset != value - 1) refetchCollectionsList(page_size, value - 1, search_key);
  };
  const handlePaginationPageSizeChange = (page_size_input) => {
    if (page_size != page_size_input) refetchCollectionsList(page_size_input, 0, search_key);
  };
  const handleSearchBarChange = (search_key_input) => {
    refetchCollectionsList(page_size, 0, search_key_input);
  };

  return (
    <Div flex flexCol>
      <Div mt15 mb10 selfCenter flex flexRow wFull>
        <Div justifyItemsStart flex flexRow wFull>
          <Div selfCenter>
            <PaginationPageSizebox handlePaginationPageSizeChange={handlePaginationPageSizeChange} page_size={page_size} />
          </Div>
          <Div selfCenter>개씩 보기</Div>
          <Div selfCenter ml10>
            <SearchBar w={300} placeholder={"Collections을 검색해보세요(이름/설명)"} initialText={search_key} handleSearch={handleSearchBarChange} />
          </Div>
        </Div>
        <Div selfCenter flex flexRow>
          <Div minW={120} fontSize15 fontSemibold mr10 selfCenter>
            <Div spanTag textSuccess>
              <TimerText
                condtion={!loading && LoadingButtonOn && !loading_status && !error}
                text={"Update Complete"}
                seconds={2}
                closecontidion={setLoadingButton}
              />
            </Div>
            <Div spanTag textDanger>
              <TimerText condtion={!loading && LoadingButtonOn && error} text={"Update error"} seconds={2} closecontidion={setLoadingButton} />
            </Div>
          </Div>
          {collections &&
            (loading_status ? (
              <Div fontSize15 fontBold selfEnd px10 py5 textWhite rounded10 bgBW>
                <Oval height="14" width="14" color="#4738FF" secondaryColor="#FFFFFF" strokeWidth="5" />
              </Div>
            ) : (
              <Tooltip title="업데이트" arrow>
                <Div fontBold selfEnd px10 cursorPointer py5 bgBWLight textBW rounded10 clx="hover:bg-bw hover:text-white" onClick={refetch}>
                  <RefreshIcon height={20} width={20} className="max-h-20 max-w-20" />
                </Div>
              </Tooltip>
            ))}
        </Div>
      </Div>
      {loading && (
        <Div fontBold mb100 textStart maxW={1100} mxAuto>
          <Oval height="300" width="300" color="#4738FF" secondaryColor="#FFFFFF" strokeWidth="100" />
        </Div>
      )}
      {collections?.success && <CollectionsArray collections={collections} />}
      {collections?.success && (
        <Div selfCenter>
          <Pagination
            count={Math.ceil(collections?.collections?.collection_count / page_size)}
            page={offset + 1}
            showFirstButton
            showLastButton
            onChange={handlePaginationOffsetChange}
          />
        </Div>
      )}
      {error ||
        (collections && !collections.success && (
          <Div fontSize20 mb100 textStart maxW={1100} mxAuto>
            오류가 발생하였습니다. 다시 시도하여 주세요.
          </Div>
        ))}
    </Div>
  );
}

function CollectionsArray({ collections }) {
  var list = collections && collections?.collections && [...collections?.collections?.collections];
  if (list == null) return <></>;
  return list.length != 0 ? (
    <Div mb100 wFull bgWhite border1 bgOpacity90>
      {list.map((collection, index) => (
        <CollectionEntry key={index} collection={collection} />
      ))}
    </Div>
  ) : (
    <Div mb100 wFull bgWhite bgOpacity90>
      <Div textCenter>Event가 존재하지 않습니다.</Div>
    </Div>
  );
}

function CollectionEntry({ collection }) {
  const { search_key } = useSelector((state: RootState) => ({
    search_key: state.admin.collectionsPage.search_key,
  }));
  const HandleOpen = (open) => open || search_key != "";
  return (
    <Disclosure as="div" className="w-full">
      {({ open }) => (
        <>
          <Disclosure.Button className="w-full hover:bg-gray-100">
            <Div px30 py10 cursorPointer flex flexRow justifyCenter border1 borderGray100 clx={`${HandleOpen(open) ? "bg-gray-100" : ""}`} overflowHidden>
              <Div wFull flex flexRow justifyCenter selfCenter>
                <Div wFull flex flexRow justifyStart gapX={20}>
                  <Div selfCenter>
                    <ProfileImage width={40} height={40} nft={collection} rounded={true} />
                  </Div>
                  <Div flex flexCol justifyStart selfCenter wFull>
                    <Div fontSize18 fontBold wFull overflowEllipsis overflowHidden whitespaceNowrap textLeft>
                      {collection?.name}
                    </Div>
                    <Div fontSize12 wFull overflowEllipsis overflowHidden whitespaceNowrap textLeft>
                      {collection?.symbol}
                    </Div>
                  </Div>
                </Div>
                <Div flex flexRow wFull justifyEnd>
                  {collection?.status != 1 && (
                    <DataEntry
                      name={"팔로워 수"}
                      w={55}
                      label={<StarIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" />}
                      data={collection?.follower_count}
                    />
                  )}
                  <DataEntry
                    name={"Member 수"}
                    w={55}
                    label={<UserCircleIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" />}
                    data={collection?.member_count}
                  />
                </Div>
              </Div>
              <Div selfCenter>
                <motion.div animate={{ rotate: HandleOpen(open) ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronUpIcon height={20} width={20} className="text-gray-400" />
                </motion.div>
              </Div>
            </Div>
          </Disclosure.Button>
          <DefaultTransition
            show={HandleOpen(open)}
            content={
              <Disclosure.Panel static className="bg-gray-100 border-b-2">
                <CollectionsDetails collection={collection} />
              </Disclosure.Panel>
            }
          />
        </>
      )}
    </Disclosure>
  );
}

function CollectionsDetails({ collection }) {
  const { name, nameHasChanged, nameError, handleChangeName } = useName(collection?.name, 10, 40);
  const { story, storyHasChanged, storyError, handleChangeStory } = useStory(collection?.about);
  console.log(story);
  const { image, uploading, handleAddImage, getImageUriKey, reLoadImage, imageHasChanged } = useUploadImageUriKey({
    uri: collection?.image_uri,
    attachedRecord: "nft_collection",
  });
  const {
    image: backgroundImage,
    uploading: backgroundImageUploading,
    handleAddImage: handleAddBackgroundImage,
    getImageUriKey: getBackgroundImageUriKey,
    reLoadImage: reLoadBackgroundImage,
    imageHasChanged: backgroundImageHasChanged,
  } = useUploadImageUriKey({
    uri: collection?.background_image_uri,
    attachedRecord: "nft_collection",
  });
  const queryClient = useQueryClient();
  const { isLoading, mutate } = patchImageInfo(collection, queryClient);
  const updateCollections = async () => {
    const imageUriKey = imageHasChanged ? await getImageUriKey() : null;
    const backgroundImageUriKey = backgroundImageHasChanged ? await getBackgroundImageUriKey() : null;
    const body = {
      imageUriKey,
      backgroundImageUriKey,
      name: nameHasChanged ? name : null,
      story: storyHasChanged ? story : null,
    };
    mutate(body);
  };
  const isSave = (backgroundImageHasChanged || imageHasChanged || nameHasChanged || storyHasChanged) && !nameError && !storyError;
  const loading = isLoading || backgroundImageUploading || uploading;
  return (
    <Div px30 py10 flex flexCol justifyCenter overflowHidden gapY={20}>
      <Div wFull flex flexRow justifyCenter gapX={20}>
        <Div selfCenter flex flexCol justifyCenter>
          <Div textCenter fontBold fontSize18>
            Image
          </Div>
          <Div>
            <SizedImage
              width={196}
              height={196}
              uri={image}
              onClick={!loading && handleAddImage}
              imageHasChanged={!loading && imageHasChanged}
              reload={!loading && reLoadImage}
              loading={loading && uploading}
            />
          </Div>
        </Div>
        <Div selfCenter flex flexCol justifyCenter>
          <Div textCenter fontBold fontSize18>
            Background
          </Div>
          <Div>
            <SizedImage
              width={600}
              height={196}
              uri={backgroundImage}
              onClick={!loading && handleAddBackgroundImage}
              imageHasChanged={!loading && backgroundImageHasChanged}
              reload={!loading && reLoadBackgroundImage}
              loading={loading && backgroundImageUploading}
            />
          </Div>
        </Div>
      </Div>
      <Div flex flexCol justifyCenter>
        <Div wFull flex flexRow justifyStart fontBold fontSize18>
          <Div selfStart mr50>
            Name
          </Div>
          <Div selfStart wFull>
            <input
              placeholder="Collection 이름"
              value={name}
              className={"px-5 ml-10 self-center w-full focus:outline-none focus:border-gray-400 bg-white rounded-md"}
              style={{ width: "100%", boxShadow: "none", border: "none" }}
              onChange={handleChangeName}
            ></input>
            {nameError ? (
              <Div ml10 mt3 textDanger fontSize11>
                {nameError}
              </Div>
            ) : (
              <EmptyBlock h={20} />
            )}
          </Div>
        </Div>
        <Div wFull flex flexRow justifyStart fontBold fontSize18>
          <Div selfStart>Descriptions</Div>
          <Div selfStart wFull>
            <ReactTextareaAutosize
              rows={5}
              onChange={handleChangeStory}
              placeholder={" Descriptions"}
              className={"px-5 ml-10 self-center w-full focus:outline-none focus:border-gray-400 bg-white rounded-md"}
              value={story}
              style={{ boxShadow: "none", border: "none", resize: "none", width: "100%", padding: 0 }}
            />
            {storyError ? (
              <Div ml10 mt3 textDanger fontSize11>
                {storyError}
              </Div>
            ) : (
              <EmptyBlock h={20} />
            )}
          </Div>
        </Div>
      </Div>
      <Div wFull flex flexRow justifyEnd mb={!isSave && 30}>
        <DefaultTransition
          show={isSave}
          content={
            loading ? (
              <Div fontBold px10 cursorPointer py5 bgGray600 rounded10>
                <Oval height="14" width="14" color="gray" secondaryColor="#FFFFFF" strokeWidth="5" />
              </Div>
            ) : (
              <Tooltip title="저장하기" arrow>
                <Div fontBold px10 cursorPointer py5 bgGray400 rounded10 clx="hover:bg-gray-600 hover:text-white" onClick={isSave && updateCollections}>
                  <CheckIcon height={20} width={20} className="max-h-20 max-w-20" />
                </Div>
              </Tooltip>
            )
          }
        />
      </Div>
    </Div>
  );
}

export default CollectionsScreen;
