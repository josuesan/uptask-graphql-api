const User = require('../models/User');
const Task = require('../models/Task');
const Project = require('../models/Project');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findById, findOneAndUpdate } = require('../models/User');

const createToken = (user, secret, expiresIn) => {
  const { _id, email, name } = user;
  return jwt.sign({ _id, email, name }, secret, { expiresIn });
}


const resolvers = {
  Query: {
    getProjects: async (_root, { }, ctx) => {
      const projects = await Project.find({ createdBy: ctx.user._id });
      return projects;
    },
    getProject: async (_root, { id }, ctx) => {
      const project = await Project.findOne({ _id: id, createdBy: ctx.user._id });
      return project;
    },
    getTasks: async (_root, { input }, ctx) => {
      const tasks = await Task.find({ createdBy: ctx.user._id }).where('project').equals(input.project);
      return tasks;
    },
  },
  Mutation: {
    // * Users
    createUser: async (root, { input }, ctx) => {

      const { email, password } = input;
      const userExist = await User.findOne({ email });

      if (userExist) {
        throw new Error("User already signup");
      }

      try {
        const salt = await bcryptjs.genSalt(10);
        input.password = await bcryptjs.hash(password, salt);
        const newUser = new User(input);
        await newUser.save();
        return 'User created sucessfully';
      } catch (error) {
        console.log(error);
      }
    },
    authenticateUser: async (_, { input }) => {
      const { email, password } = input;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('This user don\'t exist');
      }

      if (!bcryptjs.compareSync(password, user.password)) {
        throw new Error('There is an error in the email or password');
      }

      return {
        token: createToken(user, process.env.SECRET_WORD, '4hr')
      }
    },

    // * Projects
    createProject: async (_, { input }, ctx) => {
      try {
        const project = new Project(input);
        project.createdBy = ctx.user._id;
        const res = await project.save();
        return res;
      } catch (error) {
        console.log(error)
      }
    },
    updateProject: async (_, { id, input: { name } }, ctx) => {
      const project = await Project.findById(id);
      if (!project) {
        throw new Error('The project not found it')
      }
      if (project.createdBy.toString() !== ctx.user._id) {
        throw new Error('Unathorized this not your project');
      }
      const updatedProject = await Project.findOneAndUpdate({ _id: id }, { name }, { new: true });
      return updatedProject;
    },
    deleteProject: async (_, { id }, ctx) => {
      const project = await Project.findById(id);
      if (!project) {
        throw new Error('The project not found it')
      }
      if (project.createdBy.toString() !== ctx.user._id) {
        throw new Error('Unathorized this not your project');
      }
      await project.deleteOne();

      return 'Project deleted';
    },

    // * Tasks
    createTask: async (_, { input }, ctx) => {
      try {
        const task = new Task(input);
        task.createdBy = ctx.user._id;
        const res = await task.save();
        return res;
      } catch (error) {
        console.log(error);
      }
    },
    updateTask: async (_, { id, input, status }, ctx) => {
      const task = await Task.findById({ id });
      if (!task) {
        return 'Not found it';
      }
      if (task.createdBy !== ctx.user._id) {
        return 'Unathorized';
      }
      input.status = status;
      const updatedTask = await findOneAndUpdate({ _id: id }, input, { new: true });
      return updatedTask;
    },
    deleteTask: async (_, { id }, ctx) => {
      const task = await Task.findById(id);
      if (!task) {
        throw new Error('The task not found it')
      }
      if (task.createdBy.toString() !== ctx.user._id) {
        throw new Error('Unathorized this not your task');
      }
      await task.deleteOne();

      return 'Task deleted';
    },
  }

}
module.exports = resolvers;