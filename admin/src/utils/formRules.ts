import type { Rule } from 'antd/es/form'
import i18n from '@/locales'

/**
 * 统一表单校验规则
 * 各页面直接引用，避免重复定义
 */

export const requiredRule: Rule = { required: true, message: i18n.t('required') }

export const emailRules: Rule[] = [
  { required: true, message: i18n.t('pleaseEnter', { field: i18n.t('email') }) },
  { type: 'email', message: i18n.t('emailInvalid') },
]

export const passwordRules: Rule[] = [
  { required: true, message: i18n.t('pleaseEnter', { field: i18n.t('password') }) },
  { min: 8, message: i18n.t('passwordMinLength') },
]

export const nameRules: Rule[] = [
  { required: true, message: i18n.t('pleaseEnter', { field: i18n.t('name') }) },
  { max: 50, message: i18n.t('nameMaxLength') },
]
