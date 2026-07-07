import { Card, Row, Col, Statistic } from 'antd'
import {
  TeamOutlined,
  AimOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  StarOutlined,
  ShopOutlined,
} from '@ant-design/icons'

const statCardStyle = { borderRadius: 12, borderColor: '#efeae2' }

export default function Dashboard() {
  return (
    <div style={{ padding: '20px 28px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card style={statCardStyle}>
            <Statistic title="家庭总数" value={0} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card style={statCardStyle}>
            <Statistic title="活跃目标" value={0} prefix={<AimOutlined />} valueStyle={{ color: '#3b6fdf' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card style={statCardStyle}>
            <Statistic title="今日卡片提交" value={0} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card style={statCardStyle}>
            <Statistic title="待验收" value={0} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#f59e0b' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card style={statCardStyle}>
            <Statistic title="今日发放积分" value={0} prefix={<StarOutlined />} valueStyle={{ color: '#22c55e' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card style={statCardStyle}>
            <Statistic title="待处理兑换" value={0} prefix={<ShopOutlined />} valueStyle={{ color: '#6b6258' }} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
