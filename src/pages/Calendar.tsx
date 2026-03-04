import { useEffect, useState } from 'react'
import { Events } from '../data/db'
import type { EventItem } from '../data/db'

export default function Calendar(){
  const [events,setEvents] = useState<EventItem[]>([])
  useEffect(()=>{ (async()=> setEvents(await Events.list()))() },[])
  return (
    <div className="container">
      <h2>Events Calendar</h2>
      <div className="stack">
        {events.map(e=>(
          <div className="card" key={e.id}>
            <div style={{fontWeight:700}}>{e.title}</div>
            <div>{e.startsAt} – {e.endsAt}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
