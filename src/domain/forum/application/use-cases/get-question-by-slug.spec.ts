import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'

describe('Get Question By Slug - Use Case', () => {
  let questionsRepository: QuestionsRepository
  let sut: GetQuestionBySlugUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('get a question by slug', async () => {
    const question = makeQuestion({
      slug: Slug.create('test-slug'),
    })
    await questionsRepository.create(question)

    const res = await sut.execute({
      slug: 'test-slug',
    })

    expect(res.question.id).toBeTruthy()
    expect(res.question.title).toBe(question.title)
    expect(res.question.slug.value).toBe('test-slug')
    expect(res.question.content).toEqual(question.content)
  })
})
