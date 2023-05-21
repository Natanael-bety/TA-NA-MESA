import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstabelecimentoDto } from './dto/create-estabelecimento.dto';
import { UpdateEstabelecimentoDto } from './dto/update-estabelecimento.dto';
import { Estabelecimento } from 'src/models/estabelecimento.model';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UPLOAD_PRESETS } from '../cloudinary/constants';
import { InjectModel } from '@nestjs/sequelize';
import { Imagem } from 'src/models/imagem.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class EstabelecimentoService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Estabelecimento)
    private estabelecimentoModel: typeof Estabelecimento,
    @InjectModel(Imagem) private imagemModel: typeof Imagem,
    private sequelize: Sequelize,
  ) {}

  async create({
    data,
    file,
  }: {
    data: CreateEstabelecimentoDto;
    file: Express.Multer.File;
  }) {
    const imagemEnviada = await this.cloudinaryService.uploadImage(file, {
      upload_preset: UPLOAD_PRESETS.ESTABELECIMENTOS,
    });

    const transaction = await this.sequelize.transaction();

    try {
      const estabelecimento = await this.estabelecimentoModel.create(
        {
          nome: data.nome,
          descricao: data.descricao,
        },
        { transaction },
      );

      const imagemEstabelecimento = await this.imagemModel.create(
        {
          publicId: imagemEnviada.public_id,
          url: imagemEnviada.url,
          version: imagemEnviada.version,
          estabelecimentoId: estabelecimento.id,
        },
        { transaction },
      );

      await transaction.commit();

      return {
        ...estabelecimento.toJSON(),
        imagem: imagemEstabelecimento.toJSON(),
      };
    } catch (err) {
      await this.cloudinaryService.deleteImage(imagemEnviada.public_id);
      await transaction.rollback();
      throw err;
    }
  }

  async getById(estabelecimentoId: string) {
    const estabelecimento = await this.estabelecimentoModel.findOne({
      where: {
        id: estabelecimentoId,
      },
    });

    if (!estabelecimento) {
      throw new NotFoundException('Estabelecimento não encontrado');
    }

    return estabelecimento;
  }

  findAll() {
    return `This action returns all estabelecimento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} estabelecimento`;
  }

  update(id: number, updateEstabelecimentoDto: UpdateEstabelecimentoDto) {
    return `This action updates a #${id} estabelecimento`;
  }

  remove(id: number) {
    return `This action removes a #${id} estabelecimento`;
  }
}
