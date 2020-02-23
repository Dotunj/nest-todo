import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Put,
  Delete
} from "@nestjs/common";
import { TodoService } from "./todo.service";
import { CreateTodoDto } from "./dto/create-todo-dto";
import { GetTodoDto } from "./dto/get-todo-dto";

@Controller("todos")
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async index() {
    return await this.todoService.getAllTodos();
  }

  @Post("create")
  async create(@Body() attributes: CreateTodoDto) {
    return await this.todoService.create(attributes.name);
  }

  @Get(":id")
  async show(@Param() param: GetTodoDto) {
    return await this.todoService.findById(param.id);
  }

  @Put(":id")
  async update(@Body() attributes: CreateTodoDto, @Param() param: GetTodoDto) {
    return await this.todoService.update(attributes.name, param.id);
  }

  @Delete(":id")
  async delete(@Param() param: GetTodoDto) {
    return await this.todoService.delete(param.id);
  }
}
