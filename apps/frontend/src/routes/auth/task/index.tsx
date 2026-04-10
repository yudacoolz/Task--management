import { createFileRoute, useNavigate } from '@tanstack/react-router'
import axios from 'axios'
import { useEffect, useState } from 'react'
import type { Task } from '../../../types/task'
import { dateFormat, dateTimeFormat } from '../../../utils/dateFormat'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/auth/task/')({
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

interface ResponseTask {
  data: Task[]
  meta: Pagination
}

function RouteComponent() {
  const navigate = useNavigate()
  const accessToken = localStorage.getItem('access_token')
  const [backendMsg, setBackendMsg] = useState<Task[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(2)

  console.log("accessToken: ", accessToken)

  // const getAllTask = async () => {
  //   const res = await axios.get('http://localhost:3000/task')
  //   // const res = await axios.get('http://localhost:9999/does-not-exist')
  //   setBackendMsg(res.data)
  // }

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['task', accessToken, page, limit],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/task?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      return res.data
    }
  })

  const listPages = Array.from({ length: data?.meta.totalPages }, (_, i) => i + 1)

  useEffect(() => {
    setBackendMsg(data?.data)
  }, [data])

  if (isPending) return <span>Loading...</span>
  if (error) return <span>Oops!</span>


  console.log("data response : ", data)
  return (
    <div>
      <section>
        <button
          className='rounded-lg px-4 py-2 bg-indigo-900 text-white mb-4'
          onClick={() => refetch()}
        >
          Get All Task
        </button>

        <div>
          <h3 className='font-bold  text-2xl'>Tasks</h3>
          <br />
          {backendMsg && (
            backendMsg.map((data, index) => (
              <div key={index} className='border-black border-2 rounded-lg text-black p-4'>
                <p>{data.title}</p>
                <p>{data.description}</p>
                <p>{data.status}</p>
                <p>{dateFormat(data.createdAt)}</p>
                <p>{dateTimeFormat(data.updatedAt)}</p>
                <button onClick={() => navigate({ to: `/auth/task/${data.id}` })} className='border rounded-md px-4 py-2 bg-blue-500 text-white'> See Detail </button>
              </div>
            ))
          )}
        </div>

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
      </section>
    </div>
  )
}
