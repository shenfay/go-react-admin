import type { Rule } from 'antd/es/form'

/**
 * 统一表单校验规则
 * 各页面直接引用，避免重复定义
 */

export const requiredRule: Rule = { required: true, message: '此为必填项' }

export const emailRules: Rule[] = [
  { required: true, message: '请输入邮箱' },
  { type: 'email', message: '请输入有效的邮箱地址' },
]

export const passwordRules: Rule[] = [
  { required: true, message: '请输入密码' },
  { min: 8, message: '密码至少 8 位' },
]

export const nameRules: Rule[] = [
  { required: true, message: '请输入名称' },
  { max: 50, message: '名称不超过 50 个字符' },
]
