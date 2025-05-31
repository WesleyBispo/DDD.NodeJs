import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { makeQuestion } from 'test/factories/make-question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

describe('Fetch Question Answers - Use Case', () => {
  let answersRepository: AnswersRepository
  let questionsRepository: QuestionsRepository
  let sut: FetchQuestionAnswersUseCase

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchQuestionAnswersUseCase(answersRepository)
  })

  it('should be able to fetch answers by question', async () => {
    const question = makeQuestion()
    await questionsRepository.create(question)

    const answer1 = makeAnswer({
      questionId: question.id,
    })

    const answer2 = makeAnswer({
      questionId: question.id,
    })

    await answersRepository.create(answer1)
    await answersRepository.create(answer2)

    const { answers } = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    })

    expect(answers).toHaveLength(2)
  })
})
