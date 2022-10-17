import Person from './pages/Person'
import Box from './pages/Box'
import Arc from './pages/Arc'
import Line from './pages/Line'
import Tube from './pages/Tube'

const routesConfig = [
    {
        path: '/',
        component: Box,
        pathName: 'Box'
    },
    {
        path: '/person',
        component: Person,
        pathName: 'Person'
    },
    {
        path: '/arc',
        component: Arc,
        pathName: 'Arc'
    },
    {
        path: '/line',
        component: Line,
        pathName: 'Line'
    },
    {
        path: '/tube',
        component: Tube,
        pathName: 'Tube'
    },
]

export default routesConfig