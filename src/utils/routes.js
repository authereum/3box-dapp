import {
  store
} from '../state/store';

export const LANDING = '/';
export const PRIVACY = '/privacy';
export const TERMS = '/terms';
export const TEAM = '/team';
export const JOBS = '/jobs';
export const LOGIN = '/login';
export const HUB = '/hub';
export const API = '/products';
export const PARTNERS = '/partners';
export const CAREERS = '/careers';
export const API_PROFILES = '/products/profiles';
export const API_MESSAGING = '/products/messaging';
export const API_STORAGE = '/products/storage';

// PROFILE ROUTES
export const ACTIVITY = 'activity';
export const DATA = 'data';
export const DETAILS = 'details';
export const EDIT = 'edit';
export const COLLECTIBLES = 'collectibles';
export const FOLLOWING = 'following';
export const WALL = 'wall';

// FORMAT STRUCTURE FOR REACT ROUTER
export const FORMAT_PROFILE_ACTIVITY = `/:ethAddress/${ACTIVITY}`;
export const FORMAT_PROFILE_ABOUT = `/:ethAddress/${DETAILS}`;
export const FORMAT_PROFILE_DATA = `/:ethAddress/${DATA}`;
export const FORMAT_PROFILE_COLLECTIBLES = `/:ethAddress/${COLLECTIBLES}`;
export const FORMAT_PROFILE_EDIT = `/:ethAddress/${EDIT}`;
export const FORMAT_PROFILE_CONTACTS = `/:ethAddress/${FOLLOWING}`;
export const FORMAT_PROFILE_WALL = `/:ethAddress/${WALL}`;

export const directToHome = () => {
  const {
    isWallDisabled,
  } = store.getState().myData;

  const route = isWallDisabled ? ACTIVITY : WALL;

  return route;
};