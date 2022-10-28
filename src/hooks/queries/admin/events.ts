import apis from "src/modules/apis";
import querykeys from "src/hooks/queries/querykeys";
import { useCallback } from "react";
import { QueryClient } from "react-query";
import { NextPageContext } from "next";
import { queryHelperInitialPropsWithJwtFromContext, queryHelperWithToken } from "../queryHelper";

export const defaultPageSize = 50;

export function getEventListQuery(page_size: Number, offset: Number, search_key: String, onsettled: any) {
  const onSettled = useCallback(onsettled, []);
  return queryHelperWithToken({
    key: querykeys.admin.events._(page_size, offset, search_key),
    url: apis.admin.events.list(page_size, offset, search_key),
    options: {
      refetchOnMount: false,
      refetchInterval: false,
      keepPreviousData: true,
      onSettled,
    },
  });
}

export const cancelEventListQuery = (queryClient: QueryClient) => {
  queryClient.cancelQueries(querykeys.admin.events._());
};

export function InitialgetEventsQuery(queryClient: QueryClient, ctx: NextPageContext) {
  return queryHelperInitialPropsWithJwtFromContext({
    key: querykeys.admin.events._(defaultPageSize, 0, ""),
    queryClient: queryClient,
    ctx: ctx,
    url: apis.admin.events.list(defaultPageSize, 0, ""),
  });
}

export function getAllCollectionsQuery() {
  return queryHelperWithToken({
    key: querykeys.admin.collections.list(),
    url: apis.admin.collections.all(),
    options: {
      refetchOnMount: true,
      refetchInterval: true,
      keepPreviousData: true,
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  });
}

export function InitialgetAllCollectionsQuery(queryClient: QueryClient, ctx: NextPageContext) {
  return queryHelperInitialPropsWithJwtFromContext({
    key: querykeys.admin.collections.list(),
    queryClient: queryClient,
    ctx: ctx,
    url: apis.admin.collections.all(),
    options: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  });
}
