const { EntityManager, In } = require("typeorm");
const { VAL_DATE, VAL_STRING_256, VAL_STRING_2000, VAL_DOUBLE, VAL_JSON, VAL_TEXT, VAL_OPTION_ID } = require("../constant").CONSTANT.DTYPES
/**
 * 
 * @param {Object} options 
 * @param {EntityManager} options.transaction - This a transaction manager of typeOrm.
 * @param {Object} options.reqData - This must contain key - value pairs of classification_id and classification value.
 * @param {Object[]} [options.referenceArray=[]] - This must contain an array of classification IDs to be upserted.
 * @param {string|number} [options.primaryId] - primarykey of parent or primary relation 
 * @param {string} [options.primaryIdName] - Name of the primary id column in classification table,eg. user_id, post_id and xyz_id  
 * @param {string} [options.rel_classification] - name/target of classification relation 
 * @returns {void}
 */
const upsertClassifications = async (options = {}) => {
    const { transaction, reqData, referenceArray, primaryId, primaryIdName, rel_classification } = options;

    if (!primaryId) throw new Error("'primaryId' is required");
    if (!primaryIdName) throw new Error("'primaryIdName' is required");
    if (!rel_classification) throw new Error("'classification' name is missing")
    if (!Array.isArray(referenceArray)) throw new Error("'referenceArray' must be and Arary");
    if (!transaction) throw new Error("'transaction' object cannot be null or undefined");
    if (!reqData) return;

    const classificationRepo = transaction.getRepository(rel_classification);
    const refIds = referenceArray.map((val) => val.reference_id);

    let existingData = await classificationRepo.find({
        select: {
            reference_id: true,
            classification_uuid: true,
            [VAL_DATE]: true,
            [VAL_STRING_256]: true,
            [VAL_STRING_2000]: true,
            [VAL_TEXT]: true,
            [VAL_OPTION_ID]: true,
            [VAL_DOUBLE]: true,
            [VAL_JSON]: true
        },
        where: [{ [primaryIdName]: primaryId, reference_id: In(refIds) }]
    });

    let existingDataObject = {};
    for (let existingDataIndex = 0; existingDataIndex < existingData.length; existingData++) {
        const clsData = existingData[existingDataIndex];
        const rId = clsData.reference_id;
        const classificationUUID = clsData.classification_uuid;
        const value = clsData[VAL_DATE] || clsData[VAL_STRING_256] || clsData[VAL_STRING_2000] || clsData[VAL_TEXT] || clsData[VAL_OPTION_ID] || clsData[VAL_DOUBLE] || clsData[VAL_JSON];

        if (existingDataObject[rId]) {
            existingDataObject[rId].push({ value, classificationUUID });
        }
        else {
            existingDataObject[rId] = [{ value, classificationUUID }];
        }
    }

    for (let referenceIndex = 0; referenceIndex < referenceArray.length; referenceIndex++) {
        const { cardinality, reference_id, data_type } = referenceArray[referenceIndex];
        if (!existingDataObject[reference_id] && reqData[reference_id]) {

            // New value: doing a diret insertion

            let values = Array.isArray(reqData[reference_id]) ? reqData[reference_id] : [reqData[reference_id]];
            values = values.map((elem) => ({ [data_type]: elem, [primaryIdName]: primaryId, reference_id }));
            await classificationRepo.insert(values);
        }
        else if (cardinality === "ONE" && reqData[reference_id] && existingDataObject[reference_id][0].value !== reqData[reference_id]) {
            const { classificationUUID } = existingDataObject[reference_id][0];

            // Old value exists: updating previous value

            await classificationRepo.update({ classifier_uuid: classificationUUID }, {
                [data_type]: reqData[reference_id]
            });

        }
        else if (cardinality === "MANY" && reqData[reference_id]) {

            // Handling multiselect values
            let oldValues = existingDataObject[reference_id].values;
            let toBeDeleted = oldValues.map((elem) => elem.classificationUUID);
            let toBeInserted = reqData[reference_id].map((elem) => ({ [primaryIdName]: primaryId, [data_type]: elem, reference_id }));
            await classificationRepo.delete({ classifier_uuid: In(toBeDeleted) });
            await classificationRepo.insert(toBeInserted);
        }
    }
}

module.exports = { upsertClassifications }