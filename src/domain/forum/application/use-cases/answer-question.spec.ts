import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { randomUUID } from 'node:crypto'

describe('Answer Question - Use Case', () => {
  let answersRepository: AnswersRepository
  let sut: AnswerQuestionUseCase

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(answersRepository)
  })

  it('create an answer', async () => {
    const answer = await sut.execute({
      instructorId: randomUUID(),
      questionId: randomUUID(),
      content: 'This is an answer',
    })

    expect(answer.id).toBeTruthy()
    expect(answer.content).toEqual('This is an answer')
  })
})
