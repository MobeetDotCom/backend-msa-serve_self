const formSchema = require("../utils/form.schema");
const { formatErrorLog } = require("../utils/error.utils");
const { dbConnection } = require("@mobeetdotcom/orm");
const { In } = require("typeorm");
const { CONSTANT } = require("../constant");
const getReference = async (options = {}) => {
    try {
        let { ref_type, reference_list, form_meta } = options;
        let referencesToBePicked = [];
        if (!formSchema[form_meta]) return -1;
        const schema = formSchema[form_meta];
        for (const [key, value] of Object.entries(schema)) {
            let formObject = { group: key };
            if (!value.references) {
                formObject["fields"] = value.non_references;
                referencesToBePicked.push(formObject);
                continue;
            }
            let { reference_table, reference_table_primary_key, references, reference_projection } = value;
            let aggregator = "json_agg(json_build_object('option_id', ref_option.option_id,'option_text', ref_option.option_text)) options";
            let selectedColumns = [...reference_projection, aggregator];
            let whereCondition = `${reference_table}.${reference_table_primary_key} IN (:...references)`;
            let whereParams = { references };
            let innerJoinCondition = `${reference_table}.${reference_table_primary_key}=ref_option.reference_id`;
            let queryBuilder = dbConnection.serverMain.repos[reference_table].createQueryBuilder();
            let referenceData = await queryBuilder
                .leftJoinAndMapOne(`reference_id`, "ref_option", "ref_option", innerJoinCondition)
                .where(whereCondition, whereParams)
                .groupBy('ref_reference.reference_id')
                .select(selectedColumns)
                .execute();
            formObject["fields"] = referenceData;
            referencesToBePicked.push(formObject);
        }
        return referencesToBePicked;
    } catch (error) {
        console.error(error);
        global.logger.error(formatErrorLog(error));
    }
};
module.exports = { getReference };