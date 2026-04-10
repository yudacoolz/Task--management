import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState, useEffect } from 'react'
import type { Notification } from '../../../types/notification'

export const Route = createFileRoute('/auth/notification/')({
  component: RouteComponent,
})

interface Pagination {
  page: string
  limit: string
  total: number
  totalPages: number
  hasPrevPage: boolean
  hasNextPage: boolean
}

interface ResponseNotification {
  data: Notification[]
  meta: Pagination
}

function RouteComponent() {
  const accessToken = localStorage.getItem('access_token')
  const [notification, setNotification] = useState<Notification[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(2)


  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['notification', accessToken, page, limit],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/notification?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      return res.data
    }
  })

  const listPages = Array.from({ length: data?.meta.totalPages }, (_, i) => i + 1)

  useEffect(() => {
    // if (data?.data) {
    //   setNotification(data.data)
    // }
    setNotification(data?.data)
  }, [data])

  const handleRead = async (id: string) => {
    await axios.patch(`http://localhost:3000/notification/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    refetch()
  }

  if (isPending) return <span>Loading...</span>
  if (error) return <span>Oops!</span>

  console.log("data notification : ", data)

  return (
    <div>
      <h1>Notification</h1>

      <button
        className='rounded-lg px-4 py-2 bg-indigo-900 text-white mb-4'
        onClick={() => refetch()}
      >
        Get All Notification
      </button>

      {notification?.map((notif, index) => (
        <div key={index} className='border-black border-2 rounded-lg text-black p-4'>
          <p>{notif.title}</p>
          <p>{notif.description}</p>
          <p>{notif.type}</p>
          <p>{notif.isRead ? 'Read' : 'Unread'}</p>
          <button onClick={() => handleRead(notif.id)} className='rounded-lg px-4 py-2 bg-indigo-900 text-white mb-4'>Read</button>
        </div>
      ))}

      {/* Pagination */}
      <div className='flex gap-2 items-center'>
        <select className='border p-2 rounded-md' name="limit" id="limit" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          <option value="2">2</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
        <button
          className='rounded-lg px-4 py-2 bg-indigo-900 text-white mb-4 disabled:bg-indigo-400 disabled:cursor-not-allowed'
          onClick={() => setPage(data?.meta.page - 1)}
          disabled={!data?.meta.hasPrevPage}
        >
          Previous
        </button>
        <p>Page {data?.meta.page} of {data?.meta.totalPages}</p>
        {listPages?.map((page) => (
          <button
            key={page}
            className='rounded-lg px-4 py-2 bg-indigo-900 text-white mb-4 disabled:bg-indigo-400 disabled:cursor-not-allowed'
            onClick={() => setPage(page)}
            disabled={page === data?.meta.page}
          >
            {page}
          </button>
        ))}
        <button
          className='rounded-lg px-4 py-2 bg-indigo-900 text-white mb-4 disabled:bg-indigo-400 disabled:cursor-not-allowed'
          onClick={() => setPage(data?.meta.page + 1)}
          disabled={!data?.meta.hasNextPage}
        >
          Next
        </button>
      </div>
    </div>
  )
}
