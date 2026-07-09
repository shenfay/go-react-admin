-- ============================================
-- 创建消息表（站内信）
-- ============================================

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID,                        -- 发送者（系统通知为 NULL）
    recipient_id UUID NOT NULL,            -- 接收者
    type VARCHAR(20) NOT NULL,             -- 'system' | 'companion'
    category VARCHAR(30) NOT NULL,         -- 业务分类
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    ref_type VARCHAR(30),                  -- 关联实体类型：card/goal/companion/shop_order
    ref_id UUID,                           -- 关联实体 ID
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 按接收者查询（消息列表 + 未读计数）
CREATE INDEX idx_messages_recipient ON messages(recipient_id, is_read, created_at DESC);
-- 按类型+分类筛选
CREATE INDEX idx_messages_type_category ON messages(type, category);
