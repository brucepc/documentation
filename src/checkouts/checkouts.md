# Group Checkout flow

The checkout flow described below enables applications to create a checkout and process card payments in a browser or a native application such as a mobile application.

Checkouts are created in a server to server communication. This allows to

*   keep your access token and client credentials secret.
*   prevent changes of your web based checkout properties. For example, amount or recipient.

Checkouts are processed by the client (in a browser in the case of web application). This guarantees that

*   no sensitive (card data) ever hits your server.
*   you don't need to worry about PCI compliance.
*   you are in full control of the UI thus giving the best user experience to your customers.

## Group Creating a checkout
A new checkout is created in a server-to-server communication between your Server and SumUp. Therefore the amount of the checkout cannot be altered in the frontend after it's been created. Refer to the [checkouts API](../rest-api/checkouts-api/#checkouts-create-checkout-post) for full details of the valid create checkout request. The use of the checkout APIs requires client authentication. 

## Group Completing a checkout
The checkout you created in a server to server communication can be completed in your mobile or web app. You are free to go with a custom integration checkout or embed the [SumUp checkout form](#header-sumup-checkout). 
Note that a checkout can be completed in a browser only from a domain that is present in your OAuth config as authorized javascript origin(s). 


### Custom integration Checkout 

In this scenario it is up to you to build a payment form and send the user input to SumUp in order to complete a pending checkout created on your server. In a browser this can be done by an ajax request, like:

    
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
    

The path parameter `id` should be the `id` of the response of create checkout.
Check the [Checkout API documentation](../rest-api/checkouts-api/#checkouts-complete-checkout-put) for complete details of the request and response from the checkout call.
CORS requests are possible if you have correctly set cors origins in your OAuth setup and the checkout was created by a client with that setup.



### SumUp Checkout

Alternatively you can complete a checkout by using a checkout form provided by SumUp. It will automatically handle all the details as building a custom payment form, validating the user input or make a call to complete a checkout. The only thing that you need to bother with is to handle the result of the checkout. The checkout form is completely white labeled and straightforward to integrate. 


<div style="width:352px; margin:auto;">
    <p style="font-size:0.7em; margin: 20px auto 20px auto">Start typing to try it on your own</p>
    <card></card>
    <p>&nbsp;</p>
</div>
<script src="https://gateway.sumup.com/gateway/card.js"></script>
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
<script src="https://gateway.sumup.com/gateway/card.js"></script>
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

By providing a specific configuration you can easilly localize and customize the form.

The checkout result handler is a function that is called with an object presenting the checkout processing  result. See [Checkout API document](../rest-api/checkouts-api/#checkouts-complete-checkout-put) for description of the checkout response.
 
It is recommended that your checkout processing result handler sends the result to your backend which verifies the checkout result before showing any status to the end user.