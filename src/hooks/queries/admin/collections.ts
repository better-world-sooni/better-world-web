import apis from "src/modules/apis";
import { queryHelperWithToken, queryHelperInitialPropsWithJwtFromContext, queryHelperMutationWithToken } from "src/hooks/queries/queryHelper";
import querykeys from "src/hooks/queries/querykeys";
import { useCallback } from "react";
import { QueryClient } from "react-query";
import { NextPageContext } from "next";

export const defaultPageSize = 50;

export function getCollectionsListQuery(page_size: Number, offset: Number, search_key: String, onsettled) {
  return queryHelperWithToken({
    key: querykeys.admin.collections._(page_size, offset, search_key),
    url: apis.admin.collections.list(page_size, offset, search_key),
    options: {
      refetchOnMount: false,
      refetchInterval: false,
      keepPreviousData: true,
      onSettled: onsettled,
    },
  });
}

export function getNewCollectionQuery(contractAddress, queryClient) {
  return queryHelperWithToken({
    key: querykeys.admin.collections.newCollection(contractAddress),
    url: apis.admin.collections.newCollection(contractAddress),
    options: {
      keepPreviousData: false,
      onSuccess: () => queryClient.invalidateQueries(querykeys.admin.collections._()),
    },
  });
}

export const cancelCollectionsListQuery = (queryClient: QueryClient) => {
  queryClient.cancelQueries(querykeys.admin.collections._());
};

export function InitialgetCollectionsQuery(queryClient: QueryClient, ctx: NextPageContext) {
  return queryHelperInitialPropsWithJwtFromContext({
    key: querykeys.admin.collections._(defaultPageSize, 0, ""),
    queryClient: queryClient,
    ctx: ctx,
    url: apis.admin.collections.list(defaultPageSize, 0, ""),
  });
}

export function patchCollectionInfo(collection, queryClient, onSettled) {
  const body = (bodyParam) => {
    return {
      contract_address: collection.contract_address,
      image_uri_key: bodyParam?.imageUriKey,
      background_image_uri_key: bodyParam?.backgroundImageUriKey,
      name: bodyParam?.name,
      symbol: bodyParam?.symbol,
      about: bodyParam?.story,
    };
  };
  const mutation = queryHelperMutationWithToken({
    url: apis.admin.collections._(),
    method: "PUT",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries(querykeys.admin.collections._());
        onSettled && onSettled();
      },
    },
  });
  return { ...mutation, mutate: (bodyParam) => mutation?.mutate(body(bodyParam)) };
}

export function DeleteCollection(contractAddress, queryClient: QueryClient) {
  const body = {
    contract_address: contractAddress,
  };
  const mutation = queryHelperMutationWithToken({
    url: apis.admin.collections._(),
    method: "DELETE",
    options: {
      onSuccess: () => queryClient.invalidateQueries(querykeys.admin.collections._()),
    },
  });
  return { ...mutation, mutate: () => mutation?.mutate(body) };
}
