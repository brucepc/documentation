# mPOS Integration

## Terminal Payment SDK or Payment API

To accept card present payments with SumUp’s proprietary Card Terminal(s) in your app, Sumup provides two integration options: 
+ a [native SDK](#terminal-payment-sdk)
+ a [Payment API Switch](#payment-api)

NOTE: The Native SDKs do not require the SumUp App to be installed.

## Communication with the terminal

The SDK and API handle all communication with SumUp’s Card Terminal(s), through either a BTLE (Air & PIN+) or audio (PIN+, Chip/Magstripe & signature) connection. 

## Dynamic checkout

The SDK and API provide all user interface screens to guide merchants and customers through the checkout process, including selecting a terminal, presenting a card, entering the PIN or providing a signature. The checkout process will be triggered by your app and a transaction result returned with all relevant data at the end of the transaction.

## Security

No sensitive data will ever be passed through or stored on the merchant’s phone. All data is encrypted by the card terminal which is certified by the relevant payment industry groups (PCI, EMV I & II, Visa, MasterCard & Amex).

# Terminal Payment SDK

For **more control** over the merchant experience, we recommend the drop-in Terminal Payment SDK. For a smooth user experience, the SDK is integrated directly into your app. In addition to handling the payment and all communication with the terminal, you can update a merchants checkout preferences, add a tip, create your own compliant receipts and more.

# SDK documentation

+ [iOS SDK](https://github.com/sumup/sumup-ios-sdk)
+ [Android SDK](https://github.com/sumup/sumup-android-sdk)

# Payment API

For a **light integration**, we recommend the Payment API. Your app initiates the request to charge a card, opens the SumUp app on the merchants phone, and we handle the rest. Once the payment has been processed the transaction result is returned for reporting, and the merchant is returned to your app.

## API documentation

+ [iOS API](https://github.com/sumup/sumup-ios-url-scheme)
+ [Android API](https://github.com/sumup/sumup-android-api)

# Getting Started

To request a test account, please contact [integration@sumup.com](mailto:integration@sumup.com)

Affiliate keys are available in the Developer section of the [SumUp Dashboard](https://me.sumup.com/developers), once your register your Application Identifier.  This is the equivalent of your package name or bundle id, following the form com.example.app

