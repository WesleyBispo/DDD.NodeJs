import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

describe('Fetch Answer Comments - Use Case', () => {
  let answersCommentsRepository: AnswerCommentsRepository
  let answersRepository: AnswersRepository
  let sut: FetchAnswerCommentsUseCase

  beforeEach(() => {
    answersCommentsRepository = new InMemoryAnswerCommentsRepository()
    answersRepository = new InMemoryAnswersRepository()
    sut = new FetchAnswerCommentsUseCase(answersCommentsRepository)
  })

  it('should be able to fetch answer comments cby answer', async () => {
    const answer = makeAnswer()
    await answersRepository.create(answer)

    const answer1 = makeAnswerComment({
      answerId: answer.id,
    })

    const answer2 = makeAnswerComment({
      answerId: answer.id,
    })

    await answersCommentsRepository.create(answer1)
    await answersCommentsRepository.create(answer2)

    const { comments } = await sut.execute({
      answerId: answer.id.toString(),
      page: 1,
    })

    expect(comments).toHaveLength(2)
  })
})
