import { useState } from "react";
import { setEventApplicationsStatus } from "./queries/admin/events";

export default function useHandleEventApplications({ eventId, eventApplications, queryClient }) {
  const [selectedEventApplications, setSelectedEventApplications] = useState([]);
  const { isLoading, mutate } = setEventApplicationsStatus(eventId, selectedEventApplications, queryClient);

  const handleAddEventApplication = (eventApplicationId) => {
    setSelectedEventApplications((prev) => [...prev, eventApplicationId]);
  };

  const handleRemoveEventApplication = (eventApplicationId) => {
    const index = selectedEventApplications.findIndex((v) => v == eventApplicationId);
    if (index == -1) return;
    const newSelectedEventApplications = selectedEventApplications.slice(0, index).concat(selectedEventApplications.slice(index + 1));
    setSelectedEventApplications(newSelectedEventApplications);
  };

  const handleToggleEventApplication = (eventApplicationId) => {
    if (isLoading) return;
    if (isSelected(eventApplicationId)) handleRemoveEventApplication(eventApplicationId);
    else handleAddEventApplication(eventApplicationId);
  };

  const isSelected = (eventApplicationId) => (selectedEventApplications.find((v) => v == eventApplicationId) ? true : false);

  const removeSelected = () => {
    setSelectedEventApplications([]);
  };

  const handleToggleAll = () => {
    if (isLoading) return;
    if (selectedEventApplications.length != eventApplications.length) setSelectedEventApplications(eventApplications.map((value) => value?.id));
    else removeSelected();
  };

  const handleSetStatus = (status) => !isLoading && mutate(status);

  const allText = eventApplications && (selectedEventApplications.length != eventApplications.length ? "전체 선택" : "선택 해제");

  const canMutation = selectedEventApplications.length != 0;

  return { eventApplications, handleToggleEventApplication, isSelected, removeSelected, canMutation, handleToggleAll, allText, isLoading, handleSetStatus };
}

export enum EventApplicationStatus {
  APPLIED = 0,
  SELECTED = 1,
  RECEIVED = 2,
}
