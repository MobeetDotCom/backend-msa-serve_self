const { getReference } = require("../services/util.service");

const Router = require("express").Router();
Router.post("/reference",async(req,res)=>{
   try {
     const { ref_type } = req.body;
     const payload = await getReference({ref_type});
     
     return res.json({payload});
   } catch (error) {
        console.log(error)
   }
})
module.exports = Router;