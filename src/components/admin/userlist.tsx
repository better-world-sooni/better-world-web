import Div from "src/components/Div";
import { useState } from 'react'
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store/reducers/rootReducer";
import { Disclosure, Transition, Switch } from "@headlessui/react";
import { Oval } from "react-loader-spinner";
import { ChevronDownIcon, ChevronUpIcon, AdjustmentsIcon, CubeIcon, IdentificationIcon, PencilAltIcon, LightBulbIcon, HeartIcon, SparklesIcon, CogIcon, RefreshIcon, CheckIcon } from "@heroicons/react/outline";
import { resizeImageUri } from "src/modules/uriUtils"
import useName from "src/hooks/useName"
import useStory from "src/hooks/useStory";
import useEdittableToggle from "src/hooks/useEdittableToggle";
import EmptyBlock from "../EmptyBlock";
import Pagination from '@mui/material/Pagination';
import { getUserListQuery, patchUserInfo, prefetchUserListQuery } from "src/hooks/queries/admin/userlist"
import { useDispatch } from "react-redux";
import { UserListAction } from "src/store/reducers/adminReducer";
import { useQueryClient } from "react-query";
import Tooltip from '@mui/material/Tooltip';
import {UserPosttModalAction} from 'src/store/reducers/modalReducer'
import UserPostModal from "./userposts";
import TimerText from "../common/timertext";
import DefaultTransition from "../common/defaulttransition";
import PaginationPageSizebox from "../common/paginationpagesizebox";
import Skeleton from '@mui/material/Skeleton';

function UserList() {
	const { page_size, offset } = useSelector((state: RootState) => ({
		page_size: state.admin.UserListPage.page_size,
		offset: state.admin.UserListPage.offset
	}));
	const { isLoading:loading, isFetching:fetching,isError:error, data:user_list, refetch } = getUserListQuery(page_size, offset, ()=>setLoadingButton(true))
	const [LoadingButtonOn, setLoadingButton] = useState(false)
	const loading_status = loading || fetching
	const dispatch = useDispatch();
	const queryClient = useQueryClient()
	const handlePaginationOffsetChange = (event: React.ChangeEvent<unknown>, value: number) => {
		if (offset!=value-1)prefetchUserListQuery(queryClient, page_size, value-1);
		dispatch(UserListAction({page_size:page_size, offset:value-1}));
	};
	const handlePaginationPageSizeChange= (page_size_input) => {
		if (page_size!=page_size_input)prefetchUserListQuery(queryClient, page_size_input, 0)
		dispatch(UserListAction({page_size:page_size_input, offset:0}));
	};
	return (
		<Div flex flexCol>
			<Div mt15 mb10 selfCenter flex flexRow wFull>
			<Div justifyItemsStart flex flexRow wFull>
				<Div selfCenter><PaginationPageSizebox handlePaginationPageSizeChange={handlePaginationPageSizeChange} page_size={page_size}/></Div>
				<Div selfCenter>개씩 보기</Div>
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
		<UserArray user_list={user_list} refetch={refetch} loading={loading_status}/>
		{user_list?.success ? <Div selfCenter><Pagination count={Math.ceil(user_list?.list?.total_length / page_size)} page={offset+1} showFirstButton showLastButton color="primary" onChange={handlePaginationOffsetChange}/></Div>:""}
		</Div>
	);
}

function UserArray({user_list, refetch, loading}) {
	const success = user_list?.success;
	if (loading && !user_list) return (
		<Div fontBold mb100 textStart maxW={1100} mxAuto>
		<Oval height="300" width="300" color="blue" secondaryColor="#FFFFFF" strokeWidth="100" />
		</Div>
	)
	if (!success) return (
		<Div fontSize20 mb100 textStart maxW={1100} mxAuto>
			오류가 발생하였습니다. 다시 시도하여 주세요.
		</Div>
	)
	var list = [...user_list.list.users]
	return (
		<Div mb100 wFull bgWhite border1 bgOpacity90>
			{list.map((user, _) => (
				<UserEntry user={user} key={user.user_address} refetch={refetch}/>
			))}
		</Div>
	);
}

function UserEntry({user, refetch}) {
	var list = [...user.nfts]
	var sorted_list = sort_nfts(list)

	const total_post = sorted_list.reduce(function(a, b) {return a+b.posts;},0)
	const total_proposals = sorted_list.reduce(function(a, b) {return a+b.proposals;},0)
	const total_contribution = sorted_list.reduce(function(a, b) {return a+b.contribution;},0)

	return (
		
        <Disclosure as="div" className="w-full">
          {({ open }) => (
            <>
              <Disclosure.Button className="w-full text-gray-400 hover:bg-gray-100 hover:text-gray-500">
				<Div py12 px16 wFull flex flexRow cursorPointer clx={`${open ? "bg-gray-100 text-gray-500" : ""}`}>
					<Div justifyItemsStart wFull flex flexRow>
						<Div fontSize20 textBlack minW={120} maxW={120} mr10 textLeft fontBold>{sorted_list[0].name ? sorted_list[0].name : sorted_list[0].nft_name}<br></br><Div fontSemibold fontSize13>{sorted_list[0].name ? sorted_list[0].nft_name : <EmptyBlock h={20} />}</Div></Div>
						<Div flex flexRow flexWrap>
						<DataEntry name={"PFP 개수"} w={55} label={<CubeIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" />} data={sorted_list.length}/>
						<DataEntry name={"게시물 합"} w={55} label={<PencilAltIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" />} data={total_post}/>
						<DataEntry name={"제안 합"} w={55} label={<LightBulbIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" />} data={total_proposals}/>
						<DataEntry name={"기여도 합"} w={65} label={<HeartIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" />} data={total_contribution}/>
						</Div>
					</Div>
					<Div mr10 selfCenter justifyItemsEnd>
					{(!open) && <Div px10></Div>}
					<Transition show={open} enter="transition duration-100" enterFrom="transform rotate-0" enterTo="transform rotate-180" leave="transition duration-75" leaveFrom="transform rotate-180" leaveTo="transform rotate-0" >
						<ChevronUpIcon height={20} width={20} className="text-gray-400" />
					</Transition>
					</Div>
				</Div>
              </Disclosure.Button>
			<DefaultTransition show={open} content={
              <Disclosure.Panel className="bg-white bg-gray-100 border-b-2">
				<UserAddressPanel user_address={user.user_address}/>
				{sorted_list.map((nft, index) => (
					<NftEntry nft={nft} key={index} refetch={refetch}/>
				))}
              </Disclosure.Panel>
			}/>
            </>
          )}
        </Disclosure>

	);
}

function NftEntry({nft, refetch}) {
	const [loaded, setLoaded] = useState(false);
	return (
        <Disclosure as="div" className="w-full">
          {({ open }) => (
            <>
              <Disclosure.Button className="w-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500">
				<Div py12 px16 wFull flex flexRow cursorPointer clx={`${open ? "bg-gray-200 text-gray-500" : ""}`}>
					<Div mr15>
						{!loaded && <Skeleton variant="rectangular" width={75} height={75} />}
						 <Div imgTag maxW={75} maxH={75} src={resizeImageUri(nft.image_uri, 75, 75)} onLoad={()=>setLoaded(true)} style={loaded ? { display: 'block' } : { display: 'none' }}></Div>
					</Div>
					<Div justifyItemsStart wFull flex flexRow>
				
					<Div fontSize20 selfCenter textBlack minW={120} maxW={120} mr25 textLeft fontBold><Div flex flexRow>
						{nft.name ? nft.name : nft.nft_name}
						<Div selfCenter>{nft.main ? <SparklesIcon height={15} width={15} className="max-h-15 max-w-15 ml-10" />:" "}</Div>
							</Div>
						<Div fontSemibold fontSize13>{nft.name ? nft.nft_name : <EmptyBlock h={20} /> }</Div></Div>
						<Div flex flexRow flexWrap>
						<DataEntry name={"게시물"} w={55} label={<PencilAltIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" />} data={nft.posts}/>
						<DataEntry name={"제안"} w={55} label={<LightBulbIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" />} data={nft.proposals}/>
						<DataEntry name={"기여도"} w={65} label={<HeartIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" />} data={nft.contribution}/>
						<DataEntry w={120} label={"Followings : "} data={nft.following_count}/>
						<DataEntry w={120} label={"Followers : "} data={nft.follower_count}/>
						</Div>
					</Div>
					<Div mr10 selfCenter justifyItemsEnd>
					{open ? <ChevronDownIcon height={20} width={20} className="text-gray-500" /> : <AdjustmentsIcon height={20} width={20} className="text-gray-400"/>}
					</Div>
				</Div>
              </Disclosure.Button>
			  <DefaultTransition show={open} content={
              <Disclosure.Panel className="bg-gray-200 text-gray-700 border-b-2 border-gray-300 py-16 px-12">
			  <NftDetails nft={nft} refetch={refetch}/>
				</Disclosure.Panel>
			  }/>
            </>
          )}
        </Disclosure>
	);
}

function NftDetails({nft, refetch}) {
	const { currentNft } = useSelector((state: RootState) => ({
		currentNft: state.admin.currentNft.currentNft
	}));
	const LockAdminToggle = (currentNft?.contract_address==nft?.contract_address) && (currentNft?.token_id == nft?.token_id)
	const [privilege, privilegeHasChanged, handleChangeprivilege] = useEdittableToggle(nft.privilege, LockAdminToggle)
	const {
		name,
		nameHasChanged,
		nameError,
		handleChangeName,
	  } = useName(nft.name ? nft.name: "");
	  const {
		story,
		storyHasChanged,
		storyError,
		handleChangeStory,
	  } = useStory(nft.story ? nft.story: "");
	const isSave = (nameHasChanged && !nameError) || (storyHasChanged && !storyError) || privilegeHasChanged
	const {isLoading, mutate} = patchUserInfo(nft, refetch, {
		story: storyHasChanged? story : null,
		name: nameHasChanged ? name : null,
		privilege: privilegeHasChanged ? privilege : null
	})
	const dispatch = useDispatch();
	const handleGetPosts = () => {
		dispatch(UserPosttModalAction({ enabled: true, contract_address: nft?.contract_address, token_id: nft?. token_id}));
	};
	return (
		<>
		<UserPostModal name={nft?.name ? nft?.name : nft.nft_name} user_address={nft?.user_address} contract_address={nft?.contract_address} token_id={nft?.token_id} refetch_userlist={refetch} />
		<Div wFull flex flexRow>
		<Div justifyItemsStart wFull flex flexRow flexWrap>
			<DataEntry w={220} label={<Div selfCenter mb20>이름</Div>} data={
				<Div>
				<input
				placeholder="이름"
				value={name}
				className={"px-5 ml-10 self-center w-full focus:outline-none focus:border-gray-400 bg-white rounded-lg"}
				style={{ height: 30, boxShadow: "none", border: "none" }}
				onChange={handleChangeName}
				></input>
				{nameError ? <Div ml10 mt3 textDanger fontSize11>{nameError}</Div>:<EmptyBlock h={20} />}
				</Div>
			}/>
			<DataEntry w={220} label={<Div selfCenter mb20 >스토리</Div>} data={
				<Div>
				<input
				placeholder="스토리"
				value={story}
				className={"px-5 ml-10 self-center w-full focus:outline-none focus:border-gray-400 bg-white rounded-lg"}
				style={{ height: 30, boxShadow: "none", border: "none" }}
				onChange={handleChangeStory}
				></input>
				{storyError ? <Div ml10 mt3 textDanger fontSize11>{storyError}</Div> :<EmptyBlock h={20} />}
				</Div>
			}/>
			<DataEntry w={130} label={<Div flex flexRow><CogIcon height={20} width={20} className="max-h-20 max-w-20 mr-10 mb-20" />Admin</Div>} data={<Div><SwitchToggle checked={privilege} onChange={handleChangeprivilege} lock={LockAdminToggle} /><EmptyBlock h={15} /></Div>}/>
			<Div selfCenter mb10 justifyItemsStart flex flexRow ml25 mr25>
				<Div>
				<Div px10 cursorPointer py5 bgGray400 rounded10 clx="hover:bg-gray-600 hover:text-white" onClick={handleGetPosts} > 게시물 관리</Div><EmptyBlock h={20} />
				</Div>
			</Div>

		</Div>
		<Div mr10 selfCenter justifyItemsEnd>
			<DefaultTransition show={isSave} content={
				isLoading? 
				<Div fontBold px10 cursorPointer py5 bgGray600 rounded10>
					<Oval height="14" width="14" color="gray" secondaryColor="#FFFFFF" strokeWidth="5" />
				</Div>
				: 
				<Tooltip title="저장하기" arrow>
				<Div fontBold px10 cursorPointer py5 bgGray400 rounded10 clx="hover:bg-gray-600 hover:text-white" onClick={mutate}>
				<CheckIcon height={20} width={20} className="max-h-20 max-w-20" />
				</Div></Tooltip>
			}/>
			</Div>
		</Div>
		</>
	);
}



//Helper Function

function sort_nfts(list) {
	return (
		list.sort(function(a, b) {
		return b.contribution - a.contribution;
		}).sort(function(a, b) {
			return (b.main ? 1:0) - (a.main ? 1:0);
		})
	);
}

//Design Function 

function DataEntry({name="", w, label, data}) {
	return (
		name=="" ?
 		<Div selfCenter mb10 justifyItemsStart minW={w} maxW={w} flex flexRow ml25 mr25>
		{label}{data}
		</Div>
	:
	<Tooltip title={name} arrow>
	<Div selfCenter mb10 justifyItemsStart minW={w} maxW={w} flex flexRow ml25 mr25>
	{label}{data}
	</Div>
	</Tooltip>
	);
}

function UserAddressPanel({user_address}) {
	let [isCopied, setIsCopied] = useState(false)
	function openCopied() {navigator.clipboard.writeText(user_address);setIsCopied(true);}
	function closeCopied() {setIsCopied(false)}
	return (
		<Div py5 fontSize13 bgGray100 px20 flex flexRow>
		<IdentificationIcon height={20} width={20} className="mr-10 self-center text-gray-600" />
		<Tooltip title="클릭 시 복사" arrow>
		<Div py5 rounded10 px10 cursorPointer bgGray300 onClick={openCopied}>{user_address}</Div></Tooltip>
		<Div selfCenter px10 textInfo fontSemibold ><TimerText condtion={isCopied} text={"User Address가 복사되었습니다."} seconds={2} closecontidion={closeCopied}/></Div>
		</Div>
	);
}

function SwitchToggle({checked, onChange, lock=false}) {
	return (
		<Switch
		checked={checked}
		onChange={onChange}
		className={`${checked ? (lock ? 'cursor-default bg-gray-600': 'cursor-pointer bg-primary') : (lock ? 'cursor-default bg-gray-400' : 'cursor-pointer bg-secondary')}
		relative inline-flex h-[24px] w-[42px] shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 ml-10`}
					>
					<span
						aria-hidden="true"
						className={`${checked ? 'translate-x-18' : 'translate-x-0'}
			pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
		/>
	</Switch>
	);
}

export default UserList;