import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Task = sequelize.define("Task", {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  deadline: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default Task;