import { Card, Row, Col, Statistic, Space } from 'antd'
import {
  TeamOutlined,
  AimOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  StarOutlined,
  ShopOutlined,
} from '@ant-design/icons'

export default function Dashboard() {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="家庭总数" value={0} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="活跃目标" value={0} prefix={<AimOutlined />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="今日卡片提交" value={0} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="待验收" value={0} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="今日发放积分" value={0} prefix={<StarOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="待处理兑换" value={0} prefix={<ShopOutlined />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>
    </Space>
  )
}
