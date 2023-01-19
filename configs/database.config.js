exports.serve_self = {
  type: "mongodb",
  url: process.env.DB_MSA_SERVE_SELF_URL,
  synchronize: false,
  logging: false,
  useUnifiedTopology: true,
  entities: [`entity/${process.env.MSA}/**/*.ts`],
  migrations: ["migration/serve_self/*.js"],
  extra: {
    connectionLimit: process.env.DB_MONGO_MSA_SELF_SERVE_CONN_LIMIT,
  },
};
