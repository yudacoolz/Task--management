import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import axios from 'axios'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { data, isPending, error, mutate } = useMutation({
    mutationKey: ['login'],
    mutationFn: async () => {
      const res = await axios.post('http://localhost:3000/auth/signin', {
        username: username,
        password: password
      })
      console.log("response login : ", res)
      return res.data
    },
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate({ to: "/auth/task" });
    }
  })

  if (error) return <span>Oops!</span>

  console.log("data response register : ", data);


  return (
    <div className='min-h-screen bg-indigo-900 flex justify-center items-center w-full'>
      <div className='bg-white rounded-xl px-16 py-8'>

        <h1 className='text-2xl font-bold mb-4 text-center'>Login</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className='flex flex-col gap-2 mb-10 min-w-sm'
        >
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
          <button type="submit" disabled={isPending} className='bg-indigo-900 text-white rounded-lg p-2 disabled:bg-indigo-400'>
            {isPending ? 'Loading...' : 'Login'}
          </button>
        </form>

        <p>Don't have an account? <Link to='/register' className='text-indigo-900 underline'>Register</Link></p>
      </div>
    </div>
  )
}
