const { UserModel, IncidentModel } = require('../../models');

const resolvers = {
    Query: {
      users: () => {
        return UserModel.find().exec();
      },
      incidents: (_, args) => {
        let { limit, sortBy, sortOrder, search } = args
        limit = limit > 0 ? limit : 10;
        sortBy = sortBy || "title";
        sortOrder = sortOrder || 1;
        const parm = search ? {"title": search} : {};
        const sortParm = {};
        sortParm[sortBy] = sortOrder;
        return IncidentModel.find(parm).limit(limit).sort(sortParm);;
      },
      user: async (root, { role }) => {
        return UserModel.findOne({ role });
      },
      getIncident: async (root, { title }) => {
        return IncidentModel.findOne({ title });
      },
    },
  
    Mutation: {
      createIncident: async (_, args) => {
        try {
          let usr = await UserModel.findOne({ "role": "Engineer" }).exec();
          if(usr) {
            args.assignee = usr._id;
            let response = await IncidentModel.create(args);
            return response;
          } else {
            return "No User found with Engineer Role";
          }
  
        } catch (e) {
          return e.message;
        }
      },
      createUser: async (_, args) => {
        try {
          let response = await UserModel.create(args);
          return response;
        } catch (e) {
          return e.message;
        }
      },
      assignIncident: async (_, { title, email }) => {
        try {
          let usr = await UserModel.findOne({ email }).exec();
          if (usr) {
            response = await IncidentModel.updateOne({ title },
              { $set: { assignee: usr._id } }, { new: true }
            )
            return response;
          }
        } catch (e) {
          return e.message;
        }
      },
      changeIncidentStatus: async (_, { title, status }) => {
        try {
          response = await IncidentModel.updateOne({ title },
            { $set: { status } }, { new: true }
          )
          return response;
        } catch (e) {
          return e.message;
        }
      },
      deleteIncident: async (_, { title, status }) => {
        try {
          response = await IncidentModel.deleteOne({ title })
          return response;
        } catch (e) {
          return e.message;
        }
      }
    }
  }

  module.exports = resolvers;