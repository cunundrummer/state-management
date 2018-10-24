export enum CookieStates {
  START_UP = 'STATE_start_up',
  NEW_INSTANCE = 'STATE_new_instance', // consider for removal
  READY_TO_SET = 'STATE_ready_to_set', // READY_TO_CREATE
  PARTIALLY_SET = 'STATE_partially_set',
  CREATED = 'STATE_created',
  DELETED = 'STATE_deleted'
}

export interface ICookieError {
  error: number;
  reason: CookieStates;
}

export interface ICookieState {
  state: CookieStates;
  reason: string;
  error?: ICookieError;
}

export interface ICookie {
  name?: string;
  value?: string;
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  cookieState: ICookieState;
}
