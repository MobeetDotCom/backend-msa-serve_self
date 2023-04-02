const { formatErrorLog } = require("../utils/error.utils");
const { getReference } = require("./util.service");
const formConfig = require("../utils/form.conf");
const { READ_COMMITED } = require("../constant").CONSTANT.ISOLATION_LEVELS
const { dbConnection } = require("@mobeetdotcom/orm");
const { upsertClassifications } = require("../utils/helper.utils");
const signupUserByEmail = async (reqData, res) => {
    try {
        const classificationTable = formConfig["user_reg"]["ref"]["rel_classification"];
        const userPrimaryTable = formConfig["user_reg"]["non_ref"][0]["rel_primary"]
        const userReferenceKeys = formConfig["user_reg"]["ref"]["ref_set"];
        const userPrimaryCols = formConfig["user_reg"]["non_ref"][0]["cols"];
        const referencConfig = await getReference({ reference_list: userReferenceKeys });

        const creationStatus = await dbConnection.serverMain.manager.transaction(READ_COMMITED, async (transaction) => {
            const userPrimaryRepo = transaction.getRepository(userPrimaryTable);
            let user = await userPrimaryRepo.find({
                select: { user_id: true },
                where: [{ email_address: reqData["email_address"] }, { mobile_number: reqData["mobile_number"] }]
            });
            if (user.length > 0) return 409;
            let userPrimayValue = {};
            for (let primaryColIndex = 0; primaryColIndex < userPrimaryCols.length; primaryColIndex++) {
                let colConfig = userPrimaryCols[primaryColIndex];
                userPrimayValue[colConfig.reference_id] = reqData[colConfig.reference_id];
            }
            const newUser = userPrimaryRepo.create(userPrimayValue);
            const user_id = (await userPrimaryRepo.save(newUser)).user_id;
            console.log("user_id", user_id);
            await upsertClassifications({
                transaction, reqData,
                referenceArray: referencConfig,
                primaryId: user_id,
                primaryIdName: "user_id",
                rel_classification: classificationTable
            });
            return 201;
        })
        return res.status(creationStatus).json({ message: "User created" })
    } catch (error) {
        global.logger.error(formatErrorLog(error));
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { signupUserByEmail };