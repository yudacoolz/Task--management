export interface Notification {
    id: string,
    title: string,
    description: string,
    taskId: string,
    userId: string,
    type: string,
    isRead: boolean,
    createdAt: string
}