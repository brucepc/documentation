# OAuth

SumUp uses [OAuth](http://oauth.net/) to provide standard way for authorized access to its API.


<svg class="icon" viewBox="0 0 100 100" width="100" height="100" style="fill:black">
  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-nav-oauth"></use>
</svg>

## Group Authorization Model

The authorization API is based on the abstract protocol flow as defined by [OAuth 2.0 specification](http://tools.ietf.org/html/rfc6749). 

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
+ Authorization endpoint - ```/authorize```
+ Token endpoint - ```/token```

### SumUp supported scopes

The possible scopes that might be requested and granted by SumUp authorization server upon receiving user consent are

+ user.profile_readonly - Access user profile information
+ user.profile - Access and edit user profile information
+ user.subaccounts - Access and manage users's employees
+ user.payout-settings - Access and edit user's payout settings
+ user.app-settings - Access and manage mobile application settings
+ payments - Make payments
+ balance - Access and manage user balance
+ products - Access and manage your user's products, shelves, prices, vat rates
+ transactions.history - Access user's transaction history


By default all registered applications can request  user.profile, payments, user.app-settings and transactions.history scope. 

## Group OAuth setup

You can make or change your OAuth setup in the [developers section](https://me.sumup.com/developers) of the SumUp Dashboard.

### Consent screen

The consent screen will be shown to users whenever you request access to their private data using your client ID. It will be shown for all your registered applications. In order to make your application recognaziable you need to provide information for

* __Product name__ (Required) - this is the name of your service or application that helps users recognize it
* __Home page url__ - Link to your home page
* __Logo URL__ - Your logo that if provided will be shown to the user
* __Terms of service url__ - Your T&C page
* __Privacy policy url__ - Your privacy policy page


### Client credentials

Once you set your consent screen details you can create one or more client credentials. The information that you need to enter includes

+ __Client type__ - you can choose between WEB, ANDROID, IOS, OTHER
+ __Client name__ - your application name as you recognize it. Ex "my awesome application"
+ __Authorized redirect uri__ - This is the path in your application that users are redirected to after they have authenticated with SumUp. It must contain protocol or custom url scheme
+ __Authorized javascript origin__ - For use with requests from a browser - for example complete a checkout. This is the origin URI of the client application. It can't contain a wildcard (http://*.example.com) or a path (http://example.com/subdir). If you're using a nonstandard port, you must include it in the origin URI. 

Once you create a client credentials you can download the details that includes client id and secret to use for authorization.  Example:

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


