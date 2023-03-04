const { EntitySchema } = require("typeorm");
const { RELATION_POST } = require("../../constant");

module.exports = new EntitySchema({
    name: RELATION_POST,
    tableName: RELATION_POST,
    columns: {
        post_id: {
            primary: true,
            type: "varhar",
            generated: "uuid",
        },
        user_id: {
            type: "uuid",
        },
       post_text:{
        type:"varchar",
        nullable:true,
       },
       post_type:{
        type:"int"
       },
       post_meta:{
        type:"json",
        nullable:true
       },
        created_at: {
            type: "timestamp",
            createDate: true,
        },
        updated_at: {
            type: "timestamp",
            updateDate: true,
        },
    },
});