import { QuestionsRepository } from '../repositories/questions-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'

describe('Comment On Question - Use Case', () => {
  let sut: CommentOnQuestionUseCase
  let questionCommentsRepository: QuestionCommentsRepository
  let questionsRepository: QuestionsRepository

  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new CommentOnQuestionUseCase(
      questionsRepository,
      questionCommentsRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()
    await questionsRepository.create(question)

    const { questionComment } = await sut.execute({
      authorId: question.authorId.toString(),
      questionId: question.id.toString(),
      content: 'test-comment-question',
    })

    expect(questionComment).toBeTruthy()
  })

  it('should not be able to create comment if question not found', async () => {
    await expect(async () => {
      await sut.execute({
        authorId: 'another-author-id',
        questionId: 'id',
        content: 'not found',
      })
    }).rejects.toThrow('Question not found')
  })
})
