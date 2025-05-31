import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
  create(questionComment: AnswerComment): Promise<void>
}
