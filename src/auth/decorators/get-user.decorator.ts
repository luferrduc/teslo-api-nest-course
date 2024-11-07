import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const GetUser = createParamDecorator(( data, ctx: ExecutionContext ) => {
  // La data es el argumento que se le manda al decorador
  // por ejemplo @GetUser('email') => data -> "email"
  // Si quiero mandar más de 1 argumento, hacerlo con un arreglo
  // @GetUser(['email', 'fullName', 'roles']) => data -> ['email', 'fullName', 'roles']

  const req = ctx.switchToHttp().getRequest();

  console.log({data})
  const user = req.user

  if(!user)
    throw new InternalServerErrorException('User not found (request)')

  return !data ? user : user[data]
});