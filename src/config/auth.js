
export const QZ_COGNITO_IDENTITY_KEY = 'qz.auth.cognito.identity';
export const AUTH_METHOD = 'auth2';
export const GOOGLE_ID = '166981643559-r54fbu1evv6cpfpphqjtlo4j950vdmvn.apps.googleusercontent.com';
export const GOOGLE_GEO_API_KEY = 'AIzaSyATIXiytQDXMl_QyQWWD4t5L7JNgh6Eq_c';
export const GOOGLE_CAPTCHA_SITE_KEY = '6LfqfK4UAAAAAFm_WbwR2ZR46afREdp-IV1Ne49l';
export const GOOGLE_CAPTCHA_SECRET = '6LfqfK4UAAAAALouP8hiG-PFTVW7HAUCjBPSRmgM';
export const PROVIDER = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  QUEZONE: 'quezone',
};
// export const FB_APP_ID = '243175483037775';
export const FB_APP_ID = '1926793524088541';
export const FB_API_VERSION = 'v3.3';

export const AWS_CONFIG = {
  Auth: {
    // REQUIRED - Amazon Cognito Identity Pool ID
    identityPoolId: 'ap-southeast-2:adab2657-684c-4222-a17a-9a82b6a5ee84',
    // REQUIRED - Amazon Cognito Region
    region: 'ap-southeast-2',
    identityPoolRegion: 'ap-southeast-2',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'ap-southeast-2_0sAegznUX',
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '3ov1blo2eji4acnqfcv88tcidn',
    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: true,
  },
};
