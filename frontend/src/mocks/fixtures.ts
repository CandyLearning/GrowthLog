import type { UserProfile } from '@/lib/types/auth.schema'
import type { Goal } from '@/lib/types/goal.schema'
import type { LearningRecord } from '@/lib/types/record.schema'
import type { MoodEntry } from '@/lib/types/mood.schema'
import type { GratitudeEntry } from '@/lib/types/gratitude.schema'
import type { Pet } from '@/lib/types/pet.schema'

// From: specs/features/auth/Google登入.feature — Given 系統中有以下使用者
export const mockUser: UserProfile = {
  user_id: 1,
  display_name: '小明',
  avatar_url: 'https://lh3.google.com/photo1',
}

// From: specs/features/learning-goal/查看學習目標.feature — Given 系統中有以下學習目標
// Sorted by end_date ascending (closest deadline first); nulls last
export const mockGoals: Goal[] = [
  {
    goal_id: 1,
    title: '學 Python',
    description: '從基礎開始學',
    start_date: '2026-05-01',
    end_date: '2026-08-31',
    status: 'in_progress',
  },
  {
    goal_id: 2,
    title: '學 SQL',
    status: 'not_started',
  },
]

// From: specs/features/learning-record/查看學習紀錄.feature — Given 系統中有以下學習紀錄
// Sorted by entry_date descending (newest first)
export const mockRecords: LearningRecord[] = [
  { record_id: 2, title: '紀錄二', content: 'list 操作', entry_date: '2026-05-08' },
  { record_id: 1, title: '紀錄一', content: '基礎語法', entry_date: '2026-05-07' },
]

// From: specs/features/mood/查看心情紀錄.feature — Given 系統中有以下心情紀錄
// Sorted by entry_date descending (newest first)
export const mockMoodEntries: MoodEntry[] = [
  { entry_id: 2, mood_type: 'sad', note: '今天很難過', entry_date: '2026-05-08' },
  { entry_id: 1, mood_type: 'happy', entry_date: '2026-05-07' },
]

// From: specs/features/gratitude/查看感謝日記.feature — Given 系統中有以下感謝條目
// Sorted by entry_date descending (newest first)
export const mockGratitudeEntries: GratitudeEntry[] = [
  { entry_id: 2, content: '感謝今天的朋友', entry_date: '2026-05-08' },
  { entry_id: 3, content: '感謝今天的咖啡', entry_date: '2026-05-08' },
  { entry_id: 1, content: '感謝昨天的陽光', entry_date: '2026-05-07' },
]

// From: specs/features/pet/查看電子寵物.feature — Given 系統中有以下電子寵物
export const mockPet: Pet = {
  species: 'capybara',
  pet_name: '小玉',
  happiness: 80,
  fullness: 60,
  level: 2,
}
