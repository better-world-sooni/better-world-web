import apis from "src/modules/apis";
import { queryHelperWithToken, queryHelperInitialPropsWithJwtFromContext, queryHelperMutationWithToken, queryHelperPrefetchWithToken } from "src/hooks/queries/queryHelper";
import querykeys from "src/hooks/queries/querykeys"
import { useCallback } from 'react'
import { QueryClient } from 'react-query';
import { NextPageContext } from "next";

export const defaultPageSize=50

export function getUserListQuery (page_size:Number, offset:Number, onsettled:any) {
    const onSettled = useCallback(onsettled, []);	  
	return queryHelperWithToken({
        key: querykeys.admin.userlist._(page_size, offset),
        url:apis.admin.user.list(page_size, offset), 
        options : {
            refetchOnMount:false,
            refetchInterval:false,
            onSettled
        }
    }
    );
}

export function InitialgetUserListQuery (queryClient:QueryClient, ctx:NextPageContext) {
    return queryHelperInitialPropsWithJwtFromContext({
        key: querykeys.admin.userlist._(defaultPageSize, 0), 
        queryClient: queryClient,
        ctx: ctx,
        url: apis.admin.user.list(defaultPageSize,0)
    }
    );
}

export function prefetchUserListQuery (queryClient:QueryClient, page_size:Number, offset:Number) {
	return queryHelperPrefetchWithToken({
        queryClient:queryClient,
        key: querykeys.admin.userlist._(page_size, offset),
        url:apis.admin.user.list(page_size, offset)
    })
}

export function patchUserInfo (nft, queryClient, {story, name, privilege}) {
    const body = {
        contract_address: nft.contract_address,
        token_id: nft.token_id,
        story: story,
        name: name,
        privilege: privilege}
    return queryHelperMutationWithToken({
        url: apis.admin.user._(),
        method: "PUT",
        body: body,
        options: {
            onSuccess: ()=>queryClient.invalidateQueries(querykeys.admin.userlist._())
        }
    }
    )
}

export function DeletePost (post_id, queryClient:QueryClient, contract_address, token_id) {
    const body = {
        post_id: post_id}
    return queryHelperMutationWithToken({
        url: apis.admin.post._(),
        method: "DELETE",
        body: body,
        options: {
            onSuccess: ()=>queryClient.invalidateQueries(querykeys.admin.userlist._())&&queryClient.invalidateQueries(querykeys.admin.userlist.post(contract_address, token_id))
        }
    }
    )
}

export function DeleteComment (comment_id, queryClient:QueryClient, contract_address, token_id) {
    const body = {
        comment_id: comment_id}
    return queryHelperMutationWithToken({
        url: apis.admin.comment._(),
        method: "DELETE",
        body: body,
        options: {
            onSuccess: ()=>queryClient.invalidateQueries(querykeys.admin.userlist.post(contract_address, token_id))
        }
    }
    )
}

export function getUserPostListQuery (contract_address, token_id, page_size:Number, offset:Number, onsettled:any) {
    const onSettled = useCallback(onsettled, []);
	return queryHelperWithToken({
        key: querykeys.admin.userlist.post(contract_address, token_id, page_size, offset),
        url:apis.admin.post.list(contract_address, token_id, page_size, offset),
        options : {
            onSettled
        }
    }
    );
}