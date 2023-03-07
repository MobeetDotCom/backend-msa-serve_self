const { formatErrorLog } = require("../utils/error.utils");
const { dbConnection } = require("@mobeetdotcom/orm");
const { In } = require("typeorm");
const getReference = async (options = {}) => {
    try {
        const { ref_type } = options;

        const repoReference = dbConnection.serverMain.repos["ref_reference"];
        const refData = await repoReference.find({ where: [{ reference_category_id: ref_type }] })
        let refIds = refData.map(ref => ref.reference_id);

        const repoOption = dbConnection.serverMain.repos["ref_option"];
        const optionData = await repoOption.find({ 
            where: [{ reference_id: In(refIds) }], 
            select: { option_id: true, reference_id: true, option_text: true } 
        });
        let optionArrayOfObj = {};
        for(const op of optionData){
            if(!optionArrayOfObj.hasOwnProperty(op.reference_id)){
                optionArrayOfObj[op.reference_id] = [];
            }
            optionArrayOfObj[op.reference_id].push(op);
            delete op.reference_id;
        }
        
        for(let refIndex = 0;refIndex<refData.length;refIndex++){
            if (optionArrayOfObj.hasOwnProperty(refData[refIndex].reference_id)){
                refData[refIndex].options = optionArrayOfObj[refData[refIndex].reference_id];
            }
        }
        return refData;
    } catch (error) {
        console.error(error);
        global.logger.error(formatErrorLog(error))
    }
}
module.exports = { getReference };