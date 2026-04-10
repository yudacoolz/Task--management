import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { dateFormat, dateTimeFormat } from '../../../utils/dateFormat'

export const Route = createFileRoute('/auth/task/$taskId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { taskId } = Route.useParams()
  const accessToken = localStorage.getItem('access_token');

  const { data, isLoading, error } = useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      return res.data
    }
  })

  if (isLoading) return <span>Loading...</span>
  if (error) return <span>Oops!</span>

  console.log("data response : ", data)
  return (
    <div>
      <h1>Task ID: {taskId}</h1>
      <p>{data.title}</p>
      <p>{data.description}</p>
      <p>{data.status}</p>
      <p>{dateFormat(data.createdAt)}</p>
      <p>{dateTimeFormat(data.updatedAt)}</p>
    </div>
  )
}
