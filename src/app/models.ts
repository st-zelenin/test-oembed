export interface ExtendedWindow extends Window {
  fbAsyncInit: Function;
  APP_ID: string;
  FB_TOKEN: string;
}

export interface Brand {
  name: string;
  url: string;
}

export interface OEmbedParams {
  url: string;
  omitscript: boolean;
  adapt_container_width: boolean;
  maxheight?: number;
  maxwidth?: number;
  access_token?: string;
}

export interface OEmbedResponse {
  error?: { message: string; };

  height: number;
  width: number;
  html: string;
}
