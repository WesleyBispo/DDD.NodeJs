import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { makeAnswer } from 'test/factories/make-answer'

describe('Choose Question Best Answer - Use Case', () => {
  let sut: ChooseQuestionBestAnswerUseCase
  let answersRepository: AnswersRepository
  let questionsRepository: QuestionsRepository

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      answersRepository,
      questionsRepository,
    )
  })

  it('should be able to choose a best answer for a question', async () => {
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

    const questionBeforeChoosing = await questionsRepository.findById(
      question.id.toString(),
    )

    expect(questionBeforeChoosing).toBeTruthy()
    expect(questionBeforeChoosing?.bestAnswerId).toBeFalsy()

    await sut.execute({
      answerId: answer1.id.toString(),
      authorId: question.authorId.toString(),
    })

    const questionAfterChoosing = await questionsRepository.findById(
      question.id.toString(),
    )

    expect(questionAfterChoosing).toBeTruthy()
    expect(questionAfterChoosing?.bestAnswerId).toEqual(answer1.id)
  })

  it('should not be able to choose a best answer for a question by another author', async () => {
    const question = makeQuestion()
    await questionsRepository.create(question)

    const answer = makeAnswer({
      questionId: question.id,
    })

    await answersRepository.create(answer)

    await expect(async () => {
      await sut.execute({
        answerId: answer.id.toString(),
        authorId: 'another-author-id',
      })
    }).rejects.toThrow('Only the question author can choose the best answer')
  })
})
