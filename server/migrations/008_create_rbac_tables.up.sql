-- ============================================
-- RBAC 权限模型表
-- ============================================

-- 1. 角色表
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE roles IS '角色表';
COMMENT ON COLUMN roles.id IS '角色 ID (ULID)';
COMMENT ON COLUMN roles.name IS '角色名称';
COMMENT ON COLUMN roles.code IS '角色编码（唯一标识）';
COMMENT ON COLUMN roles.description IS '角色描述';
COMMENT ON COLUMN roles.status IS '是否启用';

-- 2. 用户角色关联表（多对多）
CREATE TABLE IF NOT EXISTS user_roles (
    user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

COMMENT ON TABLE user_roles IS '用户角色关联表';

-- 3. 角色权限表
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_key VARCHAR(100) NOT NULL,
    menu_key VARCHAR(100) DEFAULT '',
    UNIQUE(role_id, permission_key)
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);

COMMENT ON TABLE role_permissions IS '角色权限表';
COMMENT ON COLUMN role_permissions.permission_key IS '权限标识，如 dashboard:view';
COMMENT ON COLUMN role_permissions.menu_key IS '关联菜单 key，如 dashboard';

-- ============================================
-- 插入默认角色
-- ============================================
INSERT INTO roles (id, name, code, description, status) VALUES
    ('role_admin', '管理员', 'admin', '系统管理员，拥有所有权限', TRUE),
    ('role_operator', '运营', 'operator', '运营人员，管理业务内容', TRUE),
    ('role_viewer', '观察员', 'viewer', '只读角色，仅可查看部分内容', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 插入管理员权限（全量）
-- ============================================
INSERT INTO role_permissions (role_id, permission_key, menu_key) VALUES
    ('role_admin', 'dashboard:view', 'dashboard'),
    ('role_admin', 'family:manage', 'family'),
    ('role_admin', 'goal:manage', 'goals'),
    ('role_admin', 'card_template:manage', 'card-templates'),
    ('role_admin', 'card_instance:view', 'card-instances'),
    ('role_admin', 'companion:manage', 'companions'),
    ('role_admin', 'acceptance:manage', 'acceptance'),
    ('role_admin', 'points:view', 'points'),
    ('role_admin', 'shop_item:manage', 'shop-items'),
    ('role_admin', 'exchange_order:manage', 'exchange-orders'),
    ('role_admin', 'user:manage', 'user-management'),
    ('role_admin', 'permission:manage', 'permission-management'),
    ('role_admin', 'profile:view', 'profile'),
    ('role_admin', 'operation:log', 'operation-log'),
    ('role_admin', 'setting:manage', 'system-settings')
ON CONFLICT (role_id, permission_key) DO NOTHING;

-- ============================================
-- 插入运营权限
-- ============================================
INSERT INTO role_permissions (role_id, permission_key, menu_key) VALUES
    ('role_operator', 'dashboard:view', 'dashboard'),
    ('role_operator', 'family:manage', 'family'),
    ('role_operator', 'goal:manage', 'goals'),
    ('role_operator', 'card_template:manage', 'card-templates'),
    ('role_operator', 'card_instance:view', 'card-instances'),
    ('role_operator', 'companion:manage', 'companions'),
    ('role_operator', 'acceptance:manage', 'acceptance'),
    ('role_operator', 'points:view', 'points'),
    ('role_operator', 'shop_item:manage', 'shop-items'),
    ('role_operator', 'exchange_order:manage', 'exchange-orders'),
    ('role_operator', 'profile:view', 'profile')
ON CONFLICT (role_id, permission_key) DO NOTHING;

-- ============================================
-- 插入观察员权限
-- ============================================
INSERT INTO role_permissions (role_id, permission_key, menu_key) VALUES
    ('role_viewer', 'dashboard:view', 'dashboard'),
    ('role_viewer', 'card_instance:view', 'card-instances'),
    ('role_viewer', 'points:view', 'points'),
    ('role_viewer', 'profile:view', 'profile')
ON CONFLICT (role_id, permission_key) DO NOTHING;

-- ============================================
-- 为已有用户分配管理员角色
-- ============================================
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, 'role_admin'
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role_id = 'role_admin'
)
LIMIT 1;
