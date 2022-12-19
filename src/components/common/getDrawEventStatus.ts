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

  const category =
    event.has_application == false
      ? {
          string: "공지",
          color: { bgBlack: true, textWhite: true },
        }
      : {
          string: "이벤트",
          color: { bgBW: true, textWhite: true },
        };

  const status =
    event.has_application == true
      ? event?.status == DrawEventStatus.IN_PROGRESS
        ? {
            string: "진행 중",
            color: { bgGray600: true, textWhite: true, w80: true },
          }
        : event?.status == DrawEventStatus.ANNOUNCED
        ? {
            string: "당첨 발표",
            color: { bgInfo: true, textWhite: true, w80: true },
          }
        : {
            string: "마감",
            color: { bgDanger: true, textWhite: true },
          }
      : null;

  const expires =
    event.has_application == true && event?.status == DrawEventStatus.IN_PROGRESS && event.expires_at && new Date(event.expires_at) < new Date()
      ? {
          string: "마감",
          color: { bgDanger: true, textWhite: true },
        }
      : null;
  return {
    category: category,

    status: expires ? expires : status,

    expires: expires,
  };
}
