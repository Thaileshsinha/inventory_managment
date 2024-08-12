import item_model from "../model/item_model.js";

//create item
const createItem = async (req, res) => {
  const { name, description, price, quantityInStock, category } = req.body;
  try {
    if (!name || !price || !quantityInStock || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const findItemExist = await item_model.findOne({ name });
    if (findItemExist) {
      return res.status(400).json({ message: "Item already exist" });
    }

    const createItem = await item_model.create({
      name,
      description,
      price,
      quantityInStock,
      category,
    });
    return res
      .status(201)
      .json({ message: "Item created successfully", data: createItem });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// get all items
const getAllItems = async (req, res) => {
  try {
    const getAllItems = await item_model.find();
    return res.status(200).json({ message: "All items", data: getAllItems });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// get one item
const getOneItem = async (req, res) => {
  const { itemId } = req.body;
  try {
    if (!itemId) {
      return res.status(400).json({ message: "item id is required" });
    }
    const getOneItem = await item_model.findById(itemId);
    if (!getOneItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ message: "One item", data: getOneItem });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// delete item
const deleteItem = async (req, res) => {
  const { itemId } = req.body;
  try {
    const findItemExist = await item_model.findById(itemId);
    if (!findItemExist) {
      return res.status(404).json({ message: "Item not found" });
    }
    const deleteItem = await item_model.findByIdAndDelete(itemId);
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// update item details but not quantity
const updateItem = async (req, res) => {
  const { itemId, name, description, price, category, quantity = 0 } = req.body;
  try {
    const findItemExist = await item_model.findById(itemId);
    if (!findItemExist) {
      return res.status(404).json({ message: "Item not found" });
    }
    let newQuantity = findItemExist.quantityInStock + quantity;
    const updateItem = await item_model.findByIdAndUpdate(
      itemId,
      {
        name,
        description,
        price,
        category,
        quantityInStock: newQuantity,
      },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    return res.status(200).json({ message: "Item updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// this is option function for update quantity

// update item quantity in all posibility
const updateQuntity = async (req, res) => {
  const { itemId, quantity, action } = req.body;

  try {
    const findItemExist = await item_model.findById(itemId);
    if (!findItemExist) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (quantity === 0) {
      return res.status(400).json({ message: "Add quantity" });
    }
    if (!action) {
      return res.status(400).json({ message: "Select action" });
    }

    let newQuantity;

    if (action === "sold") {
      newQuantity = findItemExist.quantityInStock - quantity; // item sold then item quantity decrease
    } else if (action === "return") {
      newQuantity = findItemExist.quantityInStock + quantity; // item retuned then item quantity increase
    } else if (action === "add") {
      newQuantity = findItemExist.quantityInStock + quantity; // store want to add quantity then item quantity increase
    }
    const updateQuantity = await item_model.findByIdAndUpdate(
      itemId,
      {
        quantityInStock: newQuantity,
      },
      { new: true, runValidators: true, useFindAndModify: false }
    );
    return res.status(200).json({ message: "Quantity updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export {
  createItem,
  getAllItems,
  getOneItem,
  deleteItem,
  updateQuntity,
  updateItem,
};
