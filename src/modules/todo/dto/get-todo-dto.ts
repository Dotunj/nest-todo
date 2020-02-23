import { IsUUID } from "class-validator";

export class GetTodoDto {
  @IsUUID()
  id: string;
}
