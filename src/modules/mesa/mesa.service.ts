import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { Mesa } from 'src/models/mesa.model';
import { InjectModel } from '@nestjs/sequelize';
import { EstabelecimentoService } from '../estabelecimento/estabelecimento.service';

@Injectable()
export class MesaService {
  constructor(
    @InjectModel(Mesa) private mesaModel: typeof Mesa,
    private readonly estabelecimentoService: EstabelecimentoService,
  ) {}

  async create(
    { numero, status }: CreateMesaDto,
    estabelecimentoId: string,
  ): Promise<Mesa> {
    const estabelecimento = await this.estabelecimentoService.getById(
      estabelecimentoId,
    );

    try {
      const novaMesa: Mesa = await this.mesaModel.create({
        estabelecimentoId: estabelecimento.id,
        numero,
        status,
      });

      return novaMesa.toJSON();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findAllByEstabelecimentoId(estabelecimentoId: string) {
    try {
      const { count, rows } = await this.mesaModel.findAndCountAll({
        where: { estabelecimentoId },
      });

      return {
        data: rows,
        totalCount: count,
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async getById(mesaId: string): Promise<Mesa> {
    const mesa = await this.mesaModel.findOne({
      where: {
        id: mesaId,
      },
    });

    if (!mesa) {
      throw new NotFoundException('mesa não encontrada');
    }

    return mesa;
  }

  async update(mesaId: string, updateMesaDto: UpdateMesaDto): Promise<Mesa> {
    try {
      const mesa = await this.getById(mesaId);

      const { ...mesaUpdatedete } = updateMesaDto;

      const novaMesa: Mesa = await mesa.update({ ...mesaUpdatedete });

      return novaMesa;
    } catch (err) {
      throw new BadRequestException(new Error(err).message);
    }
  }

  remove(mesaId: string) {
    this.mesaModel.destroy({ where: { id: mesaId } });
  }

  restaure(mesaId: string) {
    this.mesaModel.restore({ where: { id: mesaId } });
  }
}
