import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import axios from 'axios'
import type { Task } from '../types/task'
import { dateTimeFormat, dateFormat } from '../utils/dateFormat'

export const Route = createFileRoute('/tasks')({
    component: RouteComponent,
})

function RouteComponent() {
    const [count, setCount] = useState(0)
    const [backendMsg, setBackendMsg] = useState<Task[]>([])

    const testBackend = async () => {
        const res = await axios.get('http://localhost:3000/task')
        // const res = await axios.get('http://localhost:9999/does-not-exist')
        setBackendMsg(res.data)
    }

    console.log("data response : ", backendMsg)

    return (
        <>
            <section>

                <div>
                    <h1>Get started</h1>
                    <p>
                        Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
                    </p>
                </div>
                <button
                    className="counter"
                    onClick={() => setCount((count) => count + 1)}
                >
                    Count is {count}
                </button>
                <br />
                <button
                    className="counter"
                    style={{ marginTop: '10px' }}
                    onClick={testBackend}
                >
                    Test Backend
                </button>

                <div>
                    <h3 className='font-bold text-white text-2xl'>Tasks</h3>
                    <br />
                    {backendMsg && (
                        backendMsg.map((data, index) => (
                            <div key={index} className='border-white border-2 rounded-lg  text-white p-4'>
                                <p>{data.title}</p>
                                <p>{data.description}</p>
                                <p>{data.status}</p>
                                <p>{dateFormat(data.createdAt)}</p>
                                <p>{dateTimeFormat(data.updatedAt)}</p>
                            </div>
                        ))
                    )}
                </div>

            </section>



        </>
    )
}
