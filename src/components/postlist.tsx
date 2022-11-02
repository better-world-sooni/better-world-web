import Div from "./Div";
import { useState } from "react";
import {
  RefreshIcon,
  ChevronUpIcon,
  HeartIcon,
  AnnotationIcon,
  ThumbUpIcon,
  ThumbDownIcon,
  TrashIcon,
  LightBulbIcon,
  PencilAltIcon,
  XIcon,
  CheckIcon,
} from "@heroicons/react/outline";
import { Oval } from "react-loader-spinner";
import Tooltip from "@mui/material/Tooltip";
import { Disclosure, Transition } from "@headlessui/react";
import DefaultTransition from "./common/defaulttransition";
import DataEntry, { DataEntryWithoutMargin } from "./common/DataEntry";
import { createdAtText, getDate } from "src/modules/timeHelper";
import { ImageSlide, ProfileImage } from "./common/ImageHelper";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { ModifiledTruncatedMarkdown } from "./common/ModifiedTruncatedMarkdown";
import { MakeCommentModal, MakePostModal } from "./modals/CheckModal";
import remarkGfm from "remark-gfm";

export default function PostList({ post_list, showEntry = false, maxCommentLength = 2, DeletePostAction = null, DeleteCommentAction = null }) {
  const postModal = (comment_id) => MakePostModal(() => DeletePostAction(comment_id));
  const CommentModal = (post_id) => MakeCommentModal(() => DeleteCommentAction(post_id));
  var list = [...post_list.list.posts];
  if (list.length == 0)
    return (
      <Div wFull textCenter textGray400>
        작성한 글이 없습니다.
      </Div>
    );
  return (
    <Div wFull border1>
      {list.map((post, _) => (
        <PostEntry post={post} key={post.id} showEntry={showEntry} maxCommentLength={maxCommentLength} postModal={postModal} CommentModal={CommentModal} />
      ))}
    </Div>
  );
}

function PostEntry({ post, showEntry, maxCommentLength, postModal, CommentModal }) {
  return (
    <Disclosure as="div" className="w-full">
      {({ open }) => (
        <>
          <Disclosure.Button className="w-full text-gray-500 hover:bg-gray-100 hover:text-gray-700">
            <Div py4 px16 wFull flex flexRow cursorPointer clx={`${open ? "bg-gray-100 text-gray-700" : ""}`}>
              <PostType post={post} w={20} labelsize={20} />
              <Div justifyItemsStart selfCenter wFull flex flexRow truncate>
                <Div overflowEllipsis overflowHidden whitespaceNowrap>
                  {post.content}
                </Div>
              </Div>
              <Div selfCenter flex flexCol>
                <Div flex flexRow selfCenter>
                  <ForVotesDataEntry post={post} w={55} labelsize={20} />
                  <AgainstVotesDataEntry post={post} w={55} labelsize={20} />
                  <LikeDataEntry post={post} w={55} labelsize={20} />
                  <CommentsDataEntry post={post} w={55} labelsize={20} />
                  <RepostDataEntry post={post} w={55} labelsize={20} />
                </Div>
                <Div selfEnd mt5 mb3 textRight mr40 fontSize12>
                  <Date updated_at={post.updated_at} />
                </Div>
              </Div>

              <Div mr10 selfCenter justifyItemsEnd>
                {!open && <Div px10></Div>}
                <Transition
                  appear={true}
                  show={open}
                  enter="transition duration-100"
                  enterFrom="transform rotate-0"
                  enterTo="transform rotate-180"
                  leave="transition duration-75"
                  leaveFrom="transform rotate-180"
                  leaveTo="transform rotate-0"
                >
                  <ChevronUpIcon height={20} width={20} className="text-gray-700" />
                </Transition>
              </Div>
            </Div>
          </Disclosure.Button>
          <DefaultTransition
            show={open}
            content={
              <Disclosure.Panel className="bg-white bg-gray-100 border-b-2">
                <Div bgGray100 textGray700>
                  <PostDetails post={post} showEntry={showEntry} maxCommentLength={maxCommentLength} postModal={postModal} CommentModal={CommentModal} />
                </Div>
              </Disclosure.Panel>
            }
          />
        </>
      )}
    </Disclosure>
  );
}
export function PostDetails({ post, showEntry = true, maxCommentLength = 2, postModal, CommentModal }) {
  const { Modal, openModal, isLoading } = postModal(post?.id);
  return (
    <>
      <Modal />
      <Div flex flexCol px10 py10>
        <Div px10 py10 selfStart flex flexRow wFull>
          <Div selfCenter wFull flex flexRow>
            <Div selfCenter mr10>
              <ProfileImage width={30} height={30} nft={post.nft} rounded={true} />
            </Div>
            <Div selfCenter fontBold>
              {post.nft.name ? post.nft.name : post.nft.nft_metadatum.name}
            </Div>
          </Div>
          <PostType post={post} w={70} labelsize={20} details={true} />
          {showEntry && (
            <Div selfCenter flex flexCol>
              <Div selfEnd mr20 textRight fontSize12>
                {getDate(post.updated_at)}
              </Div>
              <Div selfEnd textRight flex flexRow fontSize12>
                <ForVotesDataEntry post={post} w={30} labelsize={15} />
                <AgainstVotesDataEntry post={post} w={30} labelsize={15} />
                <LikeDataEntry post={post} w={30} labelsize={15} />
                <CommentsDataEntry post={post} w={30} labelsize={15} />
                <RepostDataEntry post={post} w={30} labelsize={15} />
              </Div>
            </Div>
          )}
          {!showEntry && (
            <Div selfCenter mr25 textRight minW={150}>
              {getDate(post.updated_at)}
            </Div>
          )}
          <DeleteButton Loading={isLoading} openModal={openModal} />
        </Div>
        <Div px10 selfStart wFull>
          <ContentDetails post={post} maxCommentLength={maxCommentLength} CommentModal={CommentModal} />
        </Div>
      </Div>
    </>
  );
}

function ContentDetails({ post, loadMedia = true, loadComment = true, maxCommentLength = 2, CommentModal = null }) {
  return (
    <Div flex flexCol>
      <Div mt10 selfStart>
        <TruncatedText text={post.content} maxLength={300} />
      </Div>
      {post.reposted_post && (
        <Div wFull selfCenter mt30>
          <RepostDetails repost={post.reposted_post} />
        </Div>
      )}
      {loadMedia && post.image_uris.length > 0 && (
        <Div selfCenter mt30>
          <ImageSlide maxHeight={500} maxWidth={500} uris={post.image_uris} click={true} />
        </Div>
      )}
      {loadMedia && post.video_uri && (
        <Div selfCenter mt30>
          <ImageSlide maxHeight={500} maxWidth={500} uris={[post.video_uri]} click={false} />
        </Div>
      )}
      {loadComment && post.comments_count != 0 && (
        <Div mt30 borderT1 borderGray400 ml50 mr50 px20 py20>
          <TruncatedComment comments={post.comments} maxLength={maxCommentLength} CommentModal={CommentModal} />
        </Div>
      )}
    </Div>
  );
}

function TruncatedText({ text, maxLength }) {
  const [full, setfull] = useState(false);
  return (
    <Div textBase>
      {full ? (
        <Div breakAll>
          <ReactMarkdown remarkPlugins={[remarkGfm]} children={text} />
          <Div onClick={() => setfull(false)} cursorPointer fontBold>
            간략히
          </Div>
        </Div>
      ) : (
        <ModifiledTruncatedMarkdown text={text} maxLength={maxLength} onClickTruncated={() => setfull(true)} />
      )}
    </Div>
  );
}

function TruncatedComment({ comments, maxLength, CommentModal }) {
  const comments_count = comments.length;
  const [full, setfull] = useState(false);
  return (
    <Div flex flexCol>
      {comments.map(
        (comment, index) =>
          (full || (!full && index < maxLength)) && (
            <Div selfStart wFull clx={(full && index != comments_count - 1) || (!full && index != maxLength - 1) ? "mb-10" : ""}>
              <Comment comment={comment} maxLength={maxLength - 1 > 0 ? maxLength - 1 : 0} CommentModal={CommentModal} />
            </Div>
          )
      )}
      {maxLength < comments_count ? (
        full ? (
          <Div cursorPointer fontBold onClick={() => setfull(false)}>
            간략히
          </Div>
        ) : (
          <Div cursorPointer fontBold onClick={() => setfull(true)}>
            ...더보기
          </Div>
        )
      ) : (
        ""
      )}
    </Div>
  );
}

function Comment({ comment, maxLength, CommentModal }) {
  const { Modal, openModal, isLoading } = CommentModal(comment?.id);
  return (
    <>
      <Modal />
      <Div wFull py10 flex flexCol>
        <Div wFull flex flexRow>
          <Div selfCenter flex flexRow w={200}>
            <Div selfCenter mr10>
              <ProfileImage width={30} height={30} nft={comment.nft} rounded={true} />
            </Div>
            <Div selfCenter fontBold>
              {comment.nft.name ? comment.nft.name : comment.nft.nft_metadatum.name}
            </Div>
          </Div>
          <Div selfCenter wFull px10 borderL1 borderGray400>
            <TruncatedText text={comment.content} maxLength={200} />
          </Div>
          <Div selfCenter flex flexCol>
            <Div selfEnd mr20 textRight fontSize12>
              <Date updated_at={comment.updated_at} />
            </Div>
            <Div selfEnd textRight fontSize12>
              <LikeDataEntry post={comment} w={30} labelsize={15} />
            </Div>
          </Div>
          <DeleteButton Loading={isLoading} openModal={openModal} />
        </Div>
        {comment.comments && comment.comments.length != 0 && (
          <Div mt10 wFull flex flexRow>
            <Div w={50} borderR1 borderGray400></Div>
            <Div wFull selfCenter ml20>
              <TruncatedComment comments={comment.comments} maxLength={maxLength} CommentModal={CommentModal} />
            </Div>
          </Div>
        )}
      </Div>
    </>
  );
}

function RepostDetails({ repost }) {
  return (
    <Div rounded10 bgGray200 wFull px10 py10>
      <Div flex flexCol px10 py10>
        <Div px10 py10 selfStart flex flexRow wFull>
          <Div selfCenter wFull flex flexRow>
            <Div selfCenter mr10>
              <ProfileImage width={30} height={30} nft={repost.nft} rounded={true} />
            </Div>
            <Div selfCenter fontBold>
              {repost.nft.name ? repost.nft.name : repost.nft.nft_metadatum.name}
            </Div>
          </Div>
          <Div selfCenter mr10 textRight minW={150}>
            {getDate(repost.updated_at)}
          </Div>
        </Div>
        <Div px10 selfStart wFull>
          <ContentDetails post={repost} loadMedia={false} loadComment={false} />
        </Div>
      </Div>
    </Div>
  );
}

function Date({ updated_at }) {
  return (
    <Tooltip title={getDate(updated_at)} arrow>
      <Div> {createdAtText(updated_at)} </Div>
    </Tooltip>
  );
}

function PostType({ post, w, labelsize, details = false }) {
  return post.type == "Proposal" ? (
    !(post.voting_status == 0 || post.voting_status == 1) ? (
      !details && (
        <DataEntry
          name={"제안"}
          w={w}
          label={<LightBulbIcon height={labelsize} width={labelsize} className="max-h-20 max-w-20" />}
          data={""}
          dataEnabled={false}
        />
      )
    ) : (
      <>
        {post.voting_status == 0 &&
          (details ? (
            <Div py5 px5 bgGray200 rounded fontBold mr20>
              <DataEntryWithoutMargin
                name={""}
                w={w}
                label={<XIcon height={labelsize} width={labelsize} className="max-h-20 max-w-20 text-danger mr-10" />}
                data={"거절됨"}
              />
            </Div>
          ) : (
            <DataEntry
              name={"거절된 제안"}
              w={w}
              label={<LightBulbIcon height={labelsize} width={labelsize} className="max-h-20 max-w-20 text-danger" />}
              data={""}
              dataEnabled={false}
            />
          ))}
        {post.voting_status == 1 &&
          (details ? (
            <Div py5 px5 bgGray200 rounded fontBold mr20>
              <DataEntryWithoutMargin
                name={""}
                w={w}
                label={<CheckIcon height={labelsize} width={labelsize} className="max-h-20 max-w-20 text-success mr-10" />}
                data={"통과됨"}
              />
            </Div>
          ) : (
            <DataEntry
              name={"통과된 제안"}
              w={w}
              label={<LightBulbIcon height={labelsize} width={labelsize} className="max-h-20 max-w-20 text-success" />}
              data={""}
              dataEnabled={false}
            />
          ))}
      </>
    )
  ) : (
    !details && (
      <DataEntry
        name={"게시물"}
        w={w}
        label={<PencilAltIcon height={labelsize} width={labelsize} className="max-h-20 max-w-20" />}
        data={""}
        dataEnabled={false}
      />
    )
  );
}

function ForVotesDataEntry({ post, w, labelsize }) {
  return (
    post.type == "Proposal" && (
      <DataEntry
        name={"찬성 수"}
        w={w}
        label={
          post.for_votes_count > 0 ? (
            <ThumbUpIcon height={labelsize} width={labelsize} className="max-h-20 max-w-20 mr-10 text-success" />
          ) : (
            <ThumbUpIcon height={labelsize} width={labelsize} className="max-h-20 max-w-20 mr-10" />
          )
        }
        data={post.for_votes_count}
      />
    )
  );
}

function AgainstVotesDataEntry({ post, w, labelsize }) {
  return (
    post.type == "Proposal" && (
      <DataEntry
        name={"반대 수"}
        w={w}
        label={
          post.against_votes_count > 0 ? (
            <ThumbDownIcon height={labelsize} width={labelsize} className="max-h-20 max-w-20 mr-10 text-warning" />
          ) : (
            <ThumbDownIcon height={labelsize} width={labelsize} className="max-h-20 max-w-20 mr-10" />
          )
        }
        data={post.against_votes_count}
      />
    )
  );
}

function LikeDataEntry({ post, w, labelsize }) {
  return (
    <DataEntry
      name={"좋아요 수"}
      w={w}
      label={
        post.likes_count > 0 ? (
          <HeartIcon height={labelsize} width={labelsize} className="max-h-20 max-w-20 mr-10 text-danger" />
        ) : (
          <HeartIcon height={labelsize} width={labelsize} className="max-h-20 max-w-20 mr-10" />
        )
      }
      data={post.likes_count}
    />
  );
}

function CommentsDataEntry({ post, w, labelsize }) {
  return (
    <DataEntry
      name={"댓글 수"}
      w={w}
      label={
        post.comments_count > 0 ? (
          <AnnotationIcon height={labelsize} width={labelsize} className="max-h-20 max-w-20 mr-10 text-gray-400" />
        ) : (
          <AnnotationIcon height={labelsize} width={labelsize} className="max-h-20 max-w-20 mr-10" />
        )
      }
      data={post.comments_count}
    />
  );
}

function RepostDataEntry({ post, w, labelsize }) {
  return (
    <DataEntry
      name={"퍼가기 수"}
      w={w}
      label={
        post.repost_count > 0 ? (
          <RefreshIcon height={labelsize} width={labelsize} className="max-h-20 max-w-20 mr-10 text-info" />
        ) : (
          <RefreshIcon height={labelsize} width={labelsize} className="max-h-20 max-w-20 mr-10" />
        )
      }
      data={post.repost_count}
    />
  );
}

function DeleteButton({ Loading, openModal }) {
  return Loading ? (
    <Div selfCenter px10 py5 bgDanger bgOpacity50 rounded10 textWhite>
      {" "}
      <Oval height="14" width="14" color="red" secondaryColor="#FFFFFF" strokeWidth="5" />
    </Div>
  ) : (
    <Div selfCenter px10 py5 bgDanger bgOpacity50 rounded10 textWhite cursorPointer clx="hover:bg-danger" onClick={openModal}>
      {" "}
      <TrashIcon height={20} width={20} className="max-h-20 max-w-20" />
    </Div>
  );
}
