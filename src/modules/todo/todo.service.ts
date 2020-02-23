import { Injectable, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Todo } from "./todo.entity";
import { Repository } from "typeorm";
import { CreateTodoDto } from "./dto/create-todo-dto";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>
  ) {}

  async getAllTodos() {
    return await this.todoRepository.find();
  }

  async create(name: string) {
    const todo = new Todo();
    todo.name = name;
    return await this.todoRepository.save(todo);
  }

  async update(name: string, id: string) {
    const todo = await this.findById(id);
    todo.name = name;
    return await this.todoRepository.save(todo);
  }

  async delete(id: string) {
    const todo = await this.findById(id);
    return await this.todoRepository.remove(todo);
  }

  async findById(id: string) {
    const todo = await this.todoRepository.findOne({ id });
    if (!todo) throw new HttpException("Todo does not exist", 404);
    return todo;
  }
}
