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
import { RefreshIcon, ChevronUpIcon, HeartIcon, AnnotationIcon, ThumbUpIcon, ThumbDownIcon, TrashIcon } from "@heroicons/react/outline";
import { Oval } from "react-loader-spinner";
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import { defaultPageSize } from "src/hooks/queries/admin/userlist"
import { Disclosure, Transition } from "@headlessui/react";
import DefaultTransition from "../common/defaulttransition";
import DataEntry, { DataEntryWithoutMargin } from "../common/DataEntry";
import { createdAtText, getDate } from "src/modules/timeHelper";
import {ImageSlide, ProfileImage } from "../common/ImageHelper";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import ModifiledTruncatedMarkdown from "../common/ModifiedTruncatedMarkdown";

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
				<PostEntry post={post} key={post.id}/>
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
				<Div py4 px16 wFull flex flexRow cursorPointer clx={`${open ? "bg-gray-100 text-gray-700" : ""}`}>
					<Div justifyItemsStart selfCenter wFull flex flexRow truncate >
						<Div>{post.content}</Div>
					</Div>
					<Div selfCenter flex flexCol>
					<Div flex flexRow selfCenter>
					{post.type=='Proposal' && <DataEntry name={"찬성 수"} w={55} label={<ThumbUpIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" /> } data={post.for_votes_count}/>}
					{post.type=='Proposal' && <DataEntry name={"반대 수"} w={55} label={<ThumbDownIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" /> } data={post.against_votes_count}/>}
					<DataEntry name={"좋아요 수"} w={55} label={post.likes_count!=0 ? <HeartIcon height={20} width={20} className="max-h-20 max-w-20 mr-10 text-danger" /> : <HeartIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" />} data={post.likes_count}/>
					<DataEntry name={"댓글 수"} w={55} label={post.comments_count!=0 ? <AnnotationIcon height={20} width={20} className="max-h-20 max-w-20 mr-10 text-warning" /> : <AnnotationIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" />} data={post.comments_count}/>
					</Div>
					<Div selfEnd mt5 mb3 textRight mr40 fontSize12><Date updated_at={post.updated_at}/></Div>
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
				<Div bgGray100 textGray700><PostDetails post={post}/></Div>
              </Disclosure.Panel>
			}/>
            </>
          )}
        </Disclosure>

	);
}
function PostDetails({post}) {
	return (
		<Div flex flexCol px10 py10>
			<Div px10 py10 selfStart flex flexRow wFull>
				<Div selfCenter wFull flex flexRow>
					<Div selfCenter mr10>
					<ProfileImage width={30} height={30} uri={post.nft.nft_metadatum.image_uri} rounded={true} />
					</Div>
					<Div selfCenter fontBold>{post.nft.name? post.nft.name: post.nft.nft_metadatum.name}</Div>
				</Div>
				<DataEntry name={"리포스트 수"} w={55} label={<RefreshIcon height={20} width={20} className="max-h-20 max-w-20 mr-10" /> } data={post.repost_count}/>
				<Div selfCenter mr10 textRight minW={150}>{getDate(post.updated_at)}</Div>
				<Div selfCenter px10 py5 bgDanger bgOpacity50 rounded10 textWhite cursorPointer clx="hover:bg-danger"> <TrashIcon height={20} width={20} className="max-h-20 max-w-20" /></Div>
			</Div>
			<Div px10 selfStart wFull> 
				<ContentDetails post={post} />
			</Div>
		</Div>
	);
}

function ContentDetails({post, loadImage=true, loadComment=true}) {
	return (
		<Div flex flexCol>
			<Div mt10 selfStart>
				<TruncatedText text={post.content} maxLength={300}/>
			</Div>
			{post.reposted_post && <Div wFull selfCenter mt30><RepostDetails repost={post.reposted_post}/></Div>}
			{loadImage && (post.image_uris.length > 0) && <Div selfCenter mt30><ImageSlide maxHeight={500} maxWidth={500} uris={post.image_uris} click={false}/></Div>}
			{(loadComment && post.comments_count!=0) &&<Div mt30 borderT1 borderGray400 ml50 mr50 px20 py20><TruncatedComment comments={post.comments} maxLength={2}/></Div>}
		</Div>
	)
}

function TruncatedText({text, maxLength}) {
	const [full, setfull] = useState(false)
	return (
		<Div textBase>
		{full ? (
			<Div>
			<ReactMarkdown children={text}></ReactMarkdown>
			<Div onClick={()=>setfull(false)} cursorPointer fontBold>
			간략히
		</Div></Div>
		) : (
			<ModifiledTruncatedMarkdown text={text} maxLength={maxLength} onClickTruncated={()=>setfull(true)} />
		)}
	</Div>
	);
}

function TruncatedComment({comments, maxLength}) {
	const comments_count = comments.length
	const [full, setfull] = useState(false)
	return (
		<Div flex flexCol>
			{comments.map((comment, index) => (
				(full||(!full && index<maxLength))&&
				<Div selfStart wFull clx={(full&&(index!=comments_count-1))||(!full&&(index!=maxLength-1)) ? "mb-10" : ""}>
					<Comment comment={comment} maxLength={maxLength-1>0? maxLength-1 : 0}/>
				</Div>
			))}
			{ maxLength<comments_count ? full ? <Div cursorPointer fontBold onClick={()=>setfull(false)}>간략히</Div> :  <Div cursorPointer fontBold onClick={()=>setfull(true)}>...더보기</Div> : ""}
		</Div>
	);
}

function Comment({comment, maxLength}) {
	console.log(comment.comments)
	return (
		<Div wFull py10 flex flexCol>
		<Div wFull flex flexRow>
				<Div selfCenter flex flexRow w={200}>
					<Div selfCenter mr10>
					<ProfileImage width={30} height={30} uri={comment.nft.nft_metadatum.image_uri} rounded={true} />
					</Div>
					<Div selfCenter fontBold>{comment.nft.name? comment.nft.name: comment.nft.nft_metadatum.name}</Div>
				</Div>
				<Div selfCenter wFull px10 borderL1 borderGray400>
					<TruncatedText text={comment.content} maxLength={200}/>
				</Div>
				<Div selfCenter flex flexCol>
				<Div selfEnd mr10 textRight fontSize12><Date updated_at={comment.updated_at}/></Div>
				<Div selfEnd textRight>
					<DataEntryWithoutMargin name={"좋아요 수"} w={55} label={comment.likes_count!=0 ? <HeartIcon height={15} width={15} className="max-h-15 max-w-15 mr-10 text-danger" /> : <HeartIcon height={15} width={15} className="max-h-15 max-w-15 mr-10" />} data={<Div fontSize12>{comment.likes_count}</Div>}/>
				</Div>
				</Div>
				<Div selfCenter px10 py5 bgDanger bgOpacity50 rounded10 textWhite cursorPointer clx="hover:bg-danger"> <TrashIcon height={20} width={20} className="max-h-20 max-w-20" /></Div>
		</Div>
		{comment.comments && comment.comments.length!=0 && <Div mt10 wFull flex flexRow>
			<Div w={50} borderR1 borderGray400 ></Div>
			<Div wFull selfCenter ml20>
				<TruncatedComment comments={comment.comments} maxLength={maxLength}/>
			</Div>
		</Div>}
		</Div>
	);
}

function RepostDetails({repost}) {
	return (
		<Div rounded10 bgGray200 wFull px10 py10>
			<Div flex flexCol px10 py10>
				<Div px10 py10 selfStart flex flexRow wFull>
					<Div selfCenter wFull flex flexRow>
						<Div selfCenter mr10>
						<ProfileImage width={30} height={30} uri={repost.nft.nft_metadatum.image_uri} rounded={true} />
						</Div>
						<Div selfCenter fontBold>{repost.nft.name? repost.nft.name: repost.nft.nft_metadatum.name}</Div>
					</Div>
					<Div selfCenter mr10 textRight minW={150}>{getDate(repost.updated_at)}</Div>
				</Div>
				<Div px10 selfStart wFull> 
					<ContentDetails post={repost} loadImage={false} loadComment={false}/>
				</Div>
			</Div>
		</Div>
	);
}

function Date({updated_at}) {
	return (
		<Tooltip title={getDate(updated_at)} arrow>
		<Div> {createdAtText(updated_at)} </Div>
		</Tooltip>
	)
}