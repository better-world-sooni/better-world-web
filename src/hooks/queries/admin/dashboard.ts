import apis from "src/modules/apis";
import querykeys from "src/hooks/queries/querykeys";
import { useCallback } from "react";
import { QueryClient } from "react-query";
import { NextPageContext } from "next";
import { queryHelperInitialPropsWithJwtFromContext, queryHelperMutationWithToken, queryHelperWithToken } from "../queryHelper";

export const defaultPageSize = 50;

export function getDashboardQuery(onsettled: any) {
  const onSettled = useCallback(onsettled, []);
  return queryHelperWithToken({
    key: querykeys.admin.dashboard._(),
    url: apis.admin.dashboard._(),
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

export function InitialgetDashboardQuery(queryClient: QueryClient, ctx: NextPageContext) {
  return queryHelperInitialPropsWithJwtFromContext({
    key: querykeys.admin.dashboard._(),
    queryClient: queryClient,
    ctx: ctx,
    url: apis.admin.dashboard._(),
  });
}
