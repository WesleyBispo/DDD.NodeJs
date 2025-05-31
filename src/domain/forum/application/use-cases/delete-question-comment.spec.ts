import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'

describe('Delete Question Comment - Use Case', () => {
  let questionCommentsRepository: QuestionCommentsRepository
  let sut: DeleteQuestionCommentUseCase

  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(questionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const newQuestion = makeQuestionComment()

    await questionCommentsRepository.create(newQuestion)

    const { id } = newQuestion

    const questionBeforeDelete = questionCommentsRepository.findById(
      id.toString(),
    )

    expect(questionBeforeDelete).toBeTruthy()

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionCommentId: id.toString(),
    })

    const questionAfterDelete = await questionCommentsRepository.findById(
      id.toString(),
    )

    expect(questionAfterDelete).toBeFalsy()
  })

  it('should not be able to delete a question comment from another creator', async () => {
    const newQuestion = makeQuestionComment()

    await questionCommentsRepository.create(newQuestion)

    const { id } = newQuestion

    const questionBeforeDelete = questionCommentsRepository.findById(
      id.toString(),
    )

    expect(questionBeforeDelete).toBeTruthy()

    await expect(async () => {
      await sut.execute({
        authorId: 'another-author-id',
        questionCommentId: id.toString(),
      })
    }).rejects.toBeInstanceOf(Error)

    const questionAfterDelete = await questionCommentsRepository.findById(
      id.toString(),
    )

    expect(questionAfterDelete).toBeTruthy()
  })
})
