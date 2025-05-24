import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'

describe('Edit Question - Use Case', () => {
  let questionsRepository: QuestionsRepository
  let sut: EditQuestionUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(questionsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion()

    await questionsRepository.create(newQuestion)

    const { id } = newQuestion

    const questionBeforeEdit = await questionsRepository.findById(id.toString())

    expect(questionBeforeEdit).toBeTruthy()
    expect(questionBeforeEdit?.title).toBe(newQuestion.title)
    expect(questionBeforeEdit?.content).toBe(newQuestion.content)

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionId: id.toString(),
      title: 'New title',
      content: 'New content',
    })

    const questionAfterEdit = await questionsRepository.findById(id.toString())

    expect(questionAfterEdit).toBeTruthy()
    expect(questionAfterEdit?.title).toBe('New title')
    expect(questionAfterEdit?.content).toBe('New content')
  })

  it('should not be able to edit a question from another creator', async () => {
    const newQuestion = makeQuestion()

    await questionsRepository.create(newQuestion)

    const { id } = newQuestion

    const questionBeforeEdit = questionsRepository.findById(id.toString())

    expect(questionBeforeEdit).toBeTruthy()

    await expect(async () => {
      await sut.execute({
        authorId: 'another-author-id',
        questionId: id.toString(),
        title: 'New title',
        content: 'New content',
      })
    }).rejects.toBeInstanceOf(Error)

    const questionAfterEdit = await questionsRepository.findById(id.toString())

    expect(questionAfterEdit).toBeTruthy()
  })
})
