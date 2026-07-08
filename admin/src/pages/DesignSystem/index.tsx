import { Tag, Button, Input, Select, Switch, Table, Typography, Space } from 'antd'
import DataPanel from '@/components/DataPanel'

const { Title, Text } = Typography

/** 色块展示组件 */
function Swatch({ color, name, variable }: { color: string; name: string; variable: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: color,
          border: color === '#ffffff' ? '1px solid #e8e2d8' : 'none',
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#2b2b2b' }}>{name}</div>
        <div style={{ fontSize: 12, color: '#b0a89a' }}>{variable}</div>
        <div style={{ fontSize: 12, color: '#b0a89a', fontFamily: 'monospace' }}>{color}</div>
      </div>
    </div>
  )
}

export default function DesignSystem() {
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

  const columns = [
    { title: '列名示例', dataIndex: 'name', key: 'name', width: 200 },
    { title: '描述信息', dataIndex: 'desc', key: 'desc', width: 300 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
    { title: '操作', dataIndex: 'action', key: 'action', width: 100 },
  ]

  const data = [
    { key: '1', name: '示例数据一', desc: '这是表格行的示例描述', status: <Tag color="success">活跃</Tag>, action: <Button type="link" size="small">编辑</Button> },
    { key: '2', name: '示例数据二', desc: '展示分页和行样式', status: <Tag color="error">异常</Tag>, action: <Button type="link" size="small">编辑</Button> },
    { key: '3', name: '示例数据三', desc: '浅色表头加行分割线', status: <Tag color="warning">待处理</Tag>, action: <Button type="link" size="small">编辑</Button> },
  ]

  return (
    <DataPanel title="设计规范展示">
      <div style={{ padding: '0 28px 20px' }}>
        <div style={{ border: '1px solid #efeae2', borderRadius: 12, background: '#fff', overflow: 'hidden' }}>
          {/* 1. 色彩体系 */}
          <div style={{ padding: 24, borderBottom: '1px solid #f5f2ed' }}>
            <Title level={4} style={{ margin: 0, marginBottom: 20, fontSize: 16 }}>色彩体系</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {colorGroups.map((group) => (
                <div key={group.title}>
                  <Text style={{ fontSize: 13, fontWeight: 600, color: '#6b6258', marginBottom: 10, display: 'block' }}>{group.title}</Text>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                    {group.items.map((item) => (
                      <Swatch key={item.variable} {...item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. 按钮体系 */}
          <div style={{ padding: 24, borderBottom: '1px solid #f5f2ed' }}>
            <Title level={4} style={{ margin: 0, marginBottom: 20, fontSize: 16 }}>按钮体系</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Space>
                <Button type="primary">主按钮 (Primary)</Button>
                <Button>次按钮 (Default)</Button>
                <Button type="text">文字按钮 (Text)</Button>
                <Button type="primary" disabled>主按钮禁用</Button>
                <Button disabled>次按钮禁用</Button>
              </Space>
              <Space>
                <Button type="primary" size="small">小型主按钮</Button>
                <Button size="small">小型次按钮</Button>
                <Button type="primary" size="large">大型主按钮</Button>
                <Button size="large">大型次按钮</Button>
              </Space>
              <Space>
                <Button type="primary" shape="round">圆角主按钮</Button>
                <Button shape="round">圆角次按钮</Button>
                <Button type="primary" danger>危险按钮</Button>
              </Space>
            </div>
          </div>

          {/* 3. 标签体系 */}
          <div style={{ padding: 24, borderBottom: '1px solid #f5f2ed' }}>
            <Title level={4} style={{ margin: 0, marginBottom: 20, fontSize: 16 }}>标签体系</Title>
            <Space wrap>
              <Tag color="green" style={{ background: '#dcfce7', color: '#166534', border: 'none', borderRadius: 6 }}>通过</Tag>
              <Tag color="red" style={{ background: '#fef2f2', color: '#e74c3c', border: 'none', borderRadius: 6 }}>失败</Tag>
              <Tag color="orange" style={{ background: '#fef3c7', color: '#92400e', border: 'none', borderRadius: 6 }}>待处理</Tag>
              <Tag color="blue" style={{ background: '#edf2ff', color: '#3b6fdf', border: 'none', borderRadius: 6 }}>管理员</Tag>
              <Tag style={{ background: '#f5f2ed', color: '#b0a89a', border: 'none', borderRadius: 6 }}>未分配</Tag>
              <Tag color="green" style={{ background: '#dcfce7', color: '#166534', border: 'none', borderRadius: 6 }}>活跃</Tag>
              <Tag color="red" style={{ background: '#fef2f2', color: '#e74c3c', border: 'none', borderRadius: 6 }}>异常</Tag>
            </Space>
          </div>

          {/* 4. 状态指示器 */}
          <div style={{ padding: 24, borderBottom: '1px solid #f5f2ed' }}>
            <Title level={4} style={{ margin: 0, marginBottom: 20, fontSize: 16 }}>状态指示器</Title>
            <Space size={24}>
              <Space>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                <Text style={{ fontSize: 13, color: '#2b2b2b' }}>正常 / 已认证</Text>
              </Space>
              <Space>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#d4cdc0', display: 'inline-block' }} />
                <Text style={{ fontSize: 13, color: '#2b2b2b' }}>异常 / 未验证</Text>
              </Space>
            </Space>
          </div>

          {/* 5. 表单元素 */}
          <div style={{ padding: 24, borderBottom: '1px solid #f5f2ed' }}>
            <Title level={4} style={{ margin: 0, marginBottom: 20, fontSize: 16 }}>表单元素</Title>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ width: 240 }}>
                <Text style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>输入框</Text>
                <Input placeholder="请输入内容" />
              </div>
              <div style={{ width: 160 }}>
                <Text style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>选择器</Text>
                <Select placeholder="请选择" style={{ width: '100%' }} options={[{ value: '1', label: '选项一' }, { value: '2', label: '选项二' }]} />
              </div>
              <div>
                <Text style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>开关</Text>
                <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />
              </div>
            </div>
          </div>

          {/* 6. 表格预览 */}
          <div style={{ padding: 24, borderBottom: '1px solid #f5f2ed' }}>
            <Title level={4} style={{ margin: 0, marginBottom: 20, fontSize: 16 }}>表格样式</Title>
            <Table
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 3, showSizeChanger: true, showQuickJumper: true, showTotal: (t) => `共 ${t} 条` }}
              size="middle"
            />
          </div>

          {/* 7. 排版示例 */}
          <div style={{ padding: 24 }}>
            <Title level={4} style={{ margin: 0, marginBottom: 20, fontSize: 16 }}>排版层级</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Title style={{ fontSize: 20, fontWeight: 600, color: '#2b2b2b', margin: 0 }}>页面主标题 — 20px/600</Title>
              <Title style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>卡片标题 — 14px/600</Title>
              <Text style={{ fontSize: 13, color: '#2b2b2b' }}>表格正文 / 一般文字 — 13px/400</Text>
              <Text style={{ fontSize: 13, fontWeight: 500, color: '#6b6258' }}>表单标签 — 13px/500</Text>
              <Text style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: '#8a8276' }}>表格表头 — 12px/600/UPPERCASE</Text>
              <Text style={{ fontSize: 12, fontWeight: 500, color: '#b0a89a' }}>辅助文字 — 12px/500</Text>
            </div>
          </div>
        </div>
      </div>
    </DataPanel>
  )
}
