const CONSTANT = {
    ENV: {
        PROD: "production",
        STAGING: "staging",
        LOCAL: "local"
    },
    DTYPES:{
        VAL_STRING_256:"val_string_256",
        VAL_STRING_2000:"val_string_2000",
        VAL_TEXT:"val_text",
        VAL_OPTION_ID:"val_option_id",
        VAL_JSON:"val_json",
        VAL_DOUBLE:"val_double",
        VAL_DATE:"val_date",     
    },
    ISOLATION_LEVELS:{
        READ_UNCOMMITTED:"READ UNCOMMITTED",
        READ_COMMITTED:"READ COMMITTED",
        REPEATABLE_READ:"REPEATABLE READ",
        SERIALIZABLE:"SERIALIZABLE"
    }
}

module.exports = {CONSTANT}