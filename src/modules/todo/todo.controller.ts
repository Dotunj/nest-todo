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
import { Todo } from "./todo.entity";

@Controller("todos")
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async index(): Promise<Todo[]> {
    return await this.todoService.getAllTodos();
  }

  @Post("create")
  async create(@Body() attributes: CreateTodoDto): Promise<Todo> {
    return await this.todoService.create(attributes.name);
  }

  @Get(":id")
  async show(@Param() param: GetTodoDto): Promise<Todo> {
    return await this.todoService.findById(param.id);
  }

  @Put(":id")
  async update(
    @Body() attributes: CreateTodoDto,
    @Param() param: GetTodoDto
  ): Promise<Todo> {
    return await this.todoService.update(attributes.name, param.id);
  }

  @Delete(":id")
  async delete(@Param() param: GetTodoDto) {
    return await this.todoService.delete(param.id);
  }
}
