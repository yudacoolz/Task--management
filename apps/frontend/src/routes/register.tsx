import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { data, isPending, error, mutate } = useMutation({
    mutationKey: ['register'],
    mutationFn: async () => {
      const res = await axios.post('http://localhost:3000/auth/signup', {
        username: username,
        password: password
      })
      return res.data
    }
  })

  if (isPending) return <span>Loading...</span>
  if (error) return <span>Oops!</span>

  console.log("data response register : ", data);

  return (
    <div className='min-h-screen bg-indigo-900 flex justify-center items-center w-full'>
      <div className='bg-white rounded-xl px-16 py-8'>

        <h1 className='text-2xl font-bold mb-4 text-center'>Register</h1>

        <form action="" className='flex flex-col gap-2 mb-10 min-w-sm'>
          <div className='mb-8 flex flex-col gap-2'>
            <div className='flex flex-col gap-2'>
              <label htmlFor="username" className='text-gray-700'>Username</label>
              <input type="text" id="username" className='border-2 border-gray-200 rounded-lg p-2' value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="password" className='text-gray-700'>Password</label>
              <input type="password" id="password" className='border-2 border-gray-200 rounded-lg p-2' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <button type="submit" className='bg-indigo-900 text-white rounded-lg p-2' onClick={() => mutate()}>Register</button>
        </form>
        <p className='text-center'>Already have an account? <Link to='/login' className='text-indigo-900 underline'>Login</Link></p>
      </div>
    </div>
  )
}
