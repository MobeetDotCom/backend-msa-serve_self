const { DTYPES } = require("../constant").CONSTANT;
const formConfig = {
    "user_reg": {
        "reference_category": 1001,
        "ref": {
            "rel_classification": "user_classification",
            "ref_set": [10010002, 10010001]
        },
        "non_ref": [
            {
                "rel_primary": "user_primary",
                "cols": [
                    {
                        "reference_id": "first_name",
                        "field_name": "First name",
                        "cardinality": "ONE",
                        "data_type": DTYPES.VAL_STRING_256
                    },
                    {
                        "reference_id": "middle_name",
                        "field_name": "Middle name",
                        "cardinality": "ONE",
                        "data_type": DTYPES.VAL_STRING_256
                    },
                    {
                        "reference_id": "last_name",
                        "field_name": "Last Name",
                        "cardinality": "ONE",
                        "data_type": DTYPES.VAL_STRING_256
                    },
                    {
                        "reference_id": "email_address",
                        "field_name": "Email address",
                        "cardinality": "ONE",
                        "data_type": DTYPES.VAL_STRING_256
                    },
                    {
                        "reference_id": "mobile_number",
                        "field_name": "Mobile number",
                        "cardinality": "ONE",
                        "data_type": DTYPES.VAL_STRING_256
                    }
                ]
            }
        ]
    }
}

module.exports = formConfig