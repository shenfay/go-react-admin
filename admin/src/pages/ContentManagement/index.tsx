import { useState } from 'react'
import { Table, Tag, Button, Switch, Modal, Form, Input, Select, Space } from 'antd'
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons'
import DataPanel from '@/components/DataPanel'

interface ContentItem {
  id: string
  title: string
  category: string
  author: string
  status: string
  publishTime: string
  views: number
}

const contentData: ContentItem[] = [
  { id: '1', title: 'Q2 运营报告', category: '报告', author: '李雪', status: '已发布', publishTime: '2026-05-26', views: 1280 },
  { id: '2', title: '数据中台产品白皮书 v2.0', category: '文档', author: '张小明', status: '已发布', publishTime: '2026-05-24', views: 3450 },
  { id: '3', title: 'ETL 任务开发规范', category: '规范', author: '王磊', status: '已发布', publishTime: '2026-05-20', views: 890 },
  { id: '4', title: '用户行为分析报告（五月）', category: '报告', author: '李雪', status: '草稿', publishTime: '-', views: 0 },
  { id: '5', title: '数据质量月报', category: '报告', author: '赵鹏', status: '待审核', publishTime: '-', views: 0 },
  { id: '6', title: 'API 接口文档', category: '文档', author: '张小明', status: '已发布', publishTime: '2026-05-15', views: 2100 },
]

export default function ContentManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  const columns = [
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '分类', dataIndex: 'category', key: 'category', render: (v: string) => <Tag>{v}</Tag> },
    { title: '作者', dataIndex: 'author', key: 'author' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (v: string) => (
      <Tag color={v === '已发布' ? 'success' : v === '待审核' ? 'processing' : 'default'}>{v}</Tag>
    )},
    { title: '发布时间', dataIndex: 'publishTime', key: 'publishTime', render: (v: string) => v === '-' ? <span style={{ color: 'var(--text-muted)' }}>未发布</span> : v },
    { title: '浏览量', dataIndex: 'views', key: 'views', render: (v: number) => v.toLocaleString() },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small">发布</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <DataPanel
        title="内容管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            新建内容
          </Button>
        }
      >
        <Table dataSource={contentData} columns={columns} rowKey="id" />
      </DataPanel>

      <Modal
        title="新建内容"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="分类" name="category" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="报告">报告</Select.Option>
              <Select.Option value="文档">文档</Select.Option>
              <Select.Option value="规范">规范</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="内容" name="content">
            <Input.TextArea rows={6} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
