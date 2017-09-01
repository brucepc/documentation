# Group Checkout flow

The checkout flow described below enables applications to create a checkout and process card payments in a browser or a native application such as a mobile application.

Checkouts are created in a server to server communication. This allows to

*   keep your access token and client credentials secret.
*   prevent changes of your web based checkout properties. For example, amount or recipient.

Checkouts are processed by the client (in a browser in the case of web application). This guarantees that

*   no sensitive (card data) ever hits your server.
*   you don't need to worry about PCI compliance.
*   you are in full control of the UI thus giving the best user experience to your customers.

## Creating a checkout

A new checkout is created in a server-to-server communication between your Server and SumUp. Therefore the amount of the checkout cannot be altered in the frontend after it's been created. 

The following is an example curl request:
```
curl -i -X POST \
-H "Content-Type:application/json" \
-H "Authorization:Bearer :YOUR_ACCESS_TOKEN" \
-d \
'{"amount": XXX.XX, 
    "currency": "EUR",
    "pay_to_email": "MERCHANT_EMAIL",
    "checkout_reference": "YOUR_UNIQUE_REFERENCE",
    "description": "YOUR_DESCRIPTION"
}' \
'https://api.sumup.com/v0.1/checkouts'
```
* `Authorization`- Access token created when authorised by merchant

Refer to the [checkouts API](../rest-api/checkouts-api/#checkouts-create-checkout-post) for full details of the create checkout request and response. 

If successful, the following response will be received:

```
{ 
  "id": "CHECKOUT_ID",
  "checkout_reference": "YOUR_UNIQUE_REFERNCE"
  "status": "PENDING",
  ...
}
```
* `id`- used when completing the checkout
* `status` - Pending until the checkout is completed

## Group Completing a checkout

The checkout you created in a server to server communication can be completed in your mobile or web app. You are free to go with a [custom integration](#custom_integration+checkout) checkout or embed the [SumUp checkout form](#header-sumup-checkout). 

Note that a checkout can be completed in a browser only from a domain that is present in your OAuth setup as an authorized javascript origin(s). 

### SumUp Checkout

Alternatively you can complete a checkout by using a checkout form provided by SumUp. It will automatically handle all the details as building a custom payment form, validating the user input or make a call to complete a checkout. The only thing that you need to bother with is to handle the result of the checkout. The checkout form is completely white labeled and straightforward to integrate. 

<div style="width:352px; margin:auto;">
    <p style="font-size:0.7em; margin: 20px auto 20px auto">Start typing to try it on your own</p>
    <card></card>
    <p>&nbsp;</p>
</div>
<script src="https://me.sumup.com/gateway/card.js"></script>
<script>
    PaymentCard.mount({checkoutId: "...", demoMode: true});
    PaymentCard.on('checkout:paymentResult', function(data) {
        //TODO: handle the checkout result
    })
</script>

To integrate the checkout form you need a few lines of code in your html page

```html
<!-- the place it will appear-->
<card></card>
<!-- the form js library-->
<script src="https://me.sumup.com/gateway/card.js"></script>
<script>
    //render the form ui providing a configuration object
    PaymentCard.mount({checkoutId: "..."});
    //listen to checkout processing result and handle it
    PaymentCard.on('checkout:paymentResult', function(data) {
        //TODO: handle the checkout result
    })
</script>
```

The checkout form is fully customizable. To do so you can provide a configuration to `PaymentCard.mount` method. All the possible configuration properties with their default values are listed bellow. The only required field is `checkoutId` without which the checkout cannot be completed.

```
{
  "checkoutId": "...", //Id of the checkout to be completed (Required).
  "fields_placeholders": {
    "card_number": "Card number",
    "cvv": "CVV",
    "expiry_date": "Expiry date",
    "cardholder_name": "Cardholder name",
    "pay_now": "Pay"
  },
  "card_placeholders": {
    "number": "•••• •••• •••• ••••",
    "name": "Cardholder name",
    "expiry": "••/••••",
    "cvc": "•••"
  },
  "card_messages": {
    "validDate": "valid\ndate",
    "monthYear": "mm/yyyy"
  }
}
```

By providing a specific configuration you can easily localize and customize the form.

The checkout result handler is a function that is called with an object presenting the checkout processing  result. See [Checkout API document](../rest-api/checkouts-api/#checkouts-complete-checkout-put) for description of the checkout response.
 
It is recommended that your checkout processing result handler sends the result to your backend which verifies the checkout result before showing any status to the end user.

### Custom integration Checkout 

In this scenario it is up to you to build a payment form and send the user input to SumUp in order to complete a pending checkout created on your server. There are three options for payment with a custom integration:

 * Customer entered credit card
 * Tokenized credit card
 * Merchant balance

#### Customer entered credit card

The request should be made form a client only, and not from a server. In a browser this can be done by an ajax request, like:

    
    PUT /v0.1/checkouts/:id
    
    {
      "payment_type":"card",
        "card": {
            "cvv": "...",
            "expiry_month": "01",
            "expiry_year": "2016",
            "number": ".......",
            "name":"...."
        }
    }
    

- `id` - `id` of the response from [create checkout](#creating_a_checkout)
- `payment_type` - `card`

Check the [Checkout API documentation](../rest-api/checkouts-api/#checkouts-complete-checkout-put) for complete details of the request and response from the checkout call.

CORS requests are possible if you have correctly set cors origins in your OAuth setup and the checkout was created by a client with that setup.

### Tokenized Cards

If you have already [created a customer](#creating_a_customer) and [tokenized a card](#tokenizing_a_card), then the checkout can be completed with a token. This request can be made server side as the card data has already been collected, or from a web application as only the client id is used for authorization.

The following is an example curl request:
```
curl -i -X PUT \
-H "Content-Type:application/json" \
-d \
'{"payment_type": "card", 
    "token": "VALID_CARD_TOKEN",
    "customer_id": "YOUR_CUSTOMER_ID"
 }' \
'https://api.sumup.com/v0.1/checkouts/:id'
```
* `id` - `id` of the response from [create checkout](#creating_a_checkout)
* `token` - card token returned when [tokenizing a card](#tokenizing_a_card), must be associated with `customer_id`
* `customer_id` - customer id returned when [creating a customer](#creating_a_customer)


### Merchant Balance

Merchants can also be enabled to pay with the balance of their SumUp account, please contact <integration@sumup.com> for more information.

## Card on File

### Creating a customer
A customer is associated with your application, and can be used to make a payment to any merchant who has authorised the application to take payments on it's behalf.

The following is an example curl request without any `personal_details`:
```
curl -i -X POST \
-H "Content-Type:application/json" \
-H "Authorization:Bearer :VALID_ACCESS_TOKEN" \
-d \
'{"customer_id": "YOUR_CUSTOMER_REFERENCE" 
 }' \
'https://api.sumup.com/v0.1/customers'
```
* `authorization` - `Bearer` and `access_token` created using client credentials grant
* `customer_id` - unique id generated by your application

Check the [Customers API documentation](../rest-api/checkouts-api/#customers) for complete details of the request and response from the customers call.

If the request is successful, the customer data will be echoed in the response.

### Tokenizing a card
Once a customer has been created, cards can be tokenized and added as payment instruments. This token can then be used to complete a checkout.

An authorization of 1.00 in the currency of the card will be processed and then reversed in order to verify the card.

```
curl -i -X POST \
-H "Content-Type:application/json" \
-H "Authorization:Basic :BASE64_ENCODED_CLIENT_ID_FOLLOWED_BY_COLON" \
-d \
'{"type": "card",
  "card": {
    "name": "CARDHOLDER_NAME",
    "number": "CARD_NUMBER",
    "expiry_month": "EXP_MONTH_DIGITS",
    "expiry_year": "EXP_YEAR_TWO_OR_FOUR_DIGITS"
    "cvv": "CVV"
  }
 }' \
'https://api.sumup.com/v0.1/customers/:customer_id/payment-instruments'
```
* `authorization` - `Basic` and Base64 encoded `client_id` which enables the request to be made from non-trusted clients like web or mobile applications
* `customer_id` - unique id generated by your application
* `type` - `card`

Check the [Payment Instruments API documentation](../rest-api/checkouts-api/#customers-payment-instruments-post) for complete details of the request and response from the payment instruments call.

If the request is successful the following will be returned:
```
{
  "token": "...",
  "active": true,
  "type": "...",
  "card": {
    "last_4_digits": "...",
    "type": "..."
  }
}
```
* `token` - `token` to be used when completing a checkout with this payment instrument
* `active` - Each customer can have up to 4 active payment instruments using the [payment instruments API](../rest-api/#checkouts-api/#customers-payment-instruments)
* `type` - `card`

### Subscriptions

While SumUp does not offer a subscriptions service, recurring payments can be performed by completing a checkout with a tokenized card at the frequency required.
