import apis from "src/modules/apis";
import querykeys from "src/hooks/queries/querykeys";
import { useCallback } from "react";
import { QueryClient, useQueries } from "react-query";
import { NextPageContext } from "next";
import { queryHelperInitialPropsWithJwtFromContext, queryHelperMutationWithToken, queryHelperWithToken } from "../queryHelper";

export const defaultPageSize = 50;

export function getDashboardQuery(onsettled: any) {
  return queryHelperWithToken({
    key: querykeys.admin.dashboard._(),
    url: apis.admin.dashboard._(),
    options: {
      refetchOnMount: false,
      refetchInterval: false,
      keepPreviousData: true,
      onSettled: onsettled,
    },
  });
}

export enum DashboardOrderStatus {
  DEFAULT = -1,
  APPLICATION_ASC = 0,
  APPLICATION_DESC = 1,
  VIEW_ASC = 2,
  VIEW_DESC = 3,
  LIKE_ASC = 4,
  LIKE_DESC = 5,
  COMMENT_ASC = 6,
  COMMENT_DESC = 7,
}

export enum DashboardShowType {
  ANNOUNCEMENT = "announcement",
  EVENT = "event",
}

export function getDashboardEventQuery(type = DashboardShowType.ANNOUNCEMENT, order = DashboardOrderStatus.DEFAULT) {
  return queryHelperWithToken({
    key: querykeys.admin.dashboard.events(order, type),
    url: apis.admin.dashboard.events(order, type),
    options: {
      refetchOnMount: false,
      refetchInterval: true,
      keepPreviousData: true,
    },
  });
}

export const cancelEventListQuery = (queryClient: QueryClient) => {
  queryClient.cancelQueries(querykeys.admin.events._());
};

export function InitialgetDashboardQuery(queryClient: QueryClient, ctx: NextPageContext) {
  return queryHelperInitialPropsWithJwtFromContext({
    key: querykeys.admin.dashboard._(),
    queryClient: queryClient,
    ctx: ctx,
    url: apis.admin.dashboard._(),
  });
}

export function InitialgetDashboardEventQuery(queryClient: QueryClient, ctx: NextPageContext) {
  return queryHelperInitialPropsWithJwtFromContext({
    key: querykeys.admin.dashboard.events(DashboardOrderStatus.DEFAULT, DashboardShowType.EVENT),
    url: apis.admin.dashboard.events(DashboardOrderStatus.DEFAULT, DashboardShowType.EVENT),
    queryClient: queryClient,
    ctx: ctx,
  });
}
