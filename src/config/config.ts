export interface AppConfig {
  apiBaseUrl: string;
  port: number;
  reactAppUrl: string;
  apiFullUrl: string;
  features: {
    darkMode: boolean;
    analytics: boolean;
  };
  paths: {
    birds_path: string;
    users_path: string;
    comments_path: string;
    auth_path: string;
    bird_visual_traits_path: string;
    bird_Sighting_path: string;
    filters_path: string
  };
}
const BIRDS_PATH: string = "/api/birds/";
const AUTH_PATH: string = "/api/auth/";
const COMMENTS_PATH: string = "/api/comments/";
const USERS_PATH: string = "/api/users/";
const BIRD_VISUAL_TRAITS_PATH: string = "/api/bird-visual-traits/";
const BIRD_SIGHTING_PATH: string = "/api/bird-sightings";
const FILTERS_PATH: string = "/api/filters";

export const appConfig: AppConfig = {
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost",
  port: 3000,
  apiFullUrl: process.env.API_BASE_URL || "http://localhost" + ":" + 3000,
  reactAppUrl: process.env.REACT_APP_URL || "http://localhost:5173",
  features: {
    //TODO: IMPLEMENT
    darkMode: true,
    analytics: false,
  },
  paths: {
    birds_path: BIRDS_PATH,
    users_path: USERS_PATH,
    comments_path: COMMENTS_PATH,
    auth_path: AUTH_PATH,
    bird_visual_traits_path: BIRD_VISUAL_TRAITS_PATH,
    bird_Sighting_path:  BIRD_SIGHTING_PATH,
    filters_path: FILTERS_PATH,
  },
};
