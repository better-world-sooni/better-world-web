import apis from "src/modules/apis";
import { queryHelperWithToken, queryHelperInitialPropsWithJwtFromContext, queryHelperMutationWithToken } from "src/hooks/queries/queryHelper";
import querykeys from "src/hooks/queries/querykeys";
import { useCallback } from "react";
import { QueryClient } from "react-query";
import { NextPageContext } from "next";

export const defaultPageSize = 50;

export function getUserListQuery(page_size: Number, offset: Number, search_key: String, onsettled: any) {
  const onSettled = useCallback(onsettled, []);
  return queryHelperWithToken({
    key: querykeys.admin.userlist._(page_size, offset, search_key),
    url: apis.admin.user.list(page_size, offset, search_key),
    options: {
      refetchOnMount: false,
      refetchInterval: false,
      keepPreviousData: true,
      onSettled,
    },
  });
}

export const cancelUserListQuery = (queryClient: QueryClient) => {
  queryClient.cancelQueries(querykeys.admin.userlist._());
};

export function InitialgetUserListQuery(queryClient: QueryClient, ctx: NextPageContext) {
  return queryHelperInitialPropsWithJwtFromContext({
    key: querykeys.admin.userlist._(defaultPageSize, 0, ""),
    queryClient: queryClient,
    ctx: ctx,
    url: apis.admin.user.list(defaultPageSize, 0, ""),
  });
}

export function patchUserInfo(nft, queryClient, { story, name, privilege }) {
  const body = {
    contract_address: nft.contract_address,
    token_id: nft.token_id,
    story: story,
    name: name,
    privilege: privilege,
  };
  const mutation = queryHelperMutationWithToken({
    url: apis.admin.user._(),
    method: "PUT",
    options: {
      onSuccess: () => queryClient.invalidateQueries(querykeys.admin.userlist._()),
    },
  });
  return { ...mutation, mutate: () => mutation?.mutate(body) };
}

export function DeletePost(post_id, queryClient: QueryClient, contract_address, token_id) {
  const body = {
    post_id: post_id,
  };
  const mutation = queryHelperMutationWithToken({
    url: apis.admin.post._(),
    method: "DELETE",
    options: {
      onSuccess: () =>
        queryClient.invalidateQueries(querykeys.admin.userlist._()) && queryClient.invalidateQueries(querykeys.admin.userlist.post(contract_address, token_id)),
    },
  });
  return { ...mutation, mutate: () => mutation?.mutate(body) };
}

export function setSuperPrivilege(address, superPrivilege, queryClient: QueryClient) {
  const body = {
    address: address,
    super_privilege: superPrivilege,
  };
  const mutation = queryHelperMutationWithToken({
    url: apis.admin.user.setPrivilege(address, superPrivilege),
    method: "PUT",
    options: {
      onSuccess: () => queryClient.invalidateQueries(querykeys.admin.userlist._()),
    },
  });
  return { ...mutation, mutate: () => mutation?.mutate(body) };
}

export function DeleteComment(comment_id, queryClient: QueryClient, contract_address, token_id) {
  const body = {
    comment_id: comment_id,
  };
  const mutation = queryHelperMutationWithToken({
    url: apis.admin.comment._(),
    method: "DELETE",
    options: {
      onSuccess: () => queryClient.invalidateQueries(querykeys.admin.userlist.post(contract_address, token_id)),
    },
  });
  return { ...mutation, mutate: () => mutation?.mutate(body) };
}

export function getUserPostListQuery(contract_address, token_id, page_size: Number, offset: Number, search_key: String, onsettled: any) {
  const onSettled = useCallback(onsettled, []);
  return queryHelperWithToken({
    key: querykeys.admin.userlist.post(contract_address, token_id, page_size, offset, search_key),
    url: apis.admin.post.list(contract_address, token_id, page_size, offset, search_key),
    options: {
      keepPreviousData: true,
      onSettled,
    },
  });
}

export const cancelUserPostListQuery = (queryClient: QueryClient, contract_address, token_id) => {
  queryClient.cancelQueries(querykeys.admin.userlist.post(contract_address, token_id));
};
