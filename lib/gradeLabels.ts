export function getGradeLabel(grade: number): string {
  const labels: Record<number, string> = {
    1: '中学1年生',
    2: '中学2年生',
    3: '中学3年生',
    4: '高校1年生',
    5: '高校2年生',
    6: '高校3年生'
  }
  return labels[grade] || `学年 ${grade}`
}
