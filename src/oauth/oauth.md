# OAuth

<svg class="icon" viewBox="0 0 100 100" width="100" height="100" style="fill:black">
  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-nav-oauth"></use>
</svg>

SumUp uses [OAuth](http://oauth.net/) to provide standard way for authorized access to its APIs.

The authorization API is based on the abstract protocol flow as defined by [OAuth 2.0 specification](http://tools.ietf.org/html/rfc6749). 

## Group Authorization Model

### Supported flows
The API enables applications to use the following concrete flows
+ Authorization Code Grant
+ Implicit Grant
+ Resource Owner Password Credentials Grant
+ Client Credentials Grant

### Supported content types
In addition to the standard protocol content type (application/x-www-form-urlencoded) the API supports also __application/json__.

### Headers
__Client credentials__ can be passed as a header (according to the specification) or in the request body.

### Endpoints
HOST: api.sumup.com
+ Authorization endpoint - ```/authorize```
+ Token endpoint - ```/token```

### SumUp supported scopes

The possible scopes that might be requested and granted by SumUp authorization server upon receiving user consent are grouped as follows:

Default scopes:
+ payments - Make payments
+ user.app-settings - Access and manage mobile application settings
+ transactions.history - Access users' transaction history
+ user.profile_readonly - Access users' profile information

Note Default scopes are requested when no `scope` value is defined.

Optional scopes:
+ user.profile - Access and edit users' profile information
+ user.subaccounts - Access and manage users' employees
+ user.payout-settings - Access and edit user' payout settings
+ balance - Access and manage users' balance
+ products - Access and manage users' products, shelves, prices, vat rates

Optional scopes must be requested specifically.

Restricted Scopes:
+ payment_instruments – Generate payment card tokens and process recurring payments 

Restricted scopes must be enabled by SumUp before being requested. Please contact <integration@sumup.com>

## Group OAuth setup

You can make or change your OAuth setup in the [Developers section](https://me.sumup.com/developers) of the SumUp Dashboard.

### Consent screen

The consent screen will be shown to users whenever you request access to their private data using your client ID. It will be shown for all your registered applications. In order to make your application recognizable you need to provide information for

* __Product name__ (Required) -The name of your service or application that helps users recognize it
* __Home page URL__ (Optional) - Link to your home page
* __Logo URL__ (Optional) - Your logo that will be shown to the user
* __Terms of service URL__ (Optional) - Your T&Cs page
* __Privacy policy URL__ (Optional) - Your privacy policy page


### Client credentials

Once you set your consent screen details you can create one or more client credentials. The information that you need to enter includes

+ __Client type__ - You can choose between WEB, ANDROID, IOS, OTHER
+ __Client name__ - Your application name as you recognize it. Example: "my awesome application"
+ __Authorized redirect uri__ - This is the path in your application that users are redirected to after they have authenticated with SumUp. It must contain protocol or custom URL scheme
+ __Authorized javascript origin__ - For use with requests from a browser - for example complete a checkout. This is the origin URI of the client application. It can't contain a wildcard (http://*.example.com) or a path (http://example.com/subdir). If you're using a nonstandard port, you must include it in the origin URI. 

Once you create a client credentials you can download the details in a JSON file that includes client id and secret to use for authorization.  Example:

```
{
    "name": "my awesome app",
    "client_id": "rncpQJkHsQxxJ3_yD5UXKTquUXwH", 
    "client_secret": "3d97e3a57f7826516e1431d10cdf4bf0b674461635e5b580f6b5eb8ec3c94654",
    "application_type": "web",
    "auth_uri":"https://api.sumup.com/authorize",
    "token_uri":"https://api.sumup.com/token",
    "redirect_uris":["https://mysite.com/oauth2callback",],
    "cors_uris":["https://mysite.com"]
}
```

Note that `client_secret` and `cors_uris` are applicable only for client type WEB

## Example Authorization Flows

### Authorization Code Grant

In the authorization grant flow the merchant authorises your application once, for a specific set of scopes.

The authorization code grant is recommended when the following criteria are met: 

* You intend to perform actions on behalf of the merchant (e.g. logging into the SDK, refunding via the API)
* User credentials are not known by you (the client)
* Your application (User agent) is capable of handling a redirect request (e.g. a browser)

After completing the [OAuth setup](#Group_OAuth_setup) direct the merchant to the authorisation URI:
```
{
   	https://api.sumup.com/authorize?
    scope=REQUESTED_SCOPES&
    response_type=code&
    client_id=YOUR_CLIENT_ID&
    client_secret=YOUR_CLIENT_SECRET&
    redirect_uri=YOUR_REDIRECT_URI&
    state=YOUR_KNOWN_STATE
}
```

* `client_id`- Generated during [setup](#Group_OAuth_setup)
* `client_secret` - Web apps only, generated during [setup](#Group_OAuth_setup)
* `redirect_uri`- Defined during [setup](#Group_OAuth_setup)
* `scope` (Optional) - URL encoded, space delimited list, see [supported scopes](SumUp_supported_scopes)
* `response_type` -  `code` for authorization code
* `state` - (Optional) - Known only to you, used to prevent [CSRF](https://tools.ietf.org/html/rfc6749#section-10.12)

After the merchant has authenticated with SumUp and authorised the application for the requested scopes, they will be directed your redirect URI:
```
{
	https://YOUR_REDIRECT_URI?
	code=AUTHORIZATION_CODE&
	STATE=YOUR_KNOWN_STATE
}
```

*  `code` - authorization_code

The authorization code is then used to request an access and refresh token using the `\token` endpoint:
```
{
curl https://api.sumup.com/token \
-d "grant_type=authorization_code" \
   "client_id=YOUR_CLIENT_ID" \
   "client_secret=YOUR_CLIENT_SECRET" \
   "redirect_uri=YOUR_REDIRECT_URI" \
   "code=AUTHORIZATION_CODE" \
}
```
* `grant_type`- `authorization_code`

If the request is successful, an access token will be returned in the response:

```
{
"access_token":"22584b8b8960fc8266db0637d5c166b90b1283081deee2dec8bf7d2dce3b0289",
"token_type":"Bearer",
"expires_in":3600,
"refresh_token":"6a88a1c877c36735581019f5326286a5f7bc3358a283d81c1e05f642ea5361f5"
}
```
*  `access_token` - Used to access SumUp services
*  `token_type` - `Bearer` by default
*  `expires_in` - Time in seconds
*  `refresh_token` - Used to [refresh](#Refresh_Tokens) an access token

### Client Credentials Grant

The client credentials grant is used for direct communication between your platform and SumUp where no merchant authorization is required (e.g. tokenizing a customers card)

After completing the [OAuth setup](#Group_OAuth_setup) request an access token:
```
{
curl https://api.sumup.com/token \
-d "grant_type=client_credentials" \
   "client_id=YOUR_CLIENT_ID" \
   "client_secret=YOUR_CLIENT_SECRET" \
   "scope=REQUESTED_SCOPES" \
}
```
* `grant_type`- `client_credentials`
* `client_id`- Generated during [setup](#Group_OAuth_setup)
* `client_secret` - Web apps only, generated during [setup](#Group_OAuth_setup)
* `scope` Optional - List of comma separated values, see [supported scopes](SumUp_supported_scopes)

If the request is successful, an access token will be returned in the response:
```
{
"access_token":"ACCESS_TOKEN",
"token_type":"Bearer",
"expires_in":3600
"scope":"REQUEST_SCOPES"
}
```
*  `access_token` - Used to access SumUp services
*  `token_type` - `Bearer` by default
*  `expires_in` - time in seconds
* No refresh token is returned, as the client can request a new access token as required


### Refresh Tokens

To refresh an access token make the following request:
```
{
curl https://api.sumup.com/token \
-d "grant_type=refresh_token" \
   "client_id=YOUR_CLIENT_ID" \
   "client_secret=YOUR_CLIENT_SECRET" \
   "scope=REQUESTED_SCOPES" \
   "refresh_token=YOUR_REFRESH_TOKEN" \
}
```
* `grant_type` - `refresh_token`
* `refresh_token`- Generated in [authorization code grant](#authorization_code_grant)


### Resource Owner & Implicit Credentials Grants

While supported, Resource Owner & Implicit Credentials Grants are not typically recommended for SumUp implementations. Please contact <integration@sumup.com> for more information.
