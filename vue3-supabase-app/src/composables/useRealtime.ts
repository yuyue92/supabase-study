import { onUnmounted } from 'vue'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type PostgresEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

interface RealtimeOptions<T extends Record<string, unknown>> {
  channelName: string
  table: string
  schema?: string
  event?: PostgresEvent
  filter?: string
  onInsert?: (record: T) => void
  onUpdate?: (record: T) => void
  onDelete?: (record: Partial<T>) => void
}

/**
 * Generic realtime subscription factory.
 * Automatically removes the channel on component unmount.
 */
export function useRealtime<T extends Record<string, unknown>>(
  options: RealtimeOptions<T>
) {
  const {
    channelName,
    table,
    schema = 'public',
    event = '*',
    filter,
    onInsert,
    onUpdate,
    onDelete,
  } = options

  let channel: RealtimeChannel | null = null

  function subscribe() {
    channel = supabase
      .channel(channelName)
      .on<T>(
        'postgres_changes' as Parameters<RealtimeChannel['on']>[0],
        {
          event,
          schema,
          table,
          ...(filter ? { filter } : {}),
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            onInsert?.(payload.new as T)
          } else if (payload.eventType === 'UPDATE') {
            onUpdate?.(payload.new as T)
          } else if (payload.eventType === 'DELETE') {
            onDelete?.(payload.old as Partial<T>)
          }
        }
      )
      .subscribe()

    return channel
  }

  function unsubscribe() {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
    }
  }

  onUnmounted(unsubscribe)

  return { subscribe, unsubscribe }
}
