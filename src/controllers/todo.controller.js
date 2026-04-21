import { Todo } from "../models/todo.model.js";

/**
 * TODO: Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    const { title, priority, tags, completed, dueDate } = req.body;
    const newTodo = await Todo.create({
      title,
      priority,
      tags,
      dueDate,
      completed,
    });
    return res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {
  try {
    const { page = 1, limit = 10, completed, priority, search } = req.query;
    const query = {};

    if (completed) {
      query.completed = completed.toLowerCase() === "true" ? true : false;
    }
    if (priority) {
      query.priority = priority.toLowerCase();
    }
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    let todos = await Todo.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const pageCount = await Todo.countDocuments(query);

    const pages = Math.ceil(pageCount / limit);

    return res.json({
      data: [...todos],
      meta: {
        total: pageCount,
        page: Number(page),
        limit: Number(limit),
        pages,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Get single todo by ID
 * - Return 404 if not found
 */
export async function getTodo(req, res, next) {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo)
      return res.status(404).json({ error: { message: "Todo not found" } });

    return res.json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {
    const { title, priority, completed, tags, dueDate } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        title,
        priority,
        tags,
        dueDate,
        completed,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!todo)
      return res.status(404).json({ error: { message: "Todo not found" } });

    return res.json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      [
        {
          $set: {
            completed: { $not: "$completed" },
          },
        },
      ],
      { new: true },
      { runValidators: true },
    );

    if (!todo)
      return res.status(404).json({ error: { message: "Todo not found" } });

    return res.json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({
        error: {
          message: "Todo not found",
        },
      });
    }
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
