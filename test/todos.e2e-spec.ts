import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication, HttpStatus, ValidationPipe } from "@nestjs/common";
import { Repository } from "typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  FastifyAdapter,
  NestFastifyApplication
} from "@nestjs/platform-fastify";
import { Todo } from "../src/modules/todo/todo.entity";
import { TodoModule } from "../src/modules/todo/todo.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import databaseConfig from "../config/database.config";
const uuid = require("uuid/v4");
import { db } from "./database";

describe("Todos", () => {
  let app: INestApplication;
  let repository: Repository<Todo>;
  let todo = {
    name: "Deploy to Github"
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [databaseConfig]
        }),
        TodoModule,
        TypeOrmModule.forRoot({
          type: db.DB_TYPE,
          host: db.DB_HOST,
          port: db.DB_PORT,
          username: db.DB_USERNAME,
          password: db.DB_PASSWORD,
          database: db.DB_NAME,
          entities: ["src/**/*.entity.ts"],
          synchronize: true
        })
      ]
    }).compile();

    app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true })
    );
    repository = module.get("TodoRepository");
    await app.init();
    await app
      .getHttpAdapter()
      .getInstance()
      .ready();
  });

  afterEach(async () => {
    await repository.query(`DELETE FROM todos;`);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /todos", () => {
    it("should return an array of todos", async () => {
      await repository.save(todo);
      const { body } = await request(app.getHttpServer())
        .get("/todos")
        .expect(HttpStatus.OK);
      expect(body.length).toEqual(1);
      expect(body[0].name).toEqual(todo.name);
    });
  });

  describe("POST /todos", () => {
    it("can create a plan", async () => {
      const { body } = await request(app.getHttpServer())
        .post("/todos/create")
        .send(todo)
        .expect(HttpStatus.CREATED);
      expect(body.name).toEqual(todo.name);
    });

    it("does not create a todo without name field", async () => {
      await request(app.getHttpServer())
        .post("/todos/create")
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /todo", () => {
    it("can get a todo", async () => {
      const { id, name } = await repository.save(todo);
      const { body } = await request(app.getHttpServer())
        .get(`/todos/${id}`)
        .expect(HttpStatus.OK);
      expect(body.id).toEqual(id);
      expect(body.name).toEqual(name);
    });

    it("should return 404 for an invalid todo", async () => {
      await request(app.getHttpServer())
        .get(`/todos/${uuid()}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it("should return 400 for an invalid uuid", async () => {
      await request(app.getHttpServer())
        .get(`/todos/jjfjf`)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe("UPDATE /todos", () => {
    it("can update a todo", async () => {
      const { id } = await repository.save(todo);
      const { body } = await request(app.getHttpServer())
        .put(`/todos/${id}`)
        .send({
          name: "Finished deploying to Github"
        })
        .expect(HttpStatus.OK);
      expect(body.name).toEqual("Finished deploying to Github");
    });
  });

  describe("DELETE /todo", () => {
    it("can delete a todo", async () => {
      const { id } = await repository.save(todo);
      await request(app.getHttpServer())
        .delete(`/todos/${id}`)
        .expect(HttpStatus.OK);
      await expect(repository.findAndCount()).resolves.toEqual([[], 0]);
    });
  });
});
