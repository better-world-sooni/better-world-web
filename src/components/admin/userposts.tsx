import Div from "../Div";
import Modal from "../modals/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store/reducers/rootReducer";
import { UserPosttModalAction } from 'src/store/reducers/modalReducer'
import { useState } from 'react'
import { getUserPostListQuery } from "src/hooks/queries/admin/userlist"
import { UserListPostAction } from "src/store/reducers/adminReducer";
import TimerText from "../common/timertext";
import PaginationPageSizebox from "../common/paginationpagesizebox";
import { RefreshIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { Oval } from "react-loader-spinner";
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import { defaultPageSize } from "src/hooks/queries/admin/userlist"
import { Disclosure, Transition } from "@headlessui/react";
import DefaultTransition from "../common/defaulttransition";

export default function UserPostModal({name, user_address, contract_address, token_id, refetch_userlist}) {
	const { UserPostEnabled, contract_address_reducer, token_id_reducer } = useSelector((state: RootState) => ({
		UserPostEnabled: state.modal.UserPostModal.enabled,
		contract_address_reducer: state.modal.UserPostModal.contract_address,
		token_id_reducer: state.modal.UserPostModal.token_id,
	}));
	const dispatch=useDispatch()
	const closeModal = () => {
		dispatch(UserPosttModalAction({enabled: false, contract_address:null, token_id:null}));
		dispatch(UserListPostAction({page_size:defaultPageSize, offset:0}));
	};

	return (
		<Modal open={UserPostEnabled&&(contract_address_reducer==contract_address)&&(token_id_reducer==token_id)} onClose={closeModal} bdClx={"bg-black/50"} clx={"bg-white w-full m-100"}>
		<ModalEntry name={name} user_address={user_address} contract_address={contract_address} token_id={token_id} refetch_userlist={refetch_userlist} closeModal={closeModal}/>
		</Modal>
	);
}

function ModalEntry({name, user_address, contract_address, token_id, refetch_userlist, closeModal}) {
	const dispatch=useDispatch()
	const { page_size, offset } = useSelector((state: RootState) => ({
		page_size: state.admin.UserListPostPage.page_size,
		offset: state.admin.UserListPostPage.offset
	}));
	const { isLoading:loading, isFetching:fetching,isError:error, data:post_list, refetch } = getUserPostListQuery(user_address, contract_address, token_id, page_size, offset, ()=>setLoadingButton(true))
	const [LoadingButtonOn, setLoadingButton] = useState(false)
	const loading_status = loading || fetching
	const handlePaginationOffsetChange = (event: React.ChangeEvent<unknown>, value: number) => {
		dispatch(UserListPostAction({page_size:page_size, offset:value-1}));
	};
	const handlePaginationPageSizeChange= (page_size) => {
		dispatch(UserListPostAction({page_size:page_size, offset:0}));
	};
	return (
		<Div zIndex={-1000} wFull hFull flex itemsCenter justifyCenter>
            <Div wFull mb10 flex flexCol px30 py30>
				<Div wFull flex flexRow py10 borderB1>
					<Div wFull selfCenter fontBold fontSize30 selfStart textPrimary>
						{name}<Div spanTag fontSemibold fontSize25 textBlack>
								님의 게시글
							</Div>
					</Div>
					<Div selfCenter>
						<Tooltip title="창 닫기" arrow>
							<Div fontBold selfEnd px10 cursorPointer py5 bgPrimaryLight textPrimary rounded10 clx="hover:bg-primary hover:text-white" onClick={closeModal}>
							닫기
							</Div>
						</Tooltip>
					</Div>
				</Div>
				<Div mt10 px10 wFull selfCenter>
				<Div wFull flex flexCol>
					<Div mt15 selfCenter flex flexRow wFull>
					<Div justifyItemsStart flex flexRow wFull>
						<Div selfCenter flex flexRow>
							<PaginationPageSizebox handlePaginationPageSizeChange={handlePaginationPageSizeChange} page_size={page_size}/>
							<Div selfCenter>개씩 보기</Div>
						</Div>
					</Div>
					<Div selfCenter flex flexRow>
						<Div minW={120} fontSize15 fontSemibold mr10 selfCenter>
						<Div spanTag textSuccess>
							<TimerText condtion={LoadingButtonOn &&!loading_status && !error} text={"Update Complete"} seconds={2} closecontidion={setLoadingButton}/>
						</Div>
						<Div spanTag textDanger>
							<TimerText condtion={LoadingButtonOn && error} text={"Update error"} seconds={2} closecontidion={setLoadingButton}/>
						</Div>
						</Div>
						{loading_status ? 
						<Div fontSize15 fontBold selfEnd px10 py5 textWhite rounded10 bgPrimary>
							<Oval height="14" width="14" color="blue" secondaryColor="#FFFFFF" strokeWidth="5" />
						</Div>
					: 
						<Tooltip title="업데이트" arrow>
						<Div fontBold selfEnd px10 cursorPointer py5 bgPrimaryLight textPrimary rounded10 clx="hover:bg-primary hover:text-white" onClick={refetch}>
						<RefreshIcon height={20} width={20} className="max-h-20 max-w-20" />
						</Div>
						</Tooltip>
					}
					</Div></Div>
					{post_list?.success && <PostList post_list={post_list}/>}
					{!post_list &&<Div wFull flex flexCol><Div selfCenter > <Oval height="300" width="300" color="gray" secondaryColor="#FFFFFF" strokeWidth="100" /></Div></Div>}
					{post_list?.success ? <Div selfCenter><Pagination count={Math.ceil(post_list?.list?.total_length / page_size)} page={offset+1} showFirstButton showLastButton color="primary" onChange={handlePaginationOffsetChange}/></Div>:""}
					</Div>
				</Div>
			</Div>
		</Div>
	);
}

function PostList({post_list}) {
	var list = [...post_list.list.posts]
	if (list.length==0) return (<Div mb100 wFull bgWhite textCenter textGray400>작성한 글이 없습니다.</Div>);
	return (
		<Div mb100 wFull bgWhite border1 bgOpacity90>
			{list.map((post, _) => (
				<PostEntry post={post}/>
			))}
		</Div>
	);
}

function PostEntry({post}) {
	return (
        <Disclosure as="div" className="w-full">
          {({ open }) => (
            <>
              <Disclosure.Button className="w-full text-gray-500 hover:bg-gray-100 hover:text-gray-700">
				<Div py12 px16 wFull flex flexRow cursorPointer clx={`${open ? "bg-gray-100 text-gray-700" : ""}`}>
					<Div justifyItemsStart wFull flex flexRow>
						{post.content}
					</Div>
					<Div mr10 selfCenter justifyItemsEnd>
					{(!open) && <Div px10></Div>}
					<Transition appear={true} show={open} enter="transition duration-100" enterFrom="transform rotate-0" enterTo="transform rotate-180" leave="transition duration-75" leaveFrom="transform rotate-180" leaveTo="transform rotate-0" >
						<ChevronUpIcon height={20} width={20} className="text-gray-700" />
					</Transition>
					</Div>
				</Div>
              </Disclosure.Button>
			<DefaultTransition show={open} content={
              <Disclosure.Panel className="bg-white bg-gray-100 border-b-2">
				<Div bgGray100 textGray700>Post Details</Div>
              </Disclosure.Panel>
			}/>
            </>
          )}
        </Disclosure>

	);
}