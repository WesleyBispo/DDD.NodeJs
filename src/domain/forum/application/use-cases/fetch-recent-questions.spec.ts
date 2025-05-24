import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

describe('Fetch Recent Questions - Use Case', () => {
  let questionsRepository: QuestionsRepository
  let sut: FetchRecentQuestionsUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(questionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await questionsRepository.create(
      makeQuestion({
        createdAt: new Date(2023, 0, 1),
      }),
    )
    await questionsRepository.create(
      makeQuestion({
        createdAt: new Date(2024, 0, 1),
      }),
    )
    await questionsRepository.create(
      makeQuestion({
        createdAt: new Date(2025, 0, 1),
      }),
    )

    const { questions } = await sut.execute({
      page: 1,
    })

    expect(questions).toHaveLength(3)
    expect(questions[0].createdAt).toEqual(new Date(2025, 0, 1))
    expect(questions[1].createdAt).toEqual(new Date(2024, 0, 1))
    expect(questions[2].createdAt).toEqual(new Date(2023, 0, 1))
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 50; i++) {
      await questionsRepository.create(makeQuestion())
    }

    const { questions } = await sut.execute({
      page: 1,
    })

    expect(questions).toHaveLength(20)

    const { questions: nextPageQuestions } = await sut.execute({
      page: 2,
    })

    expect(nextPageQuestions).toHaveLength(20)

    const { questions: lastPageQuestions } = await sut.execute({
      page: 3,
    })

    expect(lastPageQuestions).toHaveLength(10)
  })
})
