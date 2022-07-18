import apis from "src/modules/apis";
import { queryHelperWithToken, queryHelperInitialPropsWithJwtFromContext, queryHelperMutationWithToken } from "src/hooks/queries/queryHelper";
import querykeys from "src/hooks/queries/querykeys"
import { useCallback } from 'react'
import { QueryClient } from 'react-query';
import { NextPageContext } from "next";

export function getUserListQuery (page_size:Number, offset:Number, onsettled:any) {
    const onSettled = useCallback(onsettled, []);	  
	return queryHelperWithToken({
        key: querykeys.admin.userlist(page_size, offset),url:apis.admin.user.list(page_size, offset), 
        options : {
            enabled: false,
            onSettled
        }
    }
    );
}

export function InitialgetUserListQuery (queryClient:QueryClient, ctx:NextPageContext) {
    return queryHelperInitialPropsWithJwtFromContext({
        key: querykeys.admin.userlist(50, 0), 
        queryClient: queryClient,
        ctx: ctx,
        url: apis.admin.user.list(50,0)
    }
    );
}

export function patchUserInfo (nft, refetch, {story, name, privilege}) {
    const body = {contract_address: nft.contract_address, token_id: nft.token_id, story: story, name: name, privilege: privilege}
    return queryHelperMutationWithToken({
        url: apis.admin.user.user_address(nft.user_address),
        method: "PUT",
        body: body,
        options: {
            onSuccess: refetch
        }
    }
    )
}