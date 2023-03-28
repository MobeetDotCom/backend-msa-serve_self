const { getReference } = require("../services/util.service");

const Router = require("express").Router();
Router.post("/reference",async(req,res)=>{
   try {
     const { ref_type, reference_list, form_meta } = req.body;
     const payload = await getReference({ ref_type, reference_list, form_meta });
    
     return res.json(payload);
   } catch (error) {
        console.log(error)
   }
})
module.exports = Router;