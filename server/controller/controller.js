const { Category, Transaction } = require('../models/model');

// POST: http://localhost:8080/api/categories
async function create_Categories(req, res){
   const Create = new Category({
       type: "Investment",
       color: "#FCBE44"
   });

   try {
       const savedCategory = await Create.save();
       res.json(savedCategory);
   } catch (err) {
       res.status(400).json({ message : `Error while creating categories ${err}`});
   }
}

// GET: http://localhost:8080/api/categories
async function get_Categories(req, res){
    try {
        let data = await Category.find({});
        let filter = data.map(v => ({ type: v.type, color: v.color }));
        res.json(filter);
    } catch (err) {
        res.status(400).json({ message : `Error fetching categories ${err}`});
    }
}

// POST: http://localhost:8080/api/transaction
async function create_Transaction(req, res){
    if(!req.body) return res.status(400).json("Post HTTP Data not Provided");
    
    const { name, type, amount } = req.body;

    const create = new Transaction({
        name,
        type,
        amount,
        date: new Date()
    });

    try {
        const savedTransaction = await create.save();
        res.json(savedTransaction);
    } catch (err) {
        res.status(400).json({ message : `Error while creating transaction ${err}`});
    }
}

// GET: http://localhost:8080/api/transaction
async function get_Transaction(req, res){
    try {
        let data = await Transaction.find({});
        res.json(data);
    } catch (err) {
        res.status(400).json({ message : `Error fetching transactions ${err}`});
    }
}

// DELETE: http://localhost:8080/api/transaction
async function delete_Transaction(req, res){
    if (!req.body) return res.status(400).json({ message: "Request body not Found"});
    
    try {
        await Transaction.deleteOne(req.body);
        res.json("Record Deleted...!");
    } catch (err) {
        res.json("Error while deleting Transaction Record");
    }
}

// GET: http://localhost:8080/api/labels
async function get_Labels(req, res){

    try {
        const result = await Transaction.aggregate([
            {
                $lookup : {
                    from: "categories",
                    localField: 'type',
                    foreignField: "type",
                    as: "categories_info"
                }
            },
            {
                $unwind: "$categories_info"
            }
        ]);

        let data = result.map(v => ({ 
            _id: v._id, 
            name: v.name, 
            type: v.type, 
            amount: v.amount, 
            color: v.categories_info.color 
        }));

        res.json(data);
        
    } catch (error) {
        res.status(400).json("Lookup Collection Error");
    }

}

module.exports = {
    create_Categories,
    get_Categories,
    create_Transaction,
    get_Transaction,
    delete_Transaction,
    get_Labels
}