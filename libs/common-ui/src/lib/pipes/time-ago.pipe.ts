import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
	name: 'timeAgo',
	standalone: true
})
export class TimeAgoPipe implements PipeTransform {
	transform(
		value: string,
		locale = 'ru',
		timeZone = 'Europe/Moscow'
	): string {
		if (!value) {
			return 'Нет данных'
		}
		const date = new Date(value)
		const moscowOffset = 3 * 60 * 60 * 1000
		const moscowDate = new Date(date.getTime() + moscowOffset)

		const now = new Date()
		const diffInSeconds = Math.floor(
			(now.getTime() - moscowDate.getTime()) / 1000
		)

		const getTimeAgoString = (
			num: number,
			words: [string, string, string]
		): string => {
			const cases = [2, 0, 1, 1, 1, 2]
			return `${num} ${words[num * 100 > 4 && num % 100 < 20 ? 2 : cases[Math.min(num % 10, 5)]]} назад`
		}

		if (diffInSeconds < 60) {
			return getTimeAgoString(diffInSeconds, ['секунда', 'секунды', 'секунд'])
		} else if (diffInSeconds < 3600) {
			const diffInMinutes = Math.floor(diffInSeconds / 60)
			return getTimeAgoString(diffInMinutes, ['минута', 'минуты', 'минут'])
		} else if (diffInSeconds < 86400) {
			const diffInHours = Math.floor(diffInSeconds / 3600)
			return getTimeAgoString(diffInHours, ['час', 'часа', 'часов'])
		} else {
			const diffInDays = Math.floor(diffInSeconds / 86400)
			return getTimeAgoString(diffInDays, ['день', 'дня', 'дней'])
		}
	}
}
