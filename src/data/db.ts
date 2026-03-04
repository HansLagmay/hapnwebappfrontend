// Simple IndexedDB wrapper without external deps
const DB_NAME = 'hapn-db'
const DB_VERSION = 2

export type UserRole = 'consumer' | 'merchant' | 'rider' | 'admin'
export interface User {
  id: string
  email: string
  phone?: string
  password: string
  role: UserRole
  roles?: UserRole[]
  activeRole?: UserRole
  createdAt: number
}

export interface Product {
  id: string
  merchantId: string
  title: string
  price: number
  category: string
  image?: string
  createdAt: number
}

export interface Merchant {
  id: string
  ownerUserId: string
  businessName: string
  createdAt: number
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  qty: number
  addedAt: number
}

export interface EventItem {
  id: string
  title: string
  startsAt: string
  endsAt: string
  image?: string
}

export type OrderStatus = 'placed' | 'preparing' | 'enroute' | 'delivered' | 'cancelled'
export interface Order {
  id: string
  userId: string
  items: Array<{ productId: string, qty: number, price: number }>
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  status: OrderStatus
  createdAt: number
}

let dbPromise: Promise<IDBDatabase> | null = null

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains('users')) {
        const s = db.createObjectStore('users', { keyPath: 'id' })
        s.createIndex('email', 'email', { unique: true })
      }
      if (!db.objectStoreNames.contains('products')) {
        const s = db.createObjectStore('products', { keyPath: 'id' })
        s.createIndex('category', 'category', { unique: false })
        s.createIndex('merchantId', 'merchantId', { unique: false })
      }
      if (!db.objectStoreNames.contains('merchants')) {
        db.createObjectStore('merchants', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('cart')) {
        const s = db.createObjectStore('cart', { keyPath: 'id' })
        s.createIndex('userId', 'userId', { unique: false })
      }
      if (!db.objectStoreNames.contains('events')) {
        db.createObjectStore('events', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('orders')) {
        const s = db.createObjectStore('orders', { keyPath: 'id' })
        s.createIndex('userId', 'userId', { unique: false })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

async function tx<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => Promise<T>): Promise<T> {
  const db = await openDB()
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(store, mode)
    const objectStore = transaction.objectStore(store)
    fn(objectStore).then(resolve).catch(reject)
    transaction.oncomplete = () => {}
    transaction.onerror = () => reject(transaction.error)
  })
}

export const seedIfEmpty = async () => {
  const db = await openDB()
  const t = db.transaction(['users','merchants','products','events'], 'readwrite')
  const users = await new Promise<number>((res, rej) => {
    const c = t.objectStore('users').count(); c.onsuccess = ()=> res(c.result); c.onerror = ()=> rej(c.error)
  })
  if (users === 0) {
    const admin: User = { id: crypto.randomUUID(), email: 'admin@hapn.local', password: 'admin123', role: 'admin', roles:['admin','consumer'], activeRole:'admin', createdAt: Date.now() }
    t.objectStore('users').add(admin)
    const customer: User = { id: crypto.randomUUID(), email: 'customer@hapn.local', password: '123456', role: 'consumer', roles:['consumer'], activeRole:'consumer', createdAt: Date.now() }
    const merchantUser: User = { id: crypto.randomUUID(), email: 'merchant@hapn.local', password: '123456', role: 'merchant', roles:['consumer','merchant'], activeRole:'merchant', createdAt: Date.now() }
    const riderUser: User = { id: crypto.randomUUID(), email: 'rider@hapn.local', password: '123456', role: 'rider', roles:['consumer','rider'], activeRole:'rider', createdAt: Date.now() }
    t.objectStore('users').add(customer)
    t.objectStore('users').add(merchantUser)
    t.objectStore('users').add(riderUser)
    const merchId = crypto.randomUUID()
    const merchant: Merchant = { id: merchId, ownerUserId: admin.id, businessName: 'Davao Finds', createdAt: Date.now() }
    t.objectStore('merchants').add(merchant)
    const categories = ['Food & Beverage','Clothing & Apparel','Stationery']
    for (let i=0;i<12;i++){
      const p: Product = {
        id: crypto.randomUUID(),
        merchantId: merchId,
        title: ['Iced Coffee','Siomai','Cookie','Keychain','Skirt','Donut'][i%6] + ' ' + (i+1),
        price: [120,150,80,60,350,50][i%6],
        category: categories[i%categories.length],
        createdAt: Date.now()
      }
      t.objectStore('products').add(p)
    }
    const e1: EventItem = { id: crypto.randomUUID(), title: 'Pop-up Market @ Roxas', startsAt: '2026-01-03', endsAt: '2026-01-04' }
    const e2: EventItem = { id: crypto.randomUUID(), title: 'Bazaar @ Park', startsAt: '2026-01-09', endsAt: '2026-01-11' }
    t.objectStore('events').add(e1); t.objectStore('events').add(e2)
  }
  await new Promise<void>((res, rej)=> { t.oncomplete = ()=>res(); t.onerror = ()=>rej(t.error) })
}

export const Users = {
  async create(u: Omit<User,'id'|'createdAt'>){
    const item: User = { ...u, id: crypto.randomUUID(), createdAt: Date.now(), roles: u.roles ?? [u.role], activeRole: u.activeRole ?? u.role }
    return tx('users','readwrite', async s => { await s.add(item); return item })
  },
  async findByEmail(email: string){
    const db = await openDB()
    return new Promise<User | undefined>((res, rej)=>{
      const idx = db.transaction('users','readonly').objectStore('users').index('email').get(email)
      idx.onsuccess = ()=> res(idx.result as User | undefined)
      idx.onerror = ()=> rej(idx.error)
    })
  },
  async addRole(email: string, role: UserRole){
    const db = await openDB()
    return new Promise<void>((res, rej)=>{
      const t = db.transaction('users','readwrite'); const s = t.objectStore('users'); const i = s.index('email').get(email)
      i.onsuccess = ()=> { const u = i.result as User; const set = new Set(u.roles ?? [u.role]); set.add(role); u.roles = Array.from(set); s.put(u); res() }
      i.onerror = ()=> rej(i.error)
    })
  },
  async setActiveRole(email: string, role: UserRole){
    const db = await openDB()
    return new Promise<void>((res, rej)=>{
      const t = db.transaction('users','readwrite'); const s = t.objectStore('users'); const i = s.index('email').get(email)
      i.onsuccess = ()=> { const u = i.result as User; u.activeRole = role; s.put(u); res() }
      i.onerror = ()=> rej(i.error)
    })
  },
}

export const Products = {
  async list(){ return tx('products','readonly', async s => {
    return new Promise<Product[]>((res, rej)=>{
      const all: Product[] = []
      const c = s.openCursor()
      c.onsuccess = ()=> {
        const cur = c.result
        if (!cur) return res(all)
        all.push(cur.value as Product); cur.continue()
      }
      c.onerror = ()=> rej(c.error)
    })
  })},
}

export const Cart = {
  async add(userId: string, productId: string, qty=1){
    const item: CartItem = { id: crypto.randomUUID(), userId, productId, qty, addedAt: Date.now() }
    return tx('cart','readwrite', async s => { await s.add(item); return item })
  },
  async byUser(userId: string){ return tx('cart','readonly', async s => new Promise<CartItem[]>((res, rej)=>{
    const idx = s.index('userId').openCursor(IDBKeyRange.only(userId))
    const items: CartItem[] = []
    idx.onsuccess = ()=>{ const cur = idx.result; if(!cur) return res(items); items.push(cur.value as CartItem); cur.continue() }
    idx.onerror = ()=> rej(idx.error)
  }))},
  async clear(userId: string){ return tx('cart','readwrite', async s => new Promise<void>((res, rej)=>{
    const idx = s.index('userId').openCursor(IDBKeyRange.only(userId))
    idx.onsuccess = ()=>{ const cur = idx.result; if(!cur) return res(); s.delete(cur.primaryKey); cur.continue() }
    idx.onerror = ()=> rej(idx.error)
  })) }
}

export const Events = {
  async list(){ return tx('events','readonly', async s => new Promise<EventItem[]>((res, rej)=>{
    const items: EventItem[] = []
    const c = s.openCursor()
    c.onsuccess = ()=>{ const cur = c.result; if(!cur) return res(items); items.push(cur.value as EventItem); cur.continue() }
    c.onerror = ()=> rej(c.error)
  })) }
}

export const Orders = {
  async create(o: Omit<Order,'id'|'createdAt'|'status'>){
    const item: Order = { ...o, id: crypto.randomUUID(), createdAt: Date.now(), status: 'placed' }
    return tx('orders','readwrite', async s => { await s.add(item); return item })
  },
  async byUser(userId: string){ return tx('orders','readonly', async s => new Promise<Order[]>((res, rej)=>{
    const idx = s.index('userId').openCursor(IDBKeyRange.only(userId))
    const items: Order[] = []
    idx.onsuccess = ()=>{ const cur = idx.result; if(!cur) return res(items); items.push(cur.value as Order); cur.continue() }
    idx.onerror = ()=> rej(idx.error)
  }))},
  async updateStatus(id: string, status: OrderStatus){
    return tx('orders','readwrite', async s => new Promise<void>((res, rej)=>{
      const g = s.get(id)
      g.onsuccess = ()=> { const item = g.result as Order; item.status = status; s.put(item); res() }
      g.onerror = ()=> rej(g.error)
    }))
  }
}
