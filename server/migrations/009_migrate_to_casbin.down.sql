-- ============================================
-- 回滚：从 Casbin 恢复到 role_permissions
-- ============================================

-- 1. 重新创建 role_permissions 表
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_key VARCHAR(100) NOT NULL,
    menu_key VARCHAR(100) DEFAULT '',
    UNIQUE(role_id, permission_key)
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);

-- 2. 从 casbin_rule 恢复 role_permissions
INSERT INTO role_permissions (role_id, permission_key)
SELECT DISTINCT v0, v1
FROM casbin_rule
WHERE ptype = 'p'
ON CONFLICT (role_id, permission_key) DO NOTHING;

-- 3. 删除 casbin_rule 表
DROP TABLE IF EXISTS casbin_rule;
