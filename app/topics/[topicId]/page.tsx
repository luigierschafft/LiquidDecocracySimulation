import { redirect } from 'next/navigation'

export default function TopicPage({ params }: { params: { topicId: string } }) {
  redirect(`/topics/${params.topicId}/discussion`)
}
