import { Router, Response, Request } from 'express';
import prisma from '../prismaClient.js';
import { AuthRequest } from '../types/index.js';
import { csrfProtection } from '../middleware/authMiddleware.js';

const router = Router();

// Get all tasks for logged-in user
router.get('/', async (req: Request & AuthRequest, res: Response) => {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                userId: req.userId
            },
            orderBy: [
                { dueDate: 'asc' },
                { priority: 'desc' }
            ]
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Create a new task
router.post('/', csrfProtection, async (req: Request & AuthRequest, res: Response) => {
    try {
        const { title, description, priority, category, dueDate } = req.body;

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority: priority || 'MEDIUM',
                category,
                dueDate: dueDate ? new Date(dueDate) : null,
                userId: req.userId as number,
                status: 'TODO'
            }
        });
        
        res.json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task', details: error instanceof Error ? error.message : String(error) });
    }
});

// Update a task
router.put('/:id', csrfProtection, async (req: Request & AuthRequest, res: Response) => {
    try {
        const { title, description, priority, status, category, dueDate } = req.body;
        const task = await prisma.task.update({
            where: {
                id: parseInt(req.params.id),
                userId: req.userId as number
            },
            data: {
                title,
                description,
                priority,
                status,
                category,
                dueDate: dueDate ? new Date(dueDate) : null
            }
        });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete a task
router.delete('/:id', csrfProtection, async (req: Request & AuthRequest, res: Response) => {
    try {
        const userId = req.userId as number;
        await prisma.task.delete({
            where: {
                id: parseInt(req.params.id),
                userId
            }
        });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

export default router;