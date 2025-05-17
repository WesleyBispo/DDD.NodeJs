import { randomUUID } from 'node:crypto'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

describe('Create Question - Use Case', () => {
  let questionsRepository: QuestionsRepository
  let sut: CreateQuestionUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('create a question', async () => {
    const { question } = await sut.execute({
      authorId: randomUUID(),
      title: 'This a title',
      content: 'This is an question',
    })

    expect(question.id).toBeTruthy()
    expect(question.title).toBe('This a title')
    expect(question.slug.value).toBe('this-a-title')
    expect(question.content).toEqual('This is an question')
  })
})
