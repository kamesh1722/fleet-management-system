import { Router } from 'express';
export default function resourceRoutes(controller){const router=Router();router.get('/',controller.list);router.post('/',controller.create);router.get('/:id',controller.get);router.put('/:id',controller.update);router.delete('/:id',controller.remove);return router;}
