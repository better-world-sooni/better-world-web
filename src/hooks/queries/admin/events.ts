import apis from "src/modules/apis";
import querykeys from "src/hooks/queries/querykeys";
import { useCallback } from "react";
import { QueryClient } from "react-query";
import { NextPageContext } from "next";
import { queryHelperInitialPropsWithJwtFromContext, queryHelperMutationWithToken, queryHelperWithToken } from "../queryHelper";

export const defaultPageSize = 50;

export enum EventBannerAction {
  UP = "up",
  DOWN = "down",
}

export function getEventListQuery(page_size: Number, offset: Number, search_key: String, onsettled: any) {
  return queryHelperWithToken({
    key: querykeys.admin.events._(page_size, offset, search_key),
    url: apis.admin.events.list(page_size, offset, search_key),
    options: {
      refetchOnMount: false,
      refetchInterval: false,
      keepPreviousData: true,
      onSettled: onsettled,
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
  return queryHelperWithToken({
    key: querykeys.admin.events.eventApplication(event_id, page_size, offset),
    url: apis.admin.events.eventApplication.list(page_size, offset, event_id),
    options: {
      keepPreviousData: true,
      onSettled: onsettled,
    },
  });
}

export const cancelEventApplicationQuery = (queryClient: QueryClient, eventId) => {
  queryClient.cancelQueries(querykeys.admin.events.eventApplication(eventId));
};

export function getEventBanners(onsettled) {
  return queryHelperWithToken({
    key: querykeys.admin.events.banner(),
    url: apis.admin.eventBanner._(),
    options: {
      keepPreviousData: true,
      onSettled: onsettled,
    },
  });
}

export function uploadEventBanner(queryClient, uploadSuccessCallback = null, method = "POST") {
  const mutation = queryHelperMutationWithToken({
    url: apis.admin.eventBanner._(),
    method: method,
    options: {
      onSettled: () => {
        queryClient.invalidateQueries(querykeys.admin.events.banner());
        uploadSuccessCallback && uploadSuccessCallback();
      },
    },
  });
  return { ...mutation, mutate: (body) => mutation?.mutate(body) };
}

export function DeleteEventBanner(eventBannerId, queryClient: QueryClient) {
  const body = {
    event_banner_id: eventBannerId,
  };
  const mutation = queryHelperMutationWithToken({
    url: apis.admin.eventBanner._(),
    method: "DELETE",
    options: {
      onSuccess: () => queryClient.invalidateQueries(querykeys.admin.events.banner()),
    },
  });
  return { ...mutation, mutate: () => mutation?.mutate(body) };
}

export function actionEventBanner(eventBannerId, queryClient: QueryClient) {
  const body = (action) => {
    return {
      event_banner_id: eventBannerId,
      action: action,
    };
  };
  const mutation = queryHelperMutationWithToken({
    url: apis.admin.eventBanner.order(),
    method: "PUT",
    options: {
      onSuccess: () => queryClient.invalidateQueries(querykeys.admin.events.banner()),
    },
  });
  return { ...mutation, mutate: (action) => mutation?.mutate(body(action)) };
}
