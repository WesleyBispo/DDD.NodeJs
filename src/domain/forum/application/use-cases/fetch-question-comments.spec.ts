import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionComment } from 'test/factories/make-question-comment'

describe('Fetch Question Comments - Use Case', () => {
  let questionCommentsRepository: QuestionCommentsRepository
  let questionsRepository: QuestionsRepository
  let sut: FetchQuestionCommentsUseCase

  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to fetch question comments by question', async () => {
    const question = makeQuestion()
    await questionsRepository.create(question)

    const answer1 = makeQuestionComment({
      questionId: question.id,
    })

    const answer2 = makeQuestionComment({
      questionId: question.id,
    })

    await questionCommentsRepository.create(answer1)
    await questionCommentsRepository.create(answer2)

    const { comments } = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    })

    expect(comments).toHaveLength(2)
  })
})
