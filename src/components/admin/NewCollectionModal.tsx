import Div from "../Div";
import Modal from "../modals/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store/reducers/rootReducer";
import { newCollectionAction, newEventModalAction } from "src/store/reducers/modalReducer";
import Tooltip from "@mui/material/Tooltip";
import useName from "src/hooks/useName";

import EmptyBlock from "../EmptyBlock";
import useContractAddress from "src/hooks/useContractAddress";
import DefaultTransition from "../common/defaulttransition";
import { CheckIcon } from "@heroicons/react/outline";
import { Oval } from "react-loader-spinner";
import { getNewCollectionQuery } from "src/hooks/queries/admin/collections";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { CollectionsDetails } from "./collections";

export const useOpenNewCollectionModal = () => {
  const dispatch = useDispatch();
  const openCollectionModal = () => dispatch(newCollectionAction({ enabled: true, contractAddress: "", collection: null, error: "" }));
  return openCollectionModal;
};

export default function NewCollectionModal({}) {
  const { enabled, contractAddress, collection, error } = useSelector((state: RootState) => ({
    enabled: state.modal.newCollectionModal.enabled,
    contractAddress: state.modal.newCollectionModal.contractAddress,
    collection: state.modal.newCollectionModal.collection,
    error: state.modal.newCollectionModal.error,
  }));
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(newCollectionAction({ enabled: false, contractAddress: "", collection: null, error: "" }));
  };

  return (
    <Modal
      open={enabled}
      onClose={() => {
        return;
      }}
      bdClx={"bg-black/50"}
      clx={"bg-white"}
    >
      <CollectionDetail closeModal={closeModal} contract_address={contractAddress} collection={collection} Error={error} />
    </Modal>
  );
}

function CollectionDetail({ closeModal, contract_address, collection, Error }) {
  const dispatch = useDispatch();
  const setModalParameter = ({ enable = true, contractAddress = contract_address, collection_data = collection, error = Error }) => {
    dispatch(newCollectionAction({ enabled: enable, contractAddress: contractAddress, collection: collection_data, error: error }));
  };
  return (
    <Div zIndex={-1000} w={"80vw"} hFull flex itemsCenter justifyCenter>
      <Div wFull mb10 flex flexCol px30 py30>
        <Div wFull flex flexRow py10 borderB1>
          <Div wFull selfCenter fontBold fontSize30 selfStart textBW>
            새 Collection 추가
          </Div>
          <Div selfCenter>
            <Tooltip title="창 닫기" arrow>
              <Div fontBold selfEnd px10 cursorPointer py5 bgBWLight textBW rounded10 clx="hover:bg-bw hover:text-white" onClick={closeModal}>
                닫기
              </Div>
            </Tooltip>
          </Div>
        </Div>
        <Div wFull mt20>
          {collection == null && contract_address == "" && <WriteContractAddress setModalParameter={setModalParameter} error={Error} />}
          {collection == null && contract_address != "" && <WaitingForAdd setModalParameter={setModalParameter} contract_address={contract_address} />}
          {collection != null && contract_address != "" && (
            <Div wFull flex flexCol fontSize16 fontSemibold>
              {`${collection?.name}이/가 성공적으로 추가되었습니다. 나머지 설정을 완료해주세요.`}
              <CollectionsDetails collection={collection} closeModal={closeModal} />
            </Div>
          )}
        </Div>
      </Div>
    </Div>
  );
}

function WaitingForAdd({ setModalParameter, contract_address }) {
  const queryClient = useQueryClient();
  const { isLoading: loading, isError: error, data: collection } = getNewCollectionQuery(contract_address, queryClient);
  useEffect(() => {
    if (error || collection)
      setModalParameter({
        contractAddress: !error && collection && collection?.success ? contract_address : "",
        collection_data: !error && collection && collection?.success ? collection?.nft_collection : null,
        error:
          !error && collection && collection?.success
            ? ""
            : collection?.nft_collection?.name
            ? `${collection?.nft_collection?.name}은/는 이미 존재합니다.`
            : "컨트랙트 주소가 유효하지 않습니다.",
      });
  }, [loading]);
  return (
    <Div wFull flex flexRow justifyCenter mt50 mb50>
      <Oval height="50" width="50" color="black" secondaryColor="#FFFFFF" strokeWidth="5" />
    </Div>
  );
}

function WriteContractAddress({ setModalParameter, error }) {
  const { contractAddress, contractAddressError, handleChangeContractAddress } = useContractAddress("");
  const canSubmit = !contractAddressError && contractAddress != "";
  const onClickNext = () => setModalParameter({ contractAddress: contractAddress });
  const onEnter = (e) => {
    if (e.key === "Enter" && canSubmit) {
      onClickNext();
    }
  };
  return (
    <Div wFull flex flexCol fontSize18 gapY={20}>
      추가할 Collection의 컨트랙스 주소를 작성해주세요.
      <Div wFull flex flexRow justifyStart fontBold fontSize18>
        <Div selfStart mr50 whitespaceNowrap>
          컨트랙트 주소
        </Div>
        <Div selfStart wFull>
          <input
            placeholder="0x..."
            value={contractAddress}
            className={"px-5 ml-10 self-center w-full focus:outline-none focus:border-gray-400 bg-white rounded-md"}
            style={{ width: "100%", boxShadow: "none", border: "none" }}
            onChange={handleChangeContractAddress}
            onKeyPress={onEnter}
          ></input>
          {contractAddressError ? (
            <Div ml10 mt3 textDanger fontSize11>
              {contractAddressError}
            </Div>
          ) : (
            <EmptyBlock h={20} />
          )}
        </Div>
      </Div>
      {error != "" && (
        <Div wFull textDanger fontBold fontSize15>
          {error}
        </Div>
      )}
      <Div wFull flex flexRow justifyEnd mb={!canSubmit && 30}>
        {canSubmit && (
          <DefaultTransition
            show={canSubmit}
            duration={0.3}
            content={
              <Tooltip title="저장하기" arrow>
                <Div fontBold px10 cursorPointer py5 bgGray400 rounded10 clx="hover:bg-gray-600 hover:text-white" onClick={canSubmit && onClickNext}>
                  <CheckIcon height={20} width={20} className="max-h-20 max-w-20" />
                </Div>
              </Tooltip>
            }
          />
        )}
      </Div>
    </Div>
  );
}
