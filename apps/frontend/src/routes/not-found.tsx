import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/not-found')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-4 text-center'>404 Not Found</h1>
    </div>
  )
}
