# e-commerce

# e-commerce

Route | HTTP | Header(s) | Body | Response | Description
------|------|-----------|------|----------|------------
/users/login|POST||email:String(**Required**)<br>password:String(**Required**)<br>loginVia:String(**Required**)|error:<br>status code 400 <br> name:String(**Required**) <br> password:String(**Required**) min length 5 max length 10 <br> email:String(**Required**) <br> format should be _@_._, must be unique, loginVia  <br>success:<br>login success: get status code 200 <br> get token:String <br> userLogin:Object | in userLogin there're <br> name, email, role, loginVia
/users/register|POST||name:String(**Required**)<br>email:String(**Required**)<br>password:String(**Required**)<br>beAdmin:String(**required**) for become admin|error:<br>status code 400<br> Email should be unique <br> wrong beAdmin secret for becoming and admin <br> there's empty field <br>success:<br> status code 200 <br> get message:String <br> get userInfo:Object | Theres difference register page in cliend side <br> for login as admin or customer <br> but still have same page for login
/products|POST|token:String(**Required**)|name:String(**Required**)<br>amount:Number(**Required**) price:Number(**Required**) picture:File(**Required**)|error:<br>insufficient money<br>success:<br>success add item to the cart|add item to the cart
/products|GET|token:String(**Required**)||error:<br> status code 400 <br> amount:Number cant be less than 0 <br> minimum price:Number is 1000 <br> created_date and expired_date:Date but return as String <br> picture:File not encoding <br> name:String should be unique <br>success:<br> status code 201 <br> get message:String for information <br> | view all products in cart
/products/:id|PUT|token:String(**Required**) <br> itemId:String(**Required**)|token:String(**Required**)|name:String(**Required**)<br>amount:Number(**Required**) price:Number(**Required**) picture:File(**Required**)|error:<br>not authorized to edit products<br>success:<br>edit item success|edit products in cart
/products/:id|DELETE|token:String(**Required**) <br> itemId:String(**Required**)||error:<br>not authorized to remove products<br>success:<br>remove item success|remove products in cart
/cart | GET | token:String(**Required**) | | error:<br> please login first<br> success:<br> successfully read data | get products from api
/cart | POST | token:String(**Required**) | itemId:String(**Required**) <br> cartId:String(**Required**) <br> amount:Number (**Required**) | error: <br> amount must between 1 into maksimum stock | Add item into cart
/cart/:id/:itemId | PUT | token:String(**Required**) | qty:Number(**Required**) | error: <br> amount must between 1 into maksimum stock <br> can't update other customers data <br> success: update item amount | edit item in the cart
/cart/:id/:itemId | DELETE | token:String(**Required**) | | error: <br> can't delete other customers data <br> success: <br> successfully delete data from cart | delete item from the cart
/transaction | GET | token:String(**Required**) | | error:<br> please login first<br> success:<br> successfully read data | get transactions from api
/transaction | POST | token:String(**Required**) | cartId:String(**Required**) <br> amountId:String(**Required**) <br> rajaOngkirFile:String <br> amount:Number (**Required**) | error: <br> amount product must between 1 into maksimum stock | Add item into transaction
/transaction/:id/:itemId | PUT | token:String(**Required**) | status:Number(**Required**) | error: <br> only can change status between admin and user | admin can sent file, while user only can accept file


### Usage
command |
------- |
$ npm install |
$ npm run start from server dist |
$ npm run serve |

Access the Server via http://localhost:3000/
<br>
Access the Client via http://localhost:8080/