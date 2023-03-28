const formConfig = require("../utils/form.conf");
const { formatErrorLog } = require("../utils/error.utils");
const { dbConnection } = require("@mobeetdotcom/orm");
const { In } = require("typeorm");
const getReference = async (options = {}) => {
    try {
        let { ref_type, reference_list, form_meta } = options;
        let response = [];
        if (formConfig[form_meta]) {
            reference_list = formConfig[form_meta].ref.ref_set;
            ref_type = formConfig[form_meta].reference_category;
            for (let i = 0; i < formConfig[form_meta].non_ref.length; i++) {
                response = [...response, ...formConfig[form_meta].non_ref[i].cols];
            }
        }

        let queryCondition = { reference_category_id: ref_type };
        if (reference_list && reference_list.length > 0) {
            reference_list = Array.isArray(reference_list) ? reference_list : [reference_list];
            queryCondition.reference_id = In(reference_list);
        }
        
        const repoReference = dbConnection.serverMain.repos["ref_reference"];
        const refData = await repoReference.find({
            where: queryCondition,
            select: { reference_id: true, field_name: true, data_type: true, cardinality: true }
        });

        let refIds = refData.map(ref => ref.reference_id);

        const repoOption = dbConnection.serverMain.repos["ref_option"];
        const optionData = await repoOption.find({
            where: [{ reference_id: In(refIds) }],
            select: { option_id: true, reference_id: true, option_text: true }
        });

        let optionArrayOfObj = {};
        for (const op of optionData) {
            if (!optionArrayOfObj.hasOwnProperty(op.reference_id)) {
                optionArrayOfObj[op.reference_id] = [];
            }
            optionArrayOfObj[op.reference_id].push(op);
            delete op.reference_id;
        }

        for (let refIndex = 0; refIndex < refData.length; refIndex++) {
            if (optionArrayOfObj.hasOwnProperty(refData[refIndex].reference_id)) {
                refData[refIndex].options = optionArrayOfObj[refData[refIndex].reference_id];
            }
        }
        response = [...response, ...refData];
        return response;
    } catch (error) {
        console.error(error);
        global.logger.error(formatErrorLog(error))
    }
}
module.exports = { getReference };