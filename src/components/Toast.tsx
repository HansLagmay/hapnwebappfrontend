import { createContext, useContext, useState } from 'react'

type T = { id: string, text: string }
const C = createContext<{push:(t:string)=>void}>({push:()=>{}})

export function ToastProvider({children}:{children:any}){
  const [items,setItems] = useState<T[]>([])
  const push = (text:string)=> {
    const id = crypto.randomUUID()
    setItems(s=> [...s, {id, text}])
    setTimeout(()=> setItems(s=> s.filter(i=> i.id!==id)), 2500)
  }
  return (
    <C.Provider value={{push}}>
      {children}
      <div style={{position:'fixed', right:16, bottom:16, display:'flex', flexDirection:'column', gap:8}}>
        {items.map(i=> <div key={i.id} style={{background:'#111', color:'#fff', padding:'10px 14px', borderRadius:10, boxShadow:'var(--shadow)'}}>{i.text}</div>)}
      </div>
    </C.Provider>
  )
}

export function useToast(){ return useContext(C) }

