import bill_model from "../model/bill_model.js";
import bill_item_model from "../model/bill_item_model.js";
import item_model from "../model/item_model.js";

// create bill
const createBill = async (req, res) => {
  const {
    customerName,
    customerPhone,
    itemDetails,
    totalAmount,
    paymentMethod,
  } = req.body;
  try {
    if (!customerName || !customerPhone || !totalAmount || !itemDetails) {
      throw new Error("All fields are required");
    }

    // console.log("itemDetails", itemDetails);
    const createBillItems = await Promise.all(
      itemDetails.map(async (item, index) => {
        const { itemId, quantity, priceAtPurchase } = item;
        const findItemExist = await item_model.findById(itemId);
        if (!findItemExist) {
          return res.status(404).json({ message: "Item not found" });
        }
        if (quantity > findItemExist.quantityInStock) {
          return res.status(400).json({ message: "Quantity not available" });
        }

        const createBillItem = await bill_item_model.create({
          itemId,
          quantity,
          priceAtPurchase,
        });

        let newQuantity = findItemExist.quantityInStock - quantity;
        const updateQuantity = await item_model.findByIdAndUpdate(
          findItemExist._id,
          {
            quantityInStock: newQuantity,
          },
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );

        return createBillItem._id;
      })
    );

    const createBill = await bill_model.create({
      customerName,
      customerPhone,
      totalAmount,
      paymentMethod,
      billItemId: createBillItems,
    });

    await Promise.all(
      createBillItems.map(async (item, index) => {
        await bill_item_model.findByIdAndUpdate(
          item,
          {
            billId: createBill._id,
          },
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );
      })
    );

    return res.status(200).json({
      message: "Bill created successfully",
      data: createBill,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong" });
  }
};

// get all bills
const getAllBills = async (req, res) => {
  try {
    const getAllBills = await bill_model
      .find()
      .populate("billItemId", "itemId quantity priceAtPurchase");

    return res.status(200).json({ message: "All bills", data: getAllBills });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// get one bill
const getOneBill = async (req, res) => {
  const { billId } = req.body;
  try {
    const getOneBill = await bill_model
      .findById(billId)
      .populate("billItemId", "itemId quantity priceAtPurchase");

    return res.status(200).json({ message: "one bill", data: getOneBill });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// delete bill
const deleteBill = async (req, res) => {
  const { billId } = req.body;
  try {
    const findBillExist = await bill_model.findById(billId);
    if (!findBillExist) {
      throw new Error("Bill not found");
    }
    await bill_item_model.deleteMany({
      billId: billId,
    });
    await bill_model.findByIdAndDelete(billId);
    return res.status(200).json({ message: "Bill deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong" });
  }
};

// this is basic bill update only add or remove items from bill
// update bill
const updateBill = async (req, res) => {
  const {
    billId,
    action,
    itemDetails,
    totalAmount,
    paymentMethod,
    customerName,
    customerPhone,
  } = req.body;

  try {
    if (!action || !["add", "remove"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const findBillExist = await bill_model.findById(billId);
    if (!findBillExist) {
      return res.status(404).json({ message: "Bill not found" });
    }

    let arrayOfItemIds = findBillExist.billItemId; // Create a copy of the current item IDs

    if (action === "add") {
      const newBillItems = await Promise.all(
        itemDetails.map(async (item) => {
          const { itemId, quantity, priceAtPurchase } = item;
          const findItemExist = await item_model.findById(itemId);
          if (!findItemExist) {
            throw new Error(`Item with ID ${itemId} not found 1`);
          }
          if (quantity > findItemExist.quantityInStock) {
            throw new Error(
              `Quantity not available for item with ID ${itemId}`
            );
          }

          const createBillItem = await bill_item_model.create({
            itemId,
            quantity,
            priceAtPurchase,
            billId,
          });

          findItemExist.quantityInStock -= quantity;
          await findItemExist.save();

          return createBillItem._id;
        })
      );

      arrayOfItemIds.push(...newBillItems);
    } else if (action === "remove") {
      const itemsToRemove = await Promise.all(
        itemDetails.map(async (item) => {
          const { itemId } = item;

          const findBillItemExist = await bill_item_model.findOne({
            itemId: itemId,
            billId: billId,
          });

          if (!findBillItemExist) {
            throw new Error(`Item with ID ${itemId} not found in the bill`);
          }

          await bill_item_model.findByIdAndDelete(findBillItemExist._id);

          const findItemExist = await item_model.findById(itemId);
          if (findItemExist) {
            findItemExist.quantityInStock += findBillItemExist.quantity;

            await item_model.findByIdAndUpdate(
              itemId,
              { quantityInStock: findItemExist.quantityInStock },
              {
                new: true,
                runValidators: true,
                useFindAndModify: false,
              }
            );
          }

          return findBillItemExist._id.toString();
        })
      );
      arrayOfItemIds = arrayOfItemIds.filter(
        (item) => !itemsToRemove.includes(item.toString())
      );
    }

    const updatedBill = await bill_model.findByIdAndUpdate(
      billId,
      {
        billItemId: arrayOfItemIds,
        totalAmount,
        paymentMethod,
        customerName,
        customerPhone,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    return res
      .status(200)
      .json({ message: "Bill updated successfully", data: updatedBill });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong" });
  }
};

export { createBill, getAllBills, getOneBill, deleteBill, updateBill };
