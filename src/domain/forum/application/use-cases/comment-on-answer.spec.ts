import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

describe('Comment On Answer - Use Case', () => {
  let sut: CommentOnAnswerUseCase
  let answerCommentsRepository: AnswerCommentsRepository
  let answersRepository: AnswersRepository

  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    answersRepository = new InMemoryAnswersRepository()
    sut = new CommentOnAnswerUseCase(
      answersRepository,
      answerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()
    await answersRepository.create(answer)

    const { answerComment } = await sut.execute({
      authorId: answer.authorId.toString(),
      answerId: answer.id.toString(),
      content: 'test-comment-answer',
    })

    expect(answerComment).toBeTruthy()
  })

  it('should not be able to create comment if answer not found', async () => {
    await expect(async () => {
      await sut.execute({
        authorId: 'another-author-id',
        answerId: 'id',
        content: 'not found',
      })
    }).rejects.toThrow('Answer not found')
  })
})
