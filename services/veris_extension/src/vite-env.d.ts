/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADK_AGENT_URL: string
  readonly VITE_APP_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
