creating a backend system to manage inventory and sales for a small shop.
The system should allow users to add items to the inventory, create bills for sales
transactions, and update inventory accordingly.

<!-- node module install -->

install node_modules, you can run:
npm install

<!-- start -->

In the project directory, you can run:
npm start

<!-- .env -->

set a environment variable in .env file
MONGO_URL = "" || mongodb://localhost:27017/inventory_management
PORT = "" || 5000

<!-- REST Api all link with Base-url http://localhost:5000/ to run local system  -->

1. http://localhost:5000/item/createItem
   To create or add item in inventory

2. http://localhost:5000/item/getAllItems
   To get all items from inventory (GET Method)

3. http://localhost:5000/item/getOneItem
   To get details of one item from inventory

4. http://localhost:5000/item/updateItem
   To update a item details like price, quantity etc

5. http://localhost:5000/item/deleteItem
   To delete a item from inventory

http://localhost:5000/bill/createBill
To create bill for customer

schema design:
{
"customerName" : "",
"customerPhone" : "",
"totalAmount" : ,
"itemDetails" : [
{
"itemId" : "",
"quantity" : ,
"priceAtPurchase" :
}
]
}

http://localhost:5000/bill/getAllBills
To get all bill & details

http://localhost:5000/bill/getOneBill
To get details of one bill

http://localhost:5000/bill/deleteBill
To delete a bill

http://localhost:5000/bill/updateBill
update a bill details

schema design:
{
"billId": "",
"action" : "remove" || "add",
"itemDetails":[
{
"itemId" : "",
"quantity" : ,
"priceAtPurchase" :
}
]
}

LinkedIn - https://www.linkedin.com/in/thaileshsinha
Portfolio - https://thailesh-protfolio.vercel.app/
Github - https://github.com/Thaileshsinha/inventory_managment
Email - sinhathailesh@gmail.com
