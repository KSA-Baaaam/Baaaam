/** 홈·카테고리·상세 화면에서 공통으로 쓰는 표시용 포맷터. */
export const koDateFormatter = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' })
export const koDateTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})
export const koNumberFormatter = new Intl.NumberFormat('ko-KR')
