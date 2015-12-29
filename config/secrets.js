module.exports = {

  db: process.env.MONGODB|| 'mongodb://localhost:27017/project-spend',

  sessionSecret: process.env.SESSION_SECRET || 'bestdevelopersever'
};
