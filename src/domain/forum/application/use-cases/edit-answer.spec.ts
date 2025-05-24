import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answer'

describe('Edit Answer - Use Case', () => {
  let answersRepository: AnswersRepository
  let sut: EditAnswerUseCase

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(answersRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer()

    await answersRepository.create(newAnswer)

    const { id } = newAnswer

    const answerBeforeEdit = await answersRepository.findById(id.toString())

    expect(answerBeforeEdit).toBeTruthy()
    expect(answerBeforeEdit?.content).toBe(newAnswer.content)

    await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerId: id.toString(),
      content: 'New content',
    })

    const answerAfterEdit = await answersRepository.findById(id.toString())

    expect(answerAfterEdit).toBeTruthy()
    expect(answerAfterEdit?.content).toBe('New content')
  })

  it('should not be able to edit a answer from another creator', async () => {
    const newAnswer = makeAnswer()

    await answersRepository.create(newAnswer)

    const { id } = newAnswer

    const answerBeforeEdit = answersRepository.findById(id.toString())

    expect(answerBeforeEdit).toBeTruthy()

    await expect(async () => {
      await sut.execute({
        authorId: 'another-author-id',
        answerId: id.toString(),
        content: 'New content',
      })
    }).rejects.toBeInstanceOf(Error)

    const answerAfterEdit = await answersRepository.findById(id.toString())

    expect(answerAfterEdit).toBeTruthy()
  })
})
