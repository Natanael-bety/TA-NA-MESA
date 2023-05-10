import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
  ) {}

  @Get(':id')
  async getUsuario(@Param('id') usuarioId: string) {
    const user = this.usuarioService.getUsuarioById(usuarioId);

    return user;
  }

  @Post('login')
  async createUsuario(
    @Body() body: { username: string; senha: string; email: string },
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<{ token: string }> {
    const user = this.usuarioService.createUsuario(createUsuarioDto);
    const authUsuario = await this.authService.validateUsuario(
      body.username,
      body.senha,
      body.email,
    );

    if (!authUsuario) {
      throw new Error('Usuario ou senha invalido.');
    }

    const token = await this.usuarioService.generateToken(authUsuario);

    return token;
  }
}