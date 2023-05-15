const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors()); 

const mongoose = require('mongoose');

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
}));

mongoose.connect("mongodb://127.0.0.1:27017/todoapp")
  .then(() => console.log("CONNECTED"))
  .catch((error) => console.log("ERROR IN CONNECTING TO DATABASE", error));

const taskSchema = new mongoose.Schema({
  task: {
    type:String,
    required: true
  },
  date: { type: Date, default: Date.now },
  completed:{type:Boolean,default:false}
});

const Task = mongoose.model('Task', taskSchema);

app.listen(4200, () => console.log("Server started..."));

app.get('/tasks', (req, res) => {
  Task.find({})
    .then((allTasks) => {
      console.log(allTasks);
      res.json(allTasks);
    })
    .catch((error) => {
      console.log("ERROR:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.post('/tasks', (req, res) => {
  const { task } = req.body;

  if (!task || task.trim() === "") {
    return res.status(400).json({ error: "Task cannot be empty" });
  }

  Task.create({ task })
    .then((newTask) => {
      console.log("Task created:", newTask);
      res.json(newTask);
    })
    .catch((error) => {
      console.log("ERROR:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.put('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  console.log("mark");
  Task.findByIdAndUpdate(taskId, { completed: true }, { new: true })
    .then((updatedTask) => {
      if (!updatedTask) {
        return res.status(404).send('Task not found');
      }

      console.log('Task updated:', updatedTask);
      res.json(updatedTask);
    })
    .catch((error) => {
      console.log('ERROR:', error);
      res.status(500).send('Internal Server Error');
    });
});


app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;

  Task.findByIdAndDelete(taskId)
    .then((deletedTask) => {
      if (!deletedTask) {
        return res.status(404).send('Task not found');
      }

      console.log('Task deleted:', deletedTask);
      res.send('Task deleted successfully');
    })
    .catch((error) => {
      console.log('ERROR:', error);
      res.status(500).send('Internal Server Error');
    });
});
