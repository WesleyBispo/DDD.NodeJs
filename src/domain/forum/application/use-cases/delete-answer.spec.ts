import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from 'test/factories/make-answer'

describe('Delete Answer - Use Case', () => {
  let answersRepository: AnswersRepository
  let sut: DeleteAnswerUseCase

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(answersRepository)
  })

  it('should be able to delete a answer', async () => {
    const newAnswer = makeAnswer()

    await answersRepository.create(newAnswer)

    const { id } = newAnswer

    const answerBeforeDelete = answersRepository.findById(id.toString())

    expect(answerBeforeDelete).toBeTruthy()

    await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerId: id.toString(),
    })

    const answerAfterDelete = await answersRepository.findById(id.toString())

    expect(answerAfterDelete).toBeFalsy()
  })

  it('should not be able to delete a answer from another creator', async () => {
    const newAnswer = makeAnswer()

    await answersRepository.create(newAnswer)

    const { id } = newAnswer

    const answerBeforeDelete = answersRepository.findById(id.toString())

    expect(answerBeforeDelete).toBeTruthy()

    await expect(async () => {
      await sut.execute({
        authorId: 'another-author-id',
        answerId: id.toString(),
      })
    }).rejects.toBeInstanceOf(Error)

    const answerAfterDelete = await answersRepository.findById(id.toString())

    expect(answerAfterDelete).toBeTruthy()
  })
})
