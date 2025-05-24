import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { makeQuestion } from 'test/factories/make-question'

describe('Delete Question - Use Case', () => {
  let questionsRepository: QuestionsRepository
  let sut: DeleteQuestionUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(questionsRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion()

    await questionsRepository.create(newQuestion)

    const { id } = newQuestion

    const questionBeforeDelete = questionsRepository.findById(id.toString())

    expect(questionBeforeDelete).toBeTruthy()

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionId: id.toString(),
    })

    const questionAfterDelete = await questionsRepository.findById(
      id.toString(),
    )

    expect(questionAfterDelete).toBeFalsy()
  })

  it('should not be able to delete a question from another creator', async () => {
    const newQuestion = makeQuestion()

    await questionsRepository.create(newQuestion)

    const { id } = newQuestion

    const questionBeforeDelete = questionsRepository.findById(id.toString())

    expect(questionBeforeDelete).toBeTruthy()

    await expect(async () => {
      await sut.execute({
        authorId: 'another-author-id',
        questionId: id.toString(),
      })
    }).rejects.toBeInstanceOf(Error)

    const questionAfterDelete = await questionsRepository.findById(
      id.toString(),
    )

    expect(questionAfterDelete).toBeTruthy()
  })
})
