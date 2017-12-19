# Group Terminal Payment SDK

To integrate SumUp’s proprietary Card Terminal(s) and our Payment Platform into your app, we provide you with a native iOS or Android SDK. Our SDKs provide the following functionalities:


## Communication with terminal

The SDK handles all communication with SumUp’s Card Terminal(s) transparently. The communication is controlled through either Bluetooth or audio libraries. The PIN+ Terminal connects to your Android or iOS app via Bluetooth Low Energy (BLE 4.0) or via cable connection through the headphone/audio jack. The Chip/Magstripe & Signature Card Readers connect through the headphone/audio jack only.

## Dynamic checkout

This will correspond to the checkout process in the SumUp App. The applicable screens will be pushed from SumUp's backend to your app. The checkout process will be triggered by your app and we will return the transaction result with all relevant data at the end of the transaction. The transaction itself is transparent to you.

## Transaction status

After the completion of a transaction, a unique transaction ID, payment receipt details, as well as the current transaction status “transaction successful”, “transaction failed” or “transaction timeout” will be passed back to you and can be stored there for reporting purposes.

## Security

No sensitive data will ever be passed through or stored on the merchant’s phone. All data is encrypted by the card terminal which is certified with all relevant certificates of the credit card industry (PCI, EMV I & II, Visa, MasterCard & Amex).


# SDK documentation

+ [iOS SDK](https://github.com/sumup/sumup-ios-sdk)
+ [Android SDK](https://github.com/sumup/sumup-android-sdk)



# Group Payment API

The Payment API is designed for a very easy and quick implementation. It allows your app to start the checkout flow inside the native SumUp App, which will also have to be installed on your merchant’s phone or tablet. Your app can manage everything including the creation of the total amount to be charged by your merchant. When your merchant clicks the checkout button in your app, your app will define a payment request object, using the parameters supported by our API which include the total billing amount. Those parameters will then be passed by your app to the SumUp App via the Payment API. The Payment API is a part of the SumUp App, so that neither your app nor your backend will have to be connected to SumUp’s Backend.

Your app will need an Affiliate Key to connect to the Payment API. Once the SumUp App receives the Payment API request it will be pushed into the foreground on your merchant’s phone or tablet and your app will be in the background. Your merchant will follow the checkout process inside the SumUp App, that way the SumUp App can manage the communication with the Card Terminal and your app does not need to manage this communication. On completion of the transaction, the SumUp App will return the result to those callback URLs in your app as supplied in the original request. Your merchant may have to select the appropriate Payment Option before being able to complete the transaction with the end-customer’s Payment Instrument.

## API documentation

+ [iOS API](https://github.com/sumup/sumup-ios-url-scheme)
+ [Android API](https://github.com/sumup/sumup-android-api)