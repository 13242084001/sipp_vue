import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import register from '@/components/register'
import workbench from '@/components/workbench'
import config from '@/components/config'
import TaskContent from '@/components/TaskContent'
import TaskStatus from '@/components/TaskStatus'
import index from '@/components/index'
import PythonScript from '@/components/PythonScript'
import SippScript from '@/components/SippScript'
import sipp from '@/components/sipp'
import python from '@/components/python'


Vue.use(Router);

export default new Router({
  base: "/",
  routes: [

    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },

    {
      path: '/index',
      name: 'index',
      component: index,
      children: [
        {
          path: 'workbench',
          name: 'workbench',
          meta: {
            requireAuth: true
          },
          component: workbench
        },
        {
          path: 'config',
          name: 'config',
          meta: {
            requireAuth: true
          },
          component: config,

        },
        {
          path: 'TaskContent',
          name: 'TaskContent',
          meta: {
            requireAuth: true
          },
          component: TaskContent,

        },
        {
          path: 'TaskStatus',
          name: 'TaskStatus',
          component: TaskStatus,
          children: [
            {
              path: 'sipp',
              name: 'sipp',
              meta: {
                requireAuth: true
              },
              component: sipp,
            },
            {
              path: 'python',
              name: 'python',
              meta: {
                requireAuth: true
              },
              component: python,
            }
          ]
        },
        {
          path: 'SippScript',
          name: 'SippScript',
          meta: {
            requireAuth: true
          },
          component: SippScript
        },
        {
          path: 'PythonScript',
          name: 'PythonScript',
          meta: {
            requireAuth: true
          },
          component: PythonScript
        },
      ],
    },
  ],
  mode: 'hash'
})

