import { Router, Response, Request } from 'express';
import prisma from '../prismaClient.js';
import { AuthRequest } from '../types/index.js';
import { csrfProtection } from '../middleware/authMiddleware.js';

const router = Router();

// Get all todos for logged-in user
router.get('/', async (req: Request & AuthRequest, res: Response) => {
    try {
        const todos = await prisma.todo.findMany({
            where: {
                userId: req.userId
            }
        });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
});

// Create a new todo
router.post('/', csrfProtection, async (req: Request & AuthRequest, res: Response) => {
    try {
        const todo = await prisma.todo.create({
            data: {
                task: req.body.task,
                userId: req.userId as number
            }
        });
        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create todo' });
    }
});

// Update a todo
router.put('/:id', csrfProtection, async (req: Request & AuthRequest, res: Response) => {
    try {
        const todo = await prisma.todo.update({
            where: {
                id: parseInt(req.params.id),
                userId: req.userId as number
            },
            data: {
                completed: req.body.completed
            }
        });
        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update todo' });
    }
});

// Delete a todo
router.delete('/:id', csrfProtection, async (req: Request & AuthRequest, res: Response) => {
    try {
        const userId = req.userId as number;
        await prisma.todo.delete({
            where: {
                id: parseInt(req.params.id),
                userId
            }
        });
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

export default router;