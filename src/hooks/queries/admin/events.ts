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
      enable: false,
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
      enable: false,
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

export function updateEventQuery(queryClient, uploadSuccessCallback = null) {
  const mutation = queryHelperMutationWithToken({
    url: apis.admin.events._(),
    method: "PUT",
    options: {
      onSuccess: () => {
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
    url: apis.admin.events.summery(),
    method: "PUT",
    options: {
      onSuccess: () => queryClient.invalidateQueries(querykeys.admin.events._()),
    },
  });
  return { ...mutation, mutate: (status) => mutation?.mutate(body(status)) };
}

export function setEventApplicationStatus(eventId, queryClient: QueryClient) {
  const body = (eventApplicationId, status) => {
    return {
      event_application_ids: [eventApplicationId],
      status: status,
    };
  };
  const mutation = queryHelperMutationWithToken({
    url: apis.admin.events.eventApplication._(),
    method: "PUT",
    options: {
      onSuccess: () => queryClient.invalidateQueries(querykeys.admin.events.eventApplication(eventId)),
    },
  });
  return { ...mutation, mutate: (eventApplicationId, status) => mutation?.mutate(body(eventApplicationId, status)) };
}

export function setEventApplicationsStatus(eventId, selectedEventApplications, queryClient: QueryClient) {
  const body = (status) => {
    return {
      event_application_ids: selectedEventApplications,
      status: status,
    };
  };
  const mutation = queryHelperMutationWithToken({
    url: apis.admin.events.eventApplication._(),
    method: "PUT",
    options: {
      onSuccess: () => queryClient.invalidateQueries(querykeys.admin.events.eventApplication(eventId)),
    },
  });
  return { ...mutation, mutate: (status) => mutation?.mutate(body(status)) };
}

export function getEventApplications(event_id, page_size: Number, offset: Number, onsettled: any) {
  const onSettled = useCallback(onsettled, []);
  return queryHelperWithToken({
    key: querykeys.admin.events.eventApplication(event_id, page_size, offset),
    url: apis.admin.events.eventApplication.list(page_size, offset, event_id),
    options: {
      keepPreviousData: true,
      onSettled,
    },
  });
}

export const cancelEventApplicationQuery = (queryClient: QueryClient, eventId) => {
  queryClient.cancelQueries(querykeys.admin.events.eventApplication(eventId));
};
