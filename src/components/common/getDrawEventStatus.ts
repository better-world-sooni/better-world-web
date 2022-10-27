export enum DrawEventStatus {
  IN_PROGRESS = 0,
  ANNOUNCED = 1,
  FINISHED = 2,
}

export default function getDrawEventStatus(event) {
  if (!event)
    return {
      string: "불러오는중",
      color: { bgWhite: true },
    };
  const drawEventStatus = {
    status:
      event.status == DrawEventStatus.ANNOUNCED
        ? {
            string: "공지",
            color: { bgBlack: true, textWhite: true },
          }
        : {
            string: "이벤트",
            color: { bgBW: true, textWhite: true },
          },
    expires:
      event.status == DrawEventStatus.ANNOUNCED
        ? null
        : event.status == DrawEventStatus.FINISHED || (event.expires_at && new Date(event.expires_at) < new Date())
        ? {
            string: "마감",
            color: { bgDanger: true, textWhite: true },
          }
        : {
            string: "진행 중",
            color: { bgGray600: true, textWhite: true },
          },
  };
  return drawEventStatus;
}
