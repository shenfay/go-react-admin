import { useState } from 'react'
import {
  Tag,
  Button,
  Input,
  Select,
  Switch,
  Table,
  Typography,
  Space,
  Tabs,
  Progress,
  Alert,
  Badge,
  Avatar,
  Card,
  Descriptions,
  Empty,
  Skeleton,
  Tooltip,
  Popover,
  Breadcrumb,
  Radio,
  Checkbox,
  InputNumber,
  DatePicker,
  Rate,
  Steps,
  Divider,
  Row,
  Col,
  Modal,
  Statistic,
  Timeline,
} from 'antd'
import DataPanel from '@/components/DataPanel'

const { Title, Text } = Typography

// ─── Shared Helpers ───────────────────────────────

function SectionTitle({ children }: { children: string }) {
  return (
    <Title level={4} style={{ margin: 0, marginBottom: 20, fontSize: 16 }}>
      {children}
    </Title>
  )
}

function Swatch({ color, name, variable }: { color: string; name: string; variable: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: color,
          border: color === '#ffffff' ? '1px solid var(--border-color)' : 'none',
          flexShrink: 0,
          boxShadow: color.startsWith('rgba') ? 'inset 0 0 0 1px var(--border-color)' : 'none',
        }}
      />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{variable}</div>
        <Text style={{ fontSize: 12, color: 'var(--text-muted)' }}>{color}</Text>
      </div>
    </div>
  )
}

// ─── Colors ───────────────────────────────────────

const colorGroups = [
  {
    title: '品牌色',
    items: [
      { name: '品牌深色', variable: '--brand-dark', color: '#2b2b2b' },
      { name: '品牌深色-hover', variable: '--brand-dark-hover', color: '#4d4d4d' },
    ],
  },
  {
    title: '文字色',
    items: [
      { name: '主要文字', variable: '--text-primary', color: '#2b2b2b' },
      { name: '次要文字', variable: '--text-secondary', color: '#6b6258' },
      { name: '辅助文字', variable: '--text-muted', color: '#b0a89a' },
      { name: '图标色', variable: '--text-icon', color: '#c4bdb0' },
    ],
  },
  {
    title: '边框',
    items: [
      { name: '默认边框', variable: '--border-color', color: '#e8e2d8' },
      { name: '悬浮边框', variable: '--border-hover', color: '#d4cdc0' },
      { name: '浅边框', variable: '--border-light', color: '#efeae2' },
      { name: '分割线', variable: '--divider', color: '#f5f2ed' },
    ],
  },
  {
    title: '背景色',
    items: [
      { name: '纯白', variable: '--bg-white', color: '#ffffff' },
      { name: '侧边栏', variable: '--sidebar-bg', color: '#F5F3EF' },
      { name: '悬浮(深)', variable: '--hover-bg', color: '#f0ece6' },
      { name: '悬浮(浅)', variable: '--hover-bg-light', color: '#f5f2ed' },
      { name: '激活', variable: '--active-bg', color: '#E4E0D8' },
    ],
  },
  {
    title: '状态色',
    items: [
      { name: '成功/活跃', variable: '--green', color: '#22c55e' },
      { name: '失败/异常', variable: '--red', color: '#e74c3c' },
      { name: '待处理', variable: '--yellow', color: '#f59e0b' },
      { name: '信息', variable: '--blue', color: '#3b6fdf' },
      { name: '默认/禁用', variable: '--gray', color: '#6b6258' },
    ],
  },
]

// ─── Tab 1: 基础规范 ──────────────────────────────

function BaseSpecs() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* 色彩体系 */}
      <div>
        <SectionTitle>色彩体系</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {colorGroups.map(group => (
            <div key={group.title}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: 10,
                  display: 'block',
                }}
              >
                {group.title}
              </Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                {group.items.map(item => (
                  <Swatch key={item.variable} {...item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* 排版层级 */}
      <div>
        <SectionTitle>排版层级</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Title style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            页面主标题 — 20px/600
          </Title>
          <Title style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
            卡片标题 — 14px/600
          </Title>
          <Text style={{ fontSize: 13, color: 'var(--text-primary)' }}>
            表格正文 / 一般文字 — 13px/400
          </Text>
          <Text style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
            表单标签 / 按钮文字 — 13px/500
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--table-header-text)',
            }}
          >
            表格表头 — 12px/600/UPPERCASE
          </Text>
          <Text style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>
            辅助文字 / 标签文字 — 12px/500
          </Text>
        </div>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* 圆角与阴影 */}
      <div>
        <SectionTitle>圆角与阴影</SectionTitle>
        <Row gutter={24}>
          <Col span={12}>
            <Card size="small" title="圆角" bordered={false} style={{ background: 'var(--bg-light)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: 'var(--brand-dark)',
                      borderRadius: 'var(--radius-sm)',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <Text style={{ fontSize: 13, fontWeight: 500 }}>--radius-sm: 8px</Text>
                    <br />
                    <Text style={{ fontSize: 12, color: 'var(--text-muted)' }}>按钮 / 输入框 / 标签 / 分页项</Text>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: 'var(--brand-dark)',
                      borderRadius: 'var(--radius-md)',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <Text style={{ fontSize: 13, fontWeight: 500 }}>--radius-md: 12px</Text>
                    <br />
                    <Text style={{ fontSize: 12, color: 'var(--text-muted)' }}>卡片 / DataPanel 内容区</Text>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: 'var(--brand-dark)',
                      borderRadius: 'var(--radius-lg)',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <Text style={{ fontSize: 13, fontWeight: 500 }}>--radius-lg: 16px</Text>
                    <br />
                    <Text style={{ fontSize: 12, color: 'var(--text-muted)' }}>预留 — 非标准大圆角场景</Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="阴影" bordered={false} style={{ background: 'var(--bg-light)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div
                  style={{
                    padding: '10px 14px',
                    background: '#fff',
                    borderRadius: 8,
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: 500 }}>--shadow-sm</Text>
                  <br />
                  <Text style={{ fontSize: 12, color: 'var(--text-muted)' }}>0 1px 3px rgba(0,0,0,0.06) — 备用</Text>
                </div>
                <div
                  style={{
                    padding: '10px 14px',
                    background: '#fff',
                    borderRadius: 8,
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: 500 }}>--shadow-md</Text>
                  <br />
                  <Text style={{ fontSize: 12, color: 'var(--text-muted)' }}>0 4px 12px rgba(0,0,0,0.08) — StatCard hover</Text>
                </div>
                <div
                  style={{
                    padding: '10px 14px',
                    background: '#fff',
                    borderRadius: 8,
                    boxShadow: 'var(--shadow-lg)',
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: 500 }}>--shadow-lg</Text>
                  <br />
                  <Text style={{ fontSize: 12, color: 'var(--text-muted)' }}>0 8px 24px rgba(0,0,0,0.12) — 预留</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

// ─── Tab 2: 组件展示 ──────────────────────────

function ComponentsShowcase() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* 按钮体系 */}
      <div>
        <SectionTitle>按钮体系</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Space wrap>
            <Button type="primary">主按钮 (Primary)</Button>
            <Button>次按钮 (Default)</Button>
            <Button type="text">文字按钮 (Text)</Button>
            <Button type="dashed">虚线按钮 (Dashed)</Button>
            <Button type="link">链接按钮 (Link)</Button>
            <Button type="primary" danger>
              危险按钮 (Danger)
            </Button>
          </Space>
          <Space wrap>
            <Button type="primary" size="small">
              小型主按钮
            </Button>
            <Button size="small">小型次按钮</Button>
            <Button type="primary" size="large">
              大型主按钮
            </Button>
            <Button size="large">大型次按钮</Button>
          </Space>
          <Space wrap>
            <Button type="primary" shape="round">
              圆角主按钮
            </Button>
            <Button shape="round">圆角次按钮</Button>
            <Button type="primary" disabled>
              主按钮禁用
            </Button>
            <Button disabled>次按钮禁用</Button>
            <Button type="primary" loading>
              加载中
            </Button>
          </Space>
        </div>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* 标签体系 */}
      <div>
        <SectionTitle>标签体系</SectionTitle>
        <Space wrap>
          <Tag color="green" style={{ background: 'var(--green-light)', color: 'var(--green-text)', border: 'none', borderRadius: 6 }}>
            通过
          </Tag>
          <Tag color="green" style={{ background: 'var(--green-light)', color: 'var(--green-text)', border: 'none', borderRadius: 6 }}>
            活跃
          </Tag>
          <Tag color="red" style={{ background: 'var(--red-light)', color: 'var(--red-text)', border: 'none', borderRadius: 6 }}>
            失败
          </Tag>
          <Tag color="red" style={{ background: 'var(--red-light)', color: 'var(--red-text)', border: 'none', borderRadius: 6 }}>
            异常
          </Tag>
          <Tag color="orange" style={{ background: 'var(--yellow-light)', color: 'var(--yellow-text)', border: 'none', borderRadius: 6 }}>
            待处理
          </Tag>
          <Tag color="blue" style={{ background: 'var(--blue-light)', color: 'var(--blue-text)', border: 'none', borderRadius: 6 }}>
            管理员
          </Tag>
          <Tag color="blue" style={{ background: 'var(--blue-light)', color: 'var(--blue-text)', border: 'none', borderRadius: 6 }}>
            编辑
          </Tag>
          <Tag style={{ background: 'var(--gray-light)', color: 'var(--gray-text)', border: 'none', borderRadius: 6 }}>
            未分配
          </Tag>
          <Tag style={{ background: 'var(--gray-light)', color: 'var(--gray-text)', border: 'none', borderRadius: 6 }}>
            观察员
          </Tag>
        </Space>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* 表单元素 */}
      <div>
        <SectionTitle>表单元素</SectionTitle>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ width: 200 }}>
            <Text style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              输入框
            </Text>
            <Input placeholder="请输入内容" />
          </div>
          <div style={{ width: 160 }}>
            <Text style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              选择器
            </Text>
            <Select
              placeholder="请选择"
              style={{ width: '100%' }}
              options={[
                { value: '1', label: '选项一' },
                { value: '2', label: '选项二' },
                { value: '3', label: '选项三' },
              ]}
            />
          </div>
          <div>
            <Text style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              数字输入
            </Text>
            <InputNumber placeholder="请输入数字" />
          </div>
          <div>
            <Text style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              日期选择
            </Text>
            <DatePicker />
          </div>
          <div>
            <Text style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              开关
            </Text>
            <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />
          </div>
          <div>
            <Text style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              单选框
            </Text>
            <Radio.Group defaultValue="a">
              <Radio value="a">选项 A</Radio>
              <Radio value="b">选项 B</Radio>
            </Radio.Group>
          </div>
          <div>
            <Text style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              多选框
            </Text>
            <Checkbox.Group options={['A', 'B', 'C']} defaultValue={['A']} />
          </div>
          <div>
            <Text style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              评分
            </Text>
            <Rate defaultValue={3} />
          </div>
        </div>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* 状态指示器 */}
      <div>
        <SectionTitle>状态指示器</SectionTitle>
        <Space size={24}>
          <Space>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--green)',
                display: 'inline-block',
              }}
            />
            <Text style={{ fontSize: 13, color: 'var(--text-primary)' }}>正常 / 已认证</Text>
          </Space>
          <Space>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--border-hover)',
                display: 'inline-block',
              }}
            />
            <Text style={{ fontSize: 13, color: 'var(--text-primary)' }}>异常 / 未验证</Text>
          </Space>
          <Space>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--green)',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--yellow)',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--red)',
                display: 'inline-block',
              }}
            />
            <Text style={{ fontSize: 13, color: 'var(--text-secondary)' }}>绿 / 黄 / 红 三色组合</Text>
          </Space>
        </Space>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* 进度条 */}
      <div>
        <SectionTitle>进度条</SectionTitle>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Progress percent={30} size="small" strokeColor="var(--brand-dark)" trailColor="var(--progress-bg)" />
            <Progress percent={60} size="small" strokeColor="var(--green)" trailColor="var(--progress-bg)" />
            <Progress percent={90} size="small" strokeColor="var(--blue)" trailColor="var(--progress-bg)" />
          </div>
          <Space size={16}>
            <Progress type="circle" percent={45} size={60} strokeColor="var(--brand-dark)" trailColor="var(--progress-bg)" />
            <Progress type="circle" percent={75} size={60} strokeColor="var(--green)" trailColor="var(--progress-bg)" />
            <Progress type="circle" percent={100} size={60} strokeColor="var(--blue)" trailColor="var(--progress-bg)" />
          </Space>
        </div>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* Alert */}
      <div>
        <SectionTitle>警告提示</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Alert message="Success 成功提示" type="success" showIcon />
          <Alert message="Info 信息提示" type="info" showIcon />
          <Alert message="Warning 警告提示" type="warning" showIcon />
          <Alert message="Error 错误提示" type="error" showIcon />
        </div>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* Badge + Avatar */}
      <div>
        <SectionTitle>徽标与头像</SectionTitle>
        <Space size={24} align="start">
          <div>
            <Text style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 10 }}>
              徽标 (Badge)
            </Text>
            <Space size={16}>
              <Badge count={5}>
                <Avatar shape="square" size={40} style={{ background: 'var(--gray-light)', color: 'var(--text-muted)' }}>
                  U
                </Avatar>
              </Badge>
              <Badge dot>
                <Avatar shape="square" size={40} style={{ background: 'var(--gray-light)', color: 'var(--text-muted)' }}>
                  U
                </Avatar>
              </Badge>
              <Badge count={99} overflowCount={99}>
                <Avatar shape="square" size={40} style={{ background: 'var(--gray-light)', color: 'var(--text-muted)' }}>
                  U
                </Avatar>
              </Badge>
            </Space>
          </div>
          <div>
            <Text style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 10 }}>
              头像 (Avatar)
            </Text>
            <Space size={12}>
              <Avatar size={32} style={{ background: 'linear-gradient(135deg, #4ECDC4, #44B09E)' }}>
                K
              </Avatar>
              <Avatar size={32} style={{ background: 'var(--blue)' }}>
                A
              </Avatar>
              <Avatar size={32} style={{ background: 'var(--green)' }}>
                B
              </Avatar>
              <Avatar size={32} style={{ background: 'var(--gray-light)', color: 'var(--text-muted)' }}>
                G
              </Avatar>
            </Space>
          </div>
        </Space>
      </div>
    </div>
  )
}

// ─── Tab 3: 数据展示 ────────────────────────────────

const demoColumns = [
  { title: '用户', dataIndex: 'name', key: 'name', width: 160 },
  { title: '邮箱', dataIndex: 'email', key: 'email', width: 240 },
  { title: '角色', dataIndex: 'role', key: 'role', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 100 },
]

const demoData = [
  {
    key: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: <Tag style={{ background: 'var(--blue-light)', color: 'var(--blue-text)', border: 'none', borderRadius: 6 }}>管理员</Tag>,
    status: <span style={{ color: 'var(--green)' }}>活跃</span>,
    action: <Button type="link" size="small" style={{ color: 'var(--text-secondary)' }}>编辑</Button>,
  },
  {
    key: '2',
    name: '李四',
    email: 'lisi@example.com',
    role: <Tag style={{ background: 'var(--gray-light)', color: 'var(--gray-text)', border: 'none', borderRadius: 6 }}>观察员</Tag>,
    status: <span style={{ color: 'var(--green)' }}>活跃</span>,
    action: <Button type="link" size="small" style={{ color: 'var(--text-secondary)' }}>编辑</Button>,
  },
  {
    key: '3',
    name: '王五',
    email: 'wangwu@example.com',
    role: <Tag style={{ background: 'var(--yellow-light)', color: 'var(--yellow-text)', border: 'none', borderRadius: 6 }}>待审核</Tag>,
    status: <span style={{ color: 'var(--yellow)' }}>待处理</span>,
    action: <Button type="link" size="small" style={{ color: 'var(--text-secondary)' }}>编辑</Button>,
  },
  {
    key: '4',
    name: '赵六',
    email: 'zhaoliu@example.com',
    role: <Tag style={{ background: 'var(--red-light)', color: 'var(--red-text)', border: 'none', borderRadius: 6 }}>已禁用</Tag>,
    status: <span style={{ color: 'var(--red)' }}>异常</span>,
    action: <Button type="link" size="small" style={{ color: 'var(--text-secondary)' }}>编辑</Button>,
  },
]

function DataDisplay() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* 表格 */}
      <div>
        <SectionTitle>表格</SectionTitle>
        <Table
          columns={demoColumns}
          dataSource={demoData}
          pagination={{
            pageSize: 4,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t: number) => `共 ${t} 条`,
          }}
          size="middle"
        />
      </div>

      <Divider style={{ margin: 0 }} />

      {/* 卡片 */}
      <div>
        <SectionTitle>卡片</SectionTitle>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="默认卡片" size="small">
              <Text>卡片内容区域，展示基本的信息卡片样式。</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="带操作卡片"
              size="small"
              extra={<Button type="link" size="small" style={{ color: 'var(--text-secondary)' }}>更多</Button>}
            >
              <Text>带 extra 操作的卡片，通常用于列表或详情入口。</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              size="small"
              style={{ background: 'var(--bg-light)' }}
              styles={{ body: { padding: 20 } }}
            >
              <Statistic title="今日新增用户" value={128} suffix="人" />
              <div style={{ marginTop: 8 }}>
                <Text style={{ fontSize: 12, color: 'var(--green)' }}>↑ 12.5%</Text>
                <Text style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 6 }}>较昨日</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* 描述列表 */}
      <div>
        <SectionTitle>描述列表</SectionTitle>
        <Descriptions
          column={2}
          size="small"
          bordered
          style={{ background: '#fff' }}
        >
          <Descriptions.Item label="用户名">admin</Descriptions.Item>
          <Descriptions.Item label="邮箱">admin@kiqi.app</Descriptions.Item>
          <Descriptions.Item label="角色">创始人</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color="green" style={{ background: 'var(--green-light)', color: 'var(--green-text)', border: 'none', borderRadius: 6 }}>
              正常
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">2024-01-15</Descriptions.Item>
          <Descriptions.Item label="最后登录">2026-07-08</Descriptions.Item>
        </Descriptions>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* 空状态 */}
      <div>
        <SectionTitle>空状态</SectionTitle>
        <Space size={24}>
          <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          <Empty description="暂无搜索结果" />
        </Space>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* 时间线 */}
      <div>
        <SectionTitle>时间线</SectionTitle>
        <Timeline
          items={[
            { color: 'var(--green)', children: '创建项目 2024-01-15' },
            { color: 'var(--blue)', children: '完成用户模块 2024-03-20' },
            { color: 'var(--yellow)', children: '上线权限系统 2024-06-01' },
            { color: 'var(--red)', children: '修复安全漏洞 2024-08-10' },
            { color: 'gray', children: '版本 v2.0 发布 2025-01-01' },
          ]}
        />
      </div>
    </div>
  )
}

// ─── Tab 4: 交互反馈 ─────────────────────────────

function InteractionFeedback() {
  const [modalOpen, setModalOpen] = useState(false)

  const hoverStates = [
    { element: '主按钮 (Primary)', normal: '#2b2b2b', hover: '#4d4d4d', direction: '变浅' },
    { element: '次按钮 (Default)', normal: 'transparent', hover: '#f5f2ed', direction: '显现填充' },
    { element: '分页项 (非激活)', normal: 'transparent', hover: '#f5f2ed 背景 / #d4cdc0 边框', direction: '显现填充' },
    { element: '表格行', normal: '—', hover: '#faf8f5', direction: '显现浅背景' },
    { element: '菜单项', normal: 'transparent', hover: '#E4E0D8', direction: '加深' },
    { element: '文字按钮', normal: 'transparent', hover: '#E4E0D8', direction: '显现填充' },
  ]

  const hoverColumns = [
    { title: '元素', dataIndex: 'element', key: 'element', width: 200 },
    { title: 'Normal', dataIndex: 'normal', key: 'normal', width: 160 },
    { title: 'Hover', dataIndex: 'hover', key: 'hover', width: 280 },
    { title: '方向', dataIndex: 'direction', key: 'direction', width: 100 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Hover 状态矩阵 */}
      <div>
        <SectionTitle>Hover 状态矩阵</SectionTitle>
        <Table
          columns={hoverColumns}
          dataSource={hoverStates}
          pagination={false}
          size="small"
        />
      </div>

      <Divider style={{ margin: 0 }} />

      {/* Tooltip & Popover */}
      <div>
        <SectionTitle>提示与气泡</SectionTitle>
        <Space size={16}>
          <Tooltip title="这是 Tooltip 提示文本">
            <Button>Tooltip 悬停</Button>
          </Tooltip>
          <Popover content="这是 Popover 气泡卡片内容" title="标题">
            <Button>Popover 点击</Button>
          </Popover>
          <Tooltip title="编辑用户信息" placement="bottom">
            <Button type="primary" size="small">
              编辑
            </Button>
          </Tooltip>
        </Space>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* Skeleton */}
      <div>
        <SectionTitle>骨架屏</SectionTitle>
        <div style={{ maxWidth: 400 }}>
          <Skeleton active paragraph={{ rows: 3 }} />
        </div>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* Modal */}
      <div>
        <SectionTitle>弹窗</SectionTitle>
        <Button
          onClick={() => setModalOpen(true)}
          style={{ color: 'var(--text-secondary)' }}
        >
          打开弹窗
        </Button>
        <Modal
          title="弹窗示例"
          open={modalOpen}
          onOk={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
          width={420}
        >
          <Text>这是 Modal 弹窗的内容区域，展示弹窗交互效果。</Text>
        </Modal>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* 步骤条 */}
      <div>
        <SectionTitle>步骤条</SectionTitle>
        <Steps
          current={1}
          items={[
            { title: '创建工单', description: '提交申请' },
            { title: '审核中', description: '等待处理' },
            { title: '已完成', description: '流程结束' },
          ]}
          size="small"
        />
      </div>

      <Divider style={{ margin: 0 }} />

      {/* 面包屑 */}
      <div>
        <SectionTitle>面包屑</SectionTitle>
        <Breadcrumb
          items={[
            { title: '首页' },
            { title: '系统管理' },
            { title: '用户管理', href: '' },
          ]}
        />
      </div>
    </div>
  )
}

// ─── Tab 5: CSS 变量 ────────────────────────────

const variableCategories = [
  {
    title: '布局',
    items: [
      { name: '--sidebar-bg', value: '#F5F3EF', desc: '侧边栏背景色' },
      { name: '--main-bg', value: '#FFFFFF', desc: '主内容区背景色' },
    ],
  },
  {
    title: '字体',
    items: [
      { name: '--font-family', value: '-apple-system, "PingFang SC"...', desc: '字体栈' },
      { name: '--text-primary', value: '#2b2b2b', desc: '主要文字色' },
      { name: '--text-secondary', value: '#6b6258', desc: '次要文字色' },
      { name: '--text-muted', value: '#b0a89a', desc: '辅助文字色' },
      { name: '--text-icon', value: '#c4bdb0', desc: '图标色 / placeholder' },
    ],
  },
  {
    title: '边框',
    items: [
      { name: '--border-color', value: '#e8e2d8', desc: '默认边框' },
      { name: '--border-hover', value: '#d4cdc0', desc: '悬浮边框' },
      { name: '--border-light', value: '#efeae2', desc: '浅边框（卡片/表格外框）' },
      { name: '--divider', value: '#f5f2ed', desc: '分割线' },
    ],
  },
  {
    title: '背景',
    items: [
      { name: '--bg-white', value: '#ffffff', desc: '纯白' },
      { name: '--hover-bg', value: '#f0ece6', desc: '悬浮背景（IconButton）' },
      { name: '--hover-bg-light', value: '#f5f2ed', desc: '浅悬浮（次按钮/分页）' },
      { name: '--active-bg', value: '#E4E0D8', desc: '选中/激活背景' },
    ],
  },
  {
    title: '品牌',
    items: [
      { name: '--brand-dark', value: '#2b2b2b', desc: '品牌深色（主按钮/激活页码）' },
      { name: '--brand-dark-hover', value: '#4d4d4d', desc: '主按钮 hover' },
    ],
  },
  {
    title: '状态色',
    items: [
      { name: '--green / --green-light / --green-text', value: '#22c55e / #dcfce7 / #166534', desc: '成功/通过/活跃' },
      { name: '--red / --red-light / --red-text', value: '#e74c3c / #fef2f2 / #e74c3c', desc: '失败/拒绝/异常' },
      { name: '--yellow / --yellow-light / --yellow-text', value: '#f59e0b / #fef3c7 / #92400e', desc: '待处理/警告' },
      { name: '--blue / --blue-light / --blue-text', value: '#3b6fdf / #edf2ff / #3b6fdf', desc: '信息/标识' },
      { name: '--gray / --gray-light / --gray-text', value: '#6b6258 / #f5f2ed / #b0a89a', desc: '默认/未分配/禁用' },
    ],
  },
  {
    title: '表格',
    items: [
      { name: '--table-header-bg', value: '#faf8f5', desc: '表头背景' },
      { name: '--table-header-text', value: '#8a8276', desc: '表头文字色' },
      { name: '--table-border', value: '#efeae2', desc: '表格外边框' },
      { name: '--table-row-divider', value: '#f5f2ed', desc: '行分割线' },
      { name: '--table-hover-bg', value: '#faf8f5', desc: '行 hover 背景' },
    ],
  },
  {
    title: '圆角 / 阴影 / 过渡',
    items: [
      { name: '--radius-sm / --radius-md / --radius-lg', value: '8px / 12px / 16px', desc: '小/中/大圆角' },
      { name: '--shadow-sm / --shadow-md / --shadow-lg', value: '三级阴影', desc: '轻/中/重阴影' },
      { name: '--transition', value: '0.25s cubic-bezier(...)', desc: '默认过渡' },
    ],
  },
]

const varColumns = [
  { title: '变量名', dataIndex: 'name', key: 'name', width: 320 },
  { title: '值', dataIndex: 'value', key: 'value', width: 260 },
  { title: '说明', dataIndex: 'desc', key: 'desc' },
]

function CSSVariables() {
  return (
    <div>
      <SectionTitle>完整变量清单</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {variableCategories.map(cat => (
          <div key={cat.title}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: 8,
                display: 'block',
              }}
            >
              {cat.title}
            </Text>
            <Table
              columns={varColumns}
              dataSource={cat.items.map((item, idx) => ({ ...item, key: idx }))}
              pagination={false}
              size="small"
              style={{ background: '#fff' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Export ──────────────────────────────────

export default function DesignSystem() {
  return (
    <DataPanel title="设计规范展示">
      <div style={{ padding: '0 28px 20px' }}>
        <Tabs
          defaultActiveKey="base"
          items={[
            { key: 'base', label: '基础规范', children: <BaseSpecs /> },
            { key: 'components', label: '组件展示', children: <ComponentsShowcase /> },
            { key: 'data', label: '数据展示', children: <DataDisplay /> },
            { key: 'interaction', label: '交互反馈', children: <InteractionFeedback /> },
            { key: 'variables', label: 'CSS 变量', children: <CSSVariables /> },
          ]}
        />
      </div>
    </DataPanel>
  )
}
