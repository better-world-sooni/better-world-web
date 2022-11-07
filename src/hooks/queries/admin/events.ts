import apis from "src/modules/apis";
import querykeys from "src/hooks/queries/querykeys";
import { useCallback } from "react";
import { QueryClient } from "react-query";
import { NextPageContext } from "next";
import { queryHelperInitialPropsWithJwtFromContext, queryHelperMutationWithToken, queryHelperWithToken } from "../queryHelper";

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

export function uploadDrawEventQuery(queryClient, uploadSuccessCallback = null) {
  const mutation = queryHelperMutationWithToken({
    url: apis.admin.events._(),
    method: "POST",
    options: {
      onSettled: () => {
        queryClient.invalidateQueries(querykeys.admin.events._());
        uploadSuccessCallback && uploadSuccessCallback();
      },
    },
  });
  return { ...mutation, mutate: (body) => mutation?.mutate(body) };
}

export function DeleteEvent(event_id, queryClient: QueryClient) {
  const body = {
    event_id: event_id,
  };
  const mutation = queryHelperMutationWithToken({
    url: apis.admin.events._(),
    method: "DELETE",
    options: {
      onSuccess: () => queryClient.invalidateQueries(querykeys.admin.events._()),
    },
  });
  return { ...mutation, mutate: () => mutation?.mutate(body) };
}

export function setStatus(eventId, createdAt, queryClient: QueryClient) {
  const body = (status) => {
    return {
      event_id: eventId,
      status: status,
      created_at: createdAt,
    };
  };
  const mutation = queryHelperMutationWithToken({
    url: apis.admin.events._(),
    method: "PUT",
    options: {
      onSuccess: () => queryClient.invalidateQueries(querykeys.admin.events._()),
    },
  });
  return { ...mutation, mutate: (status) => mutation?.mutate(body(status)) };
}
