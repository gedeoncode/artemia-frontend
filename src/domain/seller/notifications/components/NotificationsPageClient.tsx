"use client";

import React from "react";
import { NotificationList, NotificationsHeader } from ".";
import { useNotifications } from "../hooks/useNotifications";
import { PageSection } from "@/components/PageSection";
import { NotificationSkeleton } from ".";

interface Props {
  userId: string;
}

export default function NotificationsPageClient({ userId }: Props) {
  const {
    notifications,
    filteredNotifications,
    pagination,
    isLoading,
    isFetching,
    filter,
    setFilter,
    error,
    refetch,
    markOne,
    markOneLoading,
    markAll,
    markAllLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useNotifications(userId);
  if (isLoading) return <NotificationSkeleton />;
  return (
    <PageSection className="">
      <NotificationsHeader
        totalCount={pagination.totalCount}
        unreadCount={pagination.unreadCount}
        onRefresh={refetch}
        onMarkAll={markAll}
        isFetching={isFetching}
        isMarkAllLoading={markAllLoading}
      />

      <NotificationList
        notifications={notifications}
        filteredNotifications={filteredNotifications}
        loading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        markOne={markOne}
        markOneLoading={markOneLoading}
        refetch={refetch}
        activeActionId={null}
        filter={filter}
        setFilter={setFilter}
        userId={userId}
        pagination={pagination}
        error={error}
      />
    </PageSection>
  );
}
