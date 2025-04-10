import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export enum FeedbackType {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}

// TODO: Definir as justificativas para cada tipo de feedback
// export enum NegativeFeedback {
//   REASON_1,
//   REASON_2,
// }

export type FeedbacksDocument = Feedbacks & Document;

// Table feedbacks {
//   suggestion_id string [ref: > suggestions.comment_id, note: "ID do comentário (GitHub) ao qual o feedback se refere"]
//   type          string [note: "Tipo de feedback (positivo ou negativo)"]
//   justification text    [note: "Justificativa fornecida se a sugestão não for considerada útil ou não está sendo feita"]
//   created_at    datetime [note: "Data de criação do feedback"]
// }

@Schema()
export class Feedbacks {
  @ApiProperty()
  @Prop({ required: true, type: String })
  suggestion_id: string;

  @ApiProperty({ enum: Object.values(FeedbackType) })
  @Prop({ required: true, enum: FeedbackType })
  type: FeedbackType;

  @ApiProperty()
  @Prop({ required: false, type: String })
  justification?: string;

  @ApiProperty()
  @Prop({ required: false, type: Date, default: Date.now })
  created_at: Date;
}

export const FeedbacksSchema = SchemaFactory.createForClass(Feedbacks);
