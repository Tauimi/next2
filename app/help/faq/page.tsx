import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'FAQ - TechnoMart',
  description: 'Часто задаваемые вопросы',
}

export default function HelpFAQPage() {
  // Перенаправляем на основную страницу FAQ
  redirect('/faq')
} 