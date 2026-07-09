/**
 * 消息管理 API
 */
import request from '@/utils/request'

export interface MessageRecord {
  id: string
  sender_id: string | null
  recipient_id: string
  type: 'system' | 'companion'
  category: string
  title: string
  content: string
  is_read: boolean
  read_at: string | null
  ref_type: string | null
  ref_id: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface MessageListResponse {
  messages: MessageRecord[]
  total: number
}

/** 管理员获取所有消息列表 */
export async function getMessages(params: {
  type?: string
  category?: string
  limit?: number
  offset?: number
}): Promise<MessageListResponse> {
  return request.get('/v1/admin/messages', { params })
}
