import {
  Model,
  Column,
  DataType,
  ForeignKey,
  Table,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { MESA_STATUS } from 'src/constants/mesa';
import { Estabelecimento } from './estabelecimento.model';
import { Conta } from './conta.model';
import { Usuario } from './usuario.model';

@Table({ modelName: 'Mesas' })
export class Mesa extends Model<Mesa> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  numero: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  chamarGarcom: boolean;

  @Column({
    type: DataType.ENUM,
    values: Object.values(MESA_STATUS),
    defaultValue: MESA_STATUS.LIVRE,
  })
  status: MESA_STATUS;

  @ForeignKey(() => Estabelecimento)
  @Column({ type: DataType.UUID })
  estabelecimentoId: string;

  @BelongsTo(() => Estabelecimento)
  estabelecimento: Estabelecimento;

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.UUID, allowNull: true })
  usuarioId: string;

  @BelongsTo(() => Usuario)
  usuario: Usuario;

  @HasMany(() => Conta)
  contas: Conta[];
}