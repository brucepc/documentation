# mPOS payments

## Terminal Payment SDK or Payment API

To take card present payments with SumUp’s proprietary Card Terminal(s) in your app, Sumup provides two integration options for both Android and iOS; a [native SDK](#terminal-payment-sdk), and a [Payment API Switch](#payment-api).

## Communication with the terminal

The SDK and API handle all communication with SumUp’s Card Terminal(s), through either a BLE (Air & PIN+) or audio (PIN+, Chip/Magstripe & signature) connection. 

## Dynamic checkout

The SDK and API provide all screens to guide merchants and customers through the checkout process, including selecting a terminal, presenting a card, entering the PIN or providing a signature. The checkout process will be triggered by your app and a transaction result returned with all relevant data at the end of the transaction.

## Security

No sensitive data will ever be passed through or stored on the merchant’s phone. All data is encrypted by the card terminal which is certified by the relevant payment industry groups (PCI, EMV I & II, Visa, MasterCard & Amex).

# Terminal Payment SDK

For **more control** over the merchant experience, we recommend the Terminal Payment SDK. For a smooth user experience, the SDK is integrated directly into your app. In addition to handling the payment and all communication with the terminal, you can update a merchants checkout preferences, add a tip, create your own compliant receipts and more.

# SDK documentation

+ [iOS SDK](https://github.com/sumup/sumup-ios-sdk)
+ [Android SDK](https://github.com/sumup/sumup-android-sdk)

# Payment API

For a **quick integration**, we recommend the Payment API. Your app initiates the request to charge a card, opens the SumUp app on the merchants phone, and we handle the rest. Once the payment has been processed the transaction result is returned for reporting, and the merchant is returned to your app.

## API documentation

+ [iOS API](https://github.com/sumup/sumup-ios-url-scheme)
+ [Android API](https://github.com/sumup/sumup-android-api)
