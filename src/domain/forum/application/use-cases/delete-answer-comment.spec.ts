import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

describe('Delete Answer Comment - Use Case', () => {
  let answerCommentsRepository: AnswerCommentsRepository
  let sut: DeleteAnswerCommentUseCase

  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(answerCommentsRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const newAnswer = makeAnswerComment()

    await answerCommentsRepository.create(newAnswer)

    const { id } = newAnswer

    const answerBeforeDelete = answerCommentsRepository.findById(id.toString())

    expect(answerBeforeDelete).toBeTruthy()

    await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerCommentId: id.toString(),
    })

    const answerAfterDelete = await answerCommentsRepository.findById(
      id.toString(),
    )

    expect(answerAfterDelete).toBeFalsy()
  })

  it('should not be able to delete a answer comment from another creator', async () => {
    const newAnswer = makeAnswerComment()

    await answerCommentsRepository.create(newAnswer)

    const { id } = newAnswer

    const answerBeforeDelete = answerCommentsRepository.findById(id.toString())

    expect(answerBeforeDelete).toBeTruthy()

    await expect(async () => {
      await sut.execute({
        authorId: 'another-author-id',
        answerCommentId: id.toString(),
      })
    }).rejects.toBeInstanceOf(Error)

    const answerAfterDelete = await answerCommentsRepository.findById(
      id.toString(),
    )

    expect(answerAfterDelete).toBeTruthy()
  })
})
