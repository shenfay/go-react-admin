-- ============================================
-- 迁移到 Casbin 权限引擎
-- ============================================

-- 1. 创建 casbin_rule 表（gorm-adapter 所需格式）
CREATE TABLE IF NOT EXISTS casbin_rule (
    id    SERIAL PRIMARY KEY,
    ptype VARCHAR(100) NOT NULL,
    v0    VARCHAR(100) NOT NULL DEFAULT '',
    v1    VARCHAR(100) NOT NULL DEFAULT '',
    v2    VARCHAR(100) NOT NULL DEFAULT '',
    v3    VARCHAR(100) NOT NULL DEFAULT '',
    v4    VARCHAR(100) NOT NULL DEFAULT '',
    v5    VARCHAR(100) NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_casbin_rule_ptype ON casbin_rule(ptype);

COMMENT ON TABLE casbin_rule IS 'Casbin 策略规则表';

-- 2. 迁移 role_permissions → casbin_rule (p 规则)
-- 格式: p, role_id, permission_key
INSERT INTO casbin_rule (ptype, v0, v1)
SELECT 'p', role_id, permission_key
FROM role_permissions
ON CONFLICT DO NOTHING;

-- 3. 迁移 user_roles → casbin_rule (g 规则)
-- 格式: g, user_id, role_id
INSERT INTO casbin_rule (ptype, v0, v1)
SELECT 'g', user_id, role_id
FROM user_roles
ON CONFLICT DO NOTHING;

-- 4. 删除旧的 role_permissions 表
DROP TABLE IF EXISTS role_permissions;
