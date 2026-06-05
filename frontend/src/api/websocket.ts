export type AgentEvent =
  | { type: 'agent_step'; step: number; action: string; result: string; timestamp: string }
  | { type: 'browser_state'; screenshot: string; url: string }
  | { type: 'agent_output'; result: string }
  | { type: 'error'; message: string }
  | { type: 'status'; status: string }
  | { type: 'ping' }

type EventHandler = (event: AgentEvent) => void

export class AgentWebSocket {
  private ws: WebSocket | null = null
  private handlers: EventHandler[] = []
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null

  connect() {
    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000'
    this.ws = new WebSocket(`${WS_URL}/ws/agent`)
    this.ws.onmessage = (msg) => {
      try {
        const event: AgentEvent = JSON.parse(msg.data)
        if (event.type !== 'ping') this.handlers.forEach(h => h(event))
      } catch {}
    }
    this.ws.onclose = () => {
      this.reconnectTimer = setTimeout(() => this.connect(), 3000)
    }
    this.ws.onerror = () => this.ws?.close()
  }

  onEvent(handler: EventHandler) {
    this.handlers.push(handler)
    return () => { this.handlers = this.handlers.filter(h => h !== handler) }
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.ws?.close()
  }
}

export const agentWS = new AgentWebSocket()
