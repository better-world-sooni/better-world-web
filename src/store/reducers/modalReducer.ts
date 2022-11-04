const initialState = {
  signIn: {
    enabled: false,
  },
  emailVerification: {
    enabled: false,
  },
  klipQR: {
    enabled: false,
    qrImage: null,
    requestKey: null,
  },
  confetti: {
    enabled: false,
  },
  switchAvatarModal: {
    enabled: false,
    currentNft: null,
    currentUser: null,
  },
  loginQRModal: {
    enabled: false,
  },
  UserPostModal: {
    enabled: false,
    contract_address: null,
    token_id: null,
  },
  newEventModal: {
    enabled: false,
  },
  eventApplicationModal: {
    enabled: false,
  },
};

// action type
export const CONFETTI = "modal/LOGIN" as const;
export const SIGN_IN = "modal/SIGNIN" as const;
export const EMAIL_VERIFICATION = "modal/EMAIL_VERIFICATION" as const;
export const KLIP_QR_ACTION = "modal/KLIP_QR_ACTION" as const;
export const SWITCH_ACCOUNT_MODAL = "modal/SWITCH_ACCOUNT_MODAL" as const;
export const LOGIN_QR_MODAL = "modal/LOGIN_QR_MODAL" as const;
export const USERPOST_MODAL = "modal/USERPOST_MODAL" as const;
export const NEWEVENT_MODAL = "modal/NEWEVENT_MODAL" as const;
export const EVENT_APPLICATION_MODAL = "modal/EVENT_APPLICATION_MODAL" as const;

// action function
export const confettiAction = ({ enabled }) => ({ type: CONFETTI, enabled });
export const signInAction = ({ enabled }) => ({ type: SIGN_IN, enabled });
export const emailVerificationAction = ({ enabled }) => ({ type: EMAIL_VERIFICATION, enabled });
export const klipQRAction = ({ enabled, qrImage, requestKey }) => ({ type: KLIP_QR_ACTION, enabled, qrImage, requestKey });
export const loginQRModalAction = ({ enabled }) => ({ type: LOGIN_QR_MODAL, enabled });
export const switchAccountModalAction = ({ enabled, currentNft, currentUser }) => ({ type: SWITCH_ACCOUNT_MODAL, enabled, currentNft, currentUser });
export const UserPosttModalAction = ({ enabled, contract_address, token_id }) => ({ type: USERPOST_MODAL, enabled, contract_address, token_id });
export const newEventModalAction = ({ enabled }) => ({ type: NEWEVENT_MODAL, enabled });
export const eventApplicationModalAction = ({ enabled }) => ({ type: EVENT_APPLICATION_MODAL, enabled });

const f = (action, func) => func(action);

export const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONFETTI:
      return f(action, ({ enabled }) => {
        return {
          ...state,
          confetti: {
            enabled,
          },
        };
      });
    case SIGN_IN:
      return f(action, ({ enabled }) => {
        return {
          ...state,
          signIn: {
            enabled,
          },
        };
      });
    case EMAIL_VERIFICATION:
      return f(action, ({ enabled }) => {
        return {
          ...state,
          emailVerification: {
            enabled,
          },
        };
      });
    case KLIP_QR_ACTION:
      return f(action, ({ enabled, qrImage, requestKey }) => {
        return {
          ...state,
          klipQR: {
            enabled,
            qrImage,
            requestKey,
          },
        };
      });
    case SWITCH_ACCOUNT_MODAL:
      return f(action, ({ enabled, currentNft, currentUser }) => {
        return {
          ...state,
          switchAvatarModal: {
            enabled,
            currentNft,
            currentUser,
          },
        };
      });
    case LOGIN_QR_MODAL:
      return f(action, ({ enabled }) => {
        return {
          ...state,
          loginQRModal: {
            enabled,
          },
        };
      });
    case USERPOST_MODAL:
      return f(action, ({ enabled, contract_address, token_id }) => {
        return {
          ...state,
          UserPostModal: {
            enabled,
            contract_address,
            token_id,
          },
        };
      });
    case NEWEVENT_MODAL:
      return f(action, ({ enabled }) => {
        return {
          ...state,
          newEventModal: {
            enabled,
          },
        };
      });
    case EVENT_APPLICATION_MODAL:
      return f(action, ({ enabled }) => {
        return {
          ...state,
          eventApplicationModal: {
            enabled,
          },
        };
      });
    default: {
      return state;
    }
  }
};
