import type { ServerFunctionClient } from 'payload'
import React from 'react'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import configPromise from '@payload-config'
import { importMap } from './admin/importMap'

import '@payloadcms/next/css'
import './admin-theme.css'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  })
}

const Layout = ({ children }: Args) => {
  return (
    <RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}

export default Layout
