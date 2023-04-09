const { DTYPES } = require("../constant").CONSTANT;
const userRegistrationFromConfig = {
    basic_classification: {
        table: "user_classification",
        primaryCol: "classification_uuid",
        parentTablePrimaryCol: "user_id",
        reference_table: "ref_reference",
        reference_table_primary_key: "reference_id",
        reference_projection: ["ref_reference.reference_id", "ref_reference.field_name", "ref_reference.allow_multiple", "ref_reference.data_type" ],
        references: [10010002, 10010001]
    },
    basic_primary: {
        table: "user_primary",
        primaryCol: "user_id",
        non_references: [
            {
                "reference_id": "first_name",
                "field_name": "First name",
                allow_multiple: false,
                "data_type": DTYPES.VAL_STRING_256
            },
            {
                "reference_id": "middle_name",
                "field_name": "Middle name",
                allow_multiple: false,
                "data_type": DTYPES.VAL_STRING_256
            },
            {
                "reference_id": "last_name",
                "field_name": "Last Name",
                allow_multiple: false,
                "data_type": DTYPES.VAL_STRING_256
            },
            {
                "reference_id": "username",
                "field_name": "Username",
                allow_multiple: false,
                "data_type": DTYPES.VAL_STRING_256
            },
            {
                "reference_id": "email_address",
                "field_name": "Email address",
                allow_multiple: false,
                "data_type": DTYPES.VAL_STRING_256
            },
            {
                "reference_id": "mobile_number",
                "field_name": "Mobile number",
                allow_multiple: false,
                "data_type": DTYPES.VAL_STRING_256
            }

        ]
    }
}

module.exports = { user_reg: userRegistrationFromConfig }